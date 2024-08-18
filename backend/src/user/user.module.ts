import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalStrategy } from 'src/common/services/local.strategy';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ResetTokenSchema } from 'src/auth/schemas/resetToken.schema';
import { HelperService } from 'src/common/services/helper.service';
import { UserSchema } from './schema/user.schema';
// import { EmailerService } from 'src/emailer/emailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'ResetToken', schema: ResetTokenSchema },
    ]),
  ],
  providers: [
    UserService,
    AuthService,
    JwtService,
    LocalStrategy,
    // EmailerService,
    HelperService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
