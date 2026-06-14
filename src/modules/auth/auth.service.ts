import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QueryFailedError } from 'typeorm';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/password.util';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private generateTokens(user: Partial<User>) {
    const access_token = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      // change the expresIn lataer to 15m or sth shorter
      { expiresIn: '1d' },
    );

    const refresh_token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { access_token, refresh_token };
  }

  private generateForgotPassowrdToken(user: Partial<User>) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn: this.configService.get('FORGOT_PASSWORD_EXPIRY', '15m'),
        secret: this.configService.get('JWT_FORGOT_PASSWORD_SECRET'),
      },
    );
  }

  private generateVerificationToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn: this.configService.get('EMAIL_VERIFICATION_EXPIRY', '1h'),
        secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
      },
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    return this.generateTokens(user);
  }

  async signup(signupDto: SignUpDto) {
    const existingUser = await this.userService.findOneByEmail(signupDto.email);
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new ConflictException('Email already registered. Please log in.');
      }
      // Reuse the resend logic (or call this.resendVerification with a DTO)
      const token = this.generateVerificationToken(existingUser);
      try {
        this.notificationService.sendVerificationEmail(
          existingUser.email,
          token,
        );
      } catch (emailError) {
        this.logger.error(
          `Resend email failed for ${existingUser.email}`,
          emailError,
        );
      }
      return {
        message: 'A new verification link has been sent to your email.',
      };
    }

    try {
      const hashedPassword = await hashPassword(signupDto.password);

      const user = await this.userService.create({
        email: signupDto.email,
        password: hashedPassword,
        fullName: signupDto.fullName,
        role: signupDto.role,
      });

      const token = this.generateVerificationToken(user);

      try {
        // await this.notificationService.sendVerificationEmail(user.email, token);
        this.notificationService.sendVerificationEmail(user.email, token);
      } catch (emailError) {
        this.logger.error(
          `Verification email failed for ${user.email}`,
          emailError,
        );
      }
      return {
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code?: string };

        if (driverError.code === '23505') {
          throw new ConflictException('Email already exists');
        }
      }
      throw error;
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    let payload: { sub: string; email: string };

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_EMAIL_VERIFICATION_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.userService.findOne(payload.sub);

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    const updatedUser = await this.userService.update(user.id, {
      isVerified: true,
    });

    return this.generateTokens(updatedUser);
  }

  // auth.service.ts
  async resendVerification(resendVerificationDto: ResendVerificationDto) {
    const user = await this.userService.findOneByEmail(
      resendVerificationDto.email,
    );
    if (!user) {
      // Security: return same message even if email not found (prevents enumeration)
      return {
        message:
          'If that email exists and is not verified, a new verification link has been sent.',
      };
    }
    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    const token = this.generateVerificationToken(user);

    // Send email (fire-and-forget or await with logging)
    try {
      this.notificationService.sendVerificationEmail(user.email, token);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${user.email}`,
        error,
      );
    }

    return {
      message: 'Verification email sent (if account exists and not verified).',
    };
  }

  // auth.service.ts (add this method)
  async refresh(
    refreshDto: RefreshDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { refresh_token } = refreshDto;
    try {
      // 1. Verify the refresh token using its dedicated secret
      const payload: { sub: string; email: string } =
        await this.jwtService.verifyAsync(refresh_token, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });

      // 2. Retrieve the user from the database
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 3. (Optional) If you store refresh tokens in DB, check that this token exists and is not revoked
      // You would need a separate service for that.

      // 4. Issue new tokens (rotation)
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Token expired or invalid signature
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);
    if (!user) {
      // change this so that ppl dont try and know what emails are avalable in the db
      throw new UnauthorizedException('Invalid email');
    }

    const forgotPasswordToken = this.generateForgotPassowrdToken(user);

    try {
      this.notificationService.sendVerificationEmail(
        user.email,
        forgotPasswordToken,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${user.email}`,
        error,
      );
      return {
        message: 'Failed to send verification email. Please try again later.',
      };
    }
    return {
      message:
        'Token sent to your email. Please use it to reset your password.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;
    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_FORGOT_PASSWORD_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new BadRequestException('Invalid or expired token'); // generic
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.userService.update(user.id, { password: hashedPassword });

    return this.generateTokens(user);
  }
}
