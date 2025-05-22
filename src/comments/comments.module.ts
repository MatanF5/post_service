import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import { PostsModule } from 'src/posts/posts.module';
import { PostsService } from 'src/posts/posts.service';
import { KafkaModule } from 'src/kafka/kafka.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    KafkaModule
  ],
  providers: [CommentsService, PostsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
