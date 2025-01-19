import { Module } from '@nestjs/common';
import { CollectionModule } from './collection/collection.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CorsModule } from './middleware/cors.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://voropaevaanadya:YFLZ11ktyz8@cluster0.eltmkit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    CollectionModule,
    CorsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
