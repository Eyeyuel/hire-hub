import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { UserRole } from '../enums';

export interface UserPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export type AuthenticatedRequest = Request & {
  cookies?: { access_token?: string };
  user?: UserPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token);
      request.user = payload; // now typed
      console.log(request.user);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          code: 'TOKEN_EXPIRED',
          message: 'Token expired',
        });
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException({
          code: 'TOKEN_INVALID',
          message: 'Invalid token',
        });
      }
      throw new UnauthorizedException({
        code: 'TOKEN_INVALID',
        message: 'Invalid token',
      });
    }
    return true;
  }

  private extractTokenFromHeader(
    request: AuthenticatedRequest,
  ): string | undefined {
    const authHeader = request.headers.authorization;
    if (typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) return token;
    }
    // Explicitly cast to avoid 'any'
    const cookies = request.cookies as { access_token?: string } | undefined;
    return cookies?.access_token;
  }
}
