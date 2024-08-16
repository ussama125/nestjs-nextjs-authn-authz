import mongoose, { Document } from 'mongoose';

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/common/enums/roles.enum';

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  password: string;
}
@Schema({ timestamps: true })
export class UserModel extends Document {
  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ required: false, select: false })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

const User = mongoose.model('User', UserSchema);

export default User;
