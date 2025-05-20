import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Comment } from '../comments/schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    const post = new this.postModel({
      ...createPostDto,
      userId: new Types.ObjectId(userId),
    });
    return post.save();
  }

  async getPostsByUserId(userId: string) {
    return this.postModel.find({ userId: new Types.ObjectId(userId) });
  }

  async getPostById(id: string) {
    const post = await this.postModel.findById(id);
    if (post) {
      const likesCount = post.likes?.length || 0;
      return { ...post.toObject(), likesCount };
    }
    return post;
  }

  async delete(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }

  async like(id: string, userId: string) {
    const userIdObj = new Types.ObjectId(userId);
    const post = await this.postModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        likes: { $ne: userIdObj }, // Only update if user hasn't liked
      },
      {
        $addToSet: { likes: userIdObj },
      },
      { new: true },
    );
    return post?.likes.length || 0;
  }

  async unlike(id: string, userId: string) {
    const userIdObj = new Types.ObjectId(userId);
    const post = await this.postModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        likes: userIdObj, // Only update if user has liked
      },
      {
        $pull: { likes: userIdObj },
      },
      { new: true },
    );
    return post?.likes.length || 0;
  }

  async createComment(postId: string, userId: string, content: string) {
    const session = await this.postModel.startSession();
    try {
      await session.withTransaction(async () => {
        // First verify the post exists
        const post = await this.postModel
          .findById(postId)
          .session(session);
        
        if (!post) {
          throw new NotFoundException('Post not found');
        }

        // Create the comment
        const [newComment] = await this.commentModel.create(
          [
            {
              postId: post._id, // Use the actual post's _id
              userId: new Types.ObjectId(userId),
              content,
            },
          ],
          { session },
        );

        // Update the post with the new comment ID
        const updatedPost = await this.postModel.findOneAndUpdate(
          { _id: post._id }, // Use the actual post's _id
          { $push: { comments: newComment._id } },
          { session, new: true },
        );

        if (!updatedPost) {
          throw new Error('Failed to update post with comment');
        }
      });

      return { success: true };
    } finally {
      await session.endSession();
    }
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    const session = await this.postModel.startSession();
    try {
      await session.withTransaction(async () => {
        // First verify the post exists
        const post = await this.postModel
          .findById(postId)
          .session(session);
        
        if (!post) {
          throw new NotFoundException('Post not found');
        }

        // Find the comment and verify ownership
        const comment = await this.commentModel
          .findOne({ _id: commentId, postId: post._id })
          .session(session);

        if (!comment) {
          throw new NotFoundException('Comment not found');
        }

        // Verify the user owns the comment
        if (comment.userId.toString() !== userId) {
          throw new UnauthorizedException('Not authorized to delete this comment');
        }

        // Delete the comment
        await this.commentModel
          .findByIdAndDelete(commentId)
          .session(session);

        // Remove comment reference from post
        const updatedPost = await this.postModel.findOneAndUpdate(
          { _id: post._id },
          { $pull: { comments: commentId } },
          { session, new: true },
        );

        if (!updatedPost) {
          throw new Error('Failed to update post after comment deletion');
        }
      });

      return { success: true };
    } finally {
      await session.endSession();
    }
  }
}
