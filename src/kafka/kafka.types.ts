import { Document, Types } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { Comment } from '../comments/schemas/comment.schema';

export interface PostCreatedEvent {
  postId: Post['_id'];
  userId: Post['userId'];
  content: string;
  createdAt: Date;
}

export interface CommentAddedEvent {
  postId: Post['_id'];
  commentId: Comment['_id'];
  userId: Comment['userId'];
  content: string;
  createdAt: Date;
}

export interface CommentLikedEvent {
  postId: Post['_id'];
  commentId: Comment['_id'];
  userId: Types.ObjectId;
  createdAt: Date;
}

export interface PostLikedEvent {
  postId: Post['_id'];
  userId: Types.ObjectId;
  createdAt: Date;
}

export const KAFKA_TOPICS = {
  POST_CREATED: 'post.created',
  COMMENT_ADDED: 'comment.added',
  COMMENT_LIKED: 'comment.liked',
  POST_LIKED: 'post.liked',
} as const; 