import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auto.guard';
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  @Post(':postId')
  createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.postsService.createComment(
      postId,
      req.user.userId,
      createCommentDto.content,
    );
  }
  @Delete(':postId/:commentId')
  deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.postsService.deleteComment(postId, commentId, req.user.userId);
  }

  @Post(':commentId/like')
  likeComment(@Param('commentId') commentId: string, @Request() req) {
    return this.commentsService.likeComment(commentId, req.user.userId);
  }

  @Post(':commentId/unlike')
  unlikeComment(@Param('commentId') commentId: string, @Request() req) {
    return this.commentsService.unlikeComment(commentId, req.user.userId);
  }
}
