import { Module } from '@nestjs/common';
import { CollectionModule } from './collection/collection.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CorsModule } from './middleware/cors.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CollectionModule,
    CorsModule,
    // AuthModule,
    UsersModule,
    ProjectModule,
  ],
})
export class AppModule {}
