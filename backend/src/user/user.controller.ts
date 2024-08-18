import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminOrSameUserGuard } from 'src/common/guards/admin-or-same-user.guard';
import { ObjectId } from 'mongoose';
import { UserStatusDto } from './dto/user-status.dto';
import { EnumValidationPipe } from 'src/common/pipes/enum-validation.pipe';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  // TODO: use isDeleted false or !isDeleted in all APIs.
  constructor(private userService: UserService) {}

  @Get('/')
  @UseGuards(AdminGuard)
  async getAll(@Req() req: any, @Query() query: Record<string, any>) {
    const {
      page = 1,
      size = 10,
      sort = 'desc',
      sortBy = 'updatedAt',
      ...filters
    } = query;

    const users = await this.userService.findAll({
      page,
      size,
      sort,
      sortBy,
      filters,
    });
    return users;
  }

  @Get('/:id')
  @UseGuards(AdminOrSameUserGuard)
  async getById(@Param('id') id) {
    const user = await this.userService.findOne({ id });
    return user;
  }

  @Put('/:id')
  @UseGuards(AdminOrSameUserGuard)
  async update(
    @Param('id') id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return updatedUser;
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: ObjectId) {
    const deletedUser = await this.userService.delete(id);
    return deletedUser;
  }

  @Post('/:id/account-status')
  @UseGuards(AdminGuard)
  async updateActiveStatus(
    @Param('id') id: ObjectId,
    @Body() status: UserStatusDto,
  ) {
    const user = await this.userService.updateActiveStatus(id, status);
    return user;
  }

  @Post('/:id/role/:role')
  @UseGuards(AdminGuard)
  async changeRole(
    @Param('id') id: ObjectId,
    @Param('role', new EnumValidationPipe(Role)) role: Role,
  ) {
    const user = await this.userService.changeRole(id, role);
    return user;
  }
}
