import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import User, { UserModel } from './schema/user.schema';
import { Role } from 'src/common/enums/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetToken } from 'src/auth/schemas/resetToken.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatusDto } from './dto/user-status.dto';
import { HelperService } from 'src/common/services/helper.service';
import { TokenType } from 'src/common/enums/token-type.enum';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserModel>,
    @InjectModel('ResetToken')
    private readonly resetToken: Model<ResetToken>,
    private readonly helper: HelperService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.confirmPassword) {
      throw new BadRequestException(
        "'New password' doest not match the 'confirm new password'",
      );
    }

    const newPasswordHash = await this.getCryptedPassword(
      createUserDto.password,
    );

    const user = new this.userModel({
      ...createUserDto,
      isActive: true,
      isVerified: true,
      password: newPasswordHash,
      role: Role.USER,
    });
    const savedUser = await user.save();

    return savedUser;
  }

  async findAll({ page, size, sort, sortBy, filters }): Promise<any> {
    const skip = (page - 1) * size;
    const schema = this.userModel.schema;
    const query = this.helper.buildFilterQuery(schema, filters);

    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: sort })
      .exec();
    const count = await this.userModel.countDocuments();

    return {
      page,
      size,
      count,
      data: users,
    };
  }

  async findOne({ id, isDeleted = false }): Promise<User> {
    const user = await this.userModel.findOne({ _id: id, isDeleted }).exec();
    if (!user) {
      this.logger.log(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async updateActiveStatus(id: ObjectId, status: UserStatusDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, status, {
      new: true,
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: ObjectId) {
    this.logger.log(`Soft deleting user with id: ${id}`);
    const deletedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async findOneByEmail(email: string, selectPassword = false) {
    let query = this.userModel.findOne({ email, isDeleted: false });
    if (selectPassword) {
      query = query.select('+password');
    }
    const user = await query.exec();

    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }
    return user;
  }

  async changeRole(id: ObjectId, role: Role): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async initiateForgotPassword(email) {
    const user = await this.findOneByEmail(email);
    if (!user || user?.isDeleted) {
      throw new NotFoundException('User not found');
    }
    if (!user.isVerified || !user.isActive) {
      throw new ForbiddenException('User is suspended or not verified');
    }

    await this.sendPasswordResetEmail(user);
    return { message: 'Password reset email sent successfully' };
  }

  async forgotPassword(userId, passwordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      _id: userId,
      isDeleted: false,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (passwordDto.newPassword != passwordDto.confirmNewPassword) {
      throw new BadRequestException(
        "'New password' doest not match the 'confirm new password'",
      );
    }

    await this.verifyToken(
      passwordDto.verificationToken,
      user._id,
      TokenType.FORGOT_PWD,
    );

    const newPasswordHash = await this.getCryptedPassword(
      passwordDto.newPassword,
    );
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { password: newPasswordHash },
    );
    return {
      messsage: 'Passoword reset successfully',
    };
  }

  private getCryptedPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  private async sendPasswordResetEmail(user) {
    // const token = await this.getResetToken(user._id, TokenType.FORGOT_PWD);
    // const appUrl = `${this.configService.get('SITE_LINK')}reset-password/${
    //   user._id
    // }?email=${user.email}&token=${token}`;
    // const emailDTO = new SendEmailDto();
    // emailDTO.bcc = [user.email];
    // emailDTO.sender =
    //   'no-reply@' + this.configService.get<string>('SITE_DOMAIN');
    // emailDTO.subject = 'Password reset requested';
    // emailDTO.html = `
    //   <div>Dear ${user.firstName},</div>
    //   <br>
    //   <p>You have requested to reset your password. Please click the link below to proceed with resetting your password.</p>
    //   <a href="${appUrl}" target="_blank">${appUrl}</a>
    // `;
    // emailDTO.text = emailDTO.html;
    // await this.emailService.sendEmail(emailDTO);
  }

  private async getResetToken(userId, type) {
    const token = this.helper.getVerificationToken({});

    const reset = await this.resetToken.create({
      userId,
      token,
      type,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 Dayz expiry
    });
    return reset.token;
  }

  private async verifyToken(tokenToVerify, userId, type) {
    const token = await this.resetToken.findOne({
      token: tokenToVerify,
      userId,
      isUsed: false,
      type,
    });
    const currentTime = Date.now();

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    if (token.expiresAt < currentTime) {
      throw new GoneException('Token is expired');
    }

    await this.resetToken.updateOne(
      { _id: token._id },
      { $set: { isUsed: true } },
    );
  }
}
