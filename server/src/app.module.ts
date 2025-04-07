import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CorsModule } from './middleware/cors.middleware';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CorsModule,
    ProjectModule,
  ],
})
export class AppModule { }
