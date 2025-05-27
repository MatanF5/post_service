import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auto.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiBody({ type: CreatePostDto })
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get('userPosts/:id')
  getPostsByUserId(@Param('id') id: string) {
    return this.postsService.getPostsByUserId(id);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Post(':id/like')
  likePost(@Param('id') id: string, @Request() req) {
    return this.postsService.like(id, req.user.userId);
  }

  @Delete(':id/like')
  unlikePost(@Param('id') id: string, @Request() req) {
    return this.postsService.unlike(id, req.user.userId);
  }
}
