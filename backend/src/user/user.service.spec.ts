import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import mongoose, { Model } from 'mongoose';
import {
  TestDbModule,
  closeInMongodConnection,
} from '../../test/test-db.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { HelperService } from 'src/common/services/helper.service';
import { UserModel, UserSchema } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Role } from 'src/common/enums/roles.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserStatusDto } from './dto/user-status.dto';
import {
  ResetToken,
  ResetTokenSchema,
} from 'src/auth/schemas/resetToken.schema';

const getUserDto = ({ email = null }): CreateUserDto => {
  const createUserDto: CreateUserDto = new CreateUserDto();
  createUserDto.email = email || `${randomStringGenerator()}@yopmail.com`;
  createUserDto.firstName = 'First';
  createUserDto.lastName = 'Last';
  createUserDto.password = '@Password1';
  createUserDto.confirmPassword = '@Password1';
  return createUserDto;
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserModel>;
  let resetTokenModel: Model<ResetToken>;

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
      providers: [UserService, HelperService],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserModel>>(getModelToken('User'));
    resetTokenModel = module.get<Model<ResetToken>>(
      getModelToken('ResetToken'),
    );
  });

  afterEach(async () => {
    await userModel.deleteMany({});
    await resetTokenModel.deleteMany({});
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Signup', () => {
    it('should signup a user', async () => {
      const createUserDto = getUserDto({});

      const result = await service.create(createUserDto);
      expect(result.firstName).toEqual(createUserDto.firstName);
      expect(result.lastName).toEqual(createUserDto.lastName);
      expect(result.email).toEqual(createUserDto.email);
      expect(result.isVerified).toBeTruthy();
      expect(result.isActive).toBeTruthy();
    });

    it('should throw BadRequestException for mismatch passwords', async () => {
      const createUserDto = getUserDto({});
      createUserDto.password = '@Password1';
      createUserDto.confirmPassword = '@Change1';

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUsers', () => {
    it('should return a list of users', async () => {
      const usersData: CreateUserDto[] = [getUserDto({}), getUserDto({})];

      await Promise.all(usersData.map((data) => service.create(data)));

      const result = await service.findAll({
        page: 1,
        size: 10,
        sort: 'asc',
        sortBy: 'name',
        filters: [],
      });

      expect(result.page).toEqual(1);
      expect(result.size).toEqual(10);
      expect(result.data.length).toEqual(2);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const createUserDto = getUserDto({});
      const createdUser = await service.create(createUserDto);

      const result = await service.findOne({ id: createdUser._id });

      expect(result._id).toEqual(createdUser._id);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const nonExistentId: any = new mongoose.Types.ObjectId();

      await expect(service.findOne({ id: nonExistentId })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return user by email', async () => {
      const createUserDto = getUserDto({});
      const createdUser = await service.create(createUserDto);

      const result = await service.findOneByEmail(createdUser.email, true);

      expect(result._id).toEqual(createdUser._id);
      expect(result.email).toEqual(createdUser.email);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const nonExistentId: any = new mongoose.Types.ObjectId();

      await expect(
        service.findOneByEmail(nonExistentId, false),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateActiveStatus', () => {
    it('should update a user status', async () => {
      const user = getUserDto({});
      const createdUser: any = await service.create(user);

      const dto = new UserStatusDto();
      dto.isActive = true;

      const result = await service.updateActiveStatus(createdUser._id, dto);

      expect(result._id).toEqual(createdUser._id);
      expect(result.isActive).toBeTruthy();
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const nonExistentId: any = new mongoose.Types.ObjectId();
      const dto = new UserStatusDto();

      await expect(
        service.updateActiveStatus(nonExistentId, dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeUserRole', () => {
    it('should update a user role', async () => {
      const user = getUserDto({});
      const createdUser: any = await service.create(user);

      const result = await service.changeRole(createdUser._id, Role.USER);

      expect(result._id).toEqual(createdUser._id);
      expect(result.role).toEqual(Role.USER);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const nonExistentId: any = new mongoose.Types.ObjectId();

      await expect(
        service.changeRole(nonExistentId, Role.USER),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = getUserDto({});
      const createdUser: any = await service.create(user);

      const result = await service.delete(createdUser._id);
      expect(result._id).toEqual(createdUser._id);
      expect(result.isDeleted).toBeTruthy();
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const nonExistentId: any = new mongoose.Types.ObjectId();

      await expect(service.delete(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
