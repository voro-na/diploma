import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorsMiddleware } from './cors';

@Module({
  providers: [CorsMiddleware], // Register the CorsMiddleware as a provider
})
export class CorsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the CorsMiddleware to all routes
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
