import { Schema } from '@nestjs/mongoose';

import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true }) content: string;

  @Prop({ default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: Date.now }) createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
