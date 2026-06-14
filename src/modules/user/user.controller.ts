import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile-dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: { sub: string }) {
    return this.userService.getProfile(user.sub);
  }

  @Patch('profile')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.userService.updateProfile(user.sub, updateProfileDto);
  }

  // @Post('profile/avatar')
  // @UseInterceptors(FileInterceptor('avatar')) // 'avatar' is the field name in the form-data
  // async uploadAvatar(
  //   @UploadedFile() file: Express.Multer.File,
  //   @CurrentUser() user: { sub: string },
  // ) {
  //   // file.buffer contains the binary data of the uploaded image
  //   return this.profileService.updateAvatar(user.sub, file);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
