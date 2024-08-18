import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import {
  TestDbModule,
  closeInMongodConnection,
} from '../../test/test-db.module';
import { Model } from 'mongoose';
import User, { UserModel, UserSchema } from '../user//schema/user.schema';
import { UserService } from 'src/user/user.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ResetTokenSchema } from './schemas/resetToken.schema';
import { HelperService } from 'src/common/services/helper.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserModel>;
  let user: User;

  afterAll(async () => await closeInMongodConnection());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDbModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([
          { name: 'ResetToken', schema: ResetTokenSchema },
        ]),
      ],
      providers: [AuthService, UserService, HelperService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserModel>>(getModelToken('User'));

    const password = await bcrypt.hash('@Password1', 10);
    user = await userModel.create({
      email: `${randomStringGenerator()}@yopmail.com`,
      password,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'Super Admin',
      isVerified: true,
      isActive: true,
    });
  });

  afterEach(async () => {
    userModel && (await userModel.deleteMany({}));
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user by credentials', async () => {
      const result = await service.validateUser(user.email, '@Password1');

      expect(result).toBeDefined();
      expect(result._id).toBeDefined();
      expect(result.email).toEqual(user.email);
    });

    it('should return null if user is not validated by credentials', async () => {
      const result = await service.validateUser(user.email, '@InvalidPass');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should set cookie maxAge for user based on remember me', async () => {
      const createUserDto: any = new CreateUserDto();
      createUserDto.email`${randomStringGenerator()}@yopmail.com`;
      createUserDto.firstName = 'First';
      createUserDto.lastName = 'Last';
      createUserDto.password = '@Password1';
      createUserDto.confirmPassword = '@Password1';

      const result = await service.login(createUserDto);

      expect(result).toBeDefined();
    });
  });
});
