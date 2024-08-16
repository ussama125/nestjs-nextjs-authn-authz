import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export interface ResetTokenDocument extends Document {
  userId: string;
  token: string;
  type: string;
  expiresAt: Date;
}
@Schema({ timestamps: true })
export class ResetToken extends Document<ResetTokenDocument> {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ default: () => Date.now() + 24 * 60 * 60 * 1000 })
  expiresAt: number;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
export const ResetTokenModel = mongoose.model(
  'ResetTokenSchema',
  ResetTokenSchema,
);
