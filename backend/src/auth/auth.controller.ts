import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmRegistrationDto } from 'src/user/dto/confirm-registration.dto';
import { ObjectId } from 'mongoose';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Post('confirm-registration/:id')
  async confirmRegistration(
    @Param('id') id: ObjectId,
    @Body() confirmRegDto: ConfirmRegistrationDto,
  ) {
    // return this.userService.confirmRegistration(id, confirmRegDto);
  }

  @Post(`/login`)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post(`/logout`)
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return { message: 'Logout Successful' };
  }

  @Post('/send-forgot-password-email')
  async sendForgotPasswordEmail(@Body() body) {
    return await this.userService.initiateForgotPassword(body.email);
  }

  @Post('/forgot-password/:id')
  async forgotPassword(
    @Param('id') id: ObjectId,
    @Body() body: ForgotPasswordDto,
  ): Promise<any> {
    return this.userService.forgotPassword(id, body);
  }
}
