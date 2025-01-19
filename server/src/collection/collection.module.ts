import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { Card, CardSchema } from './schemas/card.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { jwtConstants } from 'src/auth/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10000s' },
    })
  ],
  controllers: [CollectionController],
  providers: [
    CollectionService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class CollectionModule { }
