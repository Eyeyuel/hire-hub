import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileResponseDto } from './dto/user-response.dto';
import { UpdateProfileDto } from './dto/update-profile-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
      fullName: createUserDto.fullName,
      role: createUserDto.role,
    });
    return await this.userRepository.save(newUser);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    this.userRepository.merge(user, updateData);
    return await this.userRepository.save(user);
  }

  // Optional: find by email (useful for login)
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getProfile(id: string): Promise<ProfileResponseDto> {
    const userProfile = await this.userRepository.findOne({ where: { id } });

    if (!userProfile) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProfileWithoutPassword } = userProfile;

    return userProfileWithoutPassword;
  }

  async updateProfile(
    id: string,
    updateData: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    // maybe send the exception below if no update data
    // if (Object.keys(updateData).length === 0) {
    //   throw new BadRequestException('No update data provided');
    // }
    const user = await this.findOne(id);
    this.userRepository.merge(user, updateData);
    return await this.userRepository.save(user);
  }
}
