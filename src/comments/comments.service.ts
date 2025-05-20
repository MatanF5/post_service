import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Post') private readonly postModel: Model<Post>,
  ) {}

  async likeComment(commentId: string, userId: string) {
    const userIdObj = new Types.ObjectId(userId);
    const comment = await this.commentModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(commentId),
        likes: { $ne: userIdObj },
      },
      {
        $addToSet: { likes: userIdObj },
      },
      { new: true },
    );
    return comment?.likes.length || 0;
  }

  async unlikeComment(commentId: string, userId: string) {
    const userIdObj = new Types.ObjectId(userId);
    const comment = await this.commentModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(commentId),
        likes: userIdObj,
      },
      {
        $pull: { likes: userIdObj },
      },
      { new: true },
    );
    return comment?.likes.length || 0;
  }
}
