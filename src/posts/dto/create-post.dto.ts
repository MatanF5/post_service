import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The content of the post',
    example: 'This is my first post!'
  })
  @IsString()
  content: string;
}
