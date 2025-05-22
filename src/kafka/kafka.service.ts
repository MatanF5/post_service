import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { 
  KAFKA_TOPICS, 
  PostCreatedEvent, 
  CommentAddedEvent, 
  CommentLikedEvent, 
  PostLikedEvent 
} from './kafka.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'post-service',
        brokers: ['localhost:9092'],
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  })
  private client: ClientKafka;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Subscribe to topics if needed
    await this.client.connect();
  }

  async emitPostCreated(data: PostCreatedEvent) {
    return this.client.emit(KAFKA_TOPICS.POST_CREATED, data);
  }

  async emitCommentAdded(data: CommentAddedEvent) {
    return this.client.emit(KAFKA_TOPICS.COMMENT_ADDED, data);
  }

  async emitCommentLiked(data: CommentLikedEvent) {
    return this.client.emit(KAFKA_TOPICS.COMMENT_LIKED, data);
  }

  async emitPostLiked(data: PostLikedEvent) {
    return this.client.emit(KAFKA_TOPICS.POST_LIKED, data);
  }
} 