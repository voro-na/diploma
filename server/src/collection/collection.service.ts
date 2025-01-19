import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection } from './schemas/collection.schema';
import { Model, ObjectId, Schema, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from './schemas/card.schema';
import {
  CreateCardDto,
  CreateCollectionDto,
} from './dto/create-collection.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name) private CollectionModel: Model<Collection>,
    @InjectModel(Card.name) private cardModel: Model<Card>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async create(dto: CreateCollectionDto, userId: ObjectId): Promise<Collection> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const createdAt = new Date();

    const cards = [];

    if (dto.cards) {
      for (const cardDto of dto.cards) {
        const card = await this.cardModel.create({
          ...cardDto,
          collection: null,
        });
        cards.push(card);
      }
    }

    const collection = await this.CollectionModel.create({
      ...dto,
      cards: cards,
      createdAt,
      editAt: createdAt,
      user: userId,
    });

    if (cards.length > 0) {
      await this.cardModel.updateMany(
        { _id: { $in: cards } },
        { $set: { collection: collection._id } },
      );
    }

    user.collections.push(collection);
    await user.save();

    return collection;
  }

  async editCollection(
    collectionId: ObjectId,
    updateDto: CreateCollectionDto,
    userId: ObjectId
  ): Promise<Collection> {
    const collection = await this.CollectionModel.findById(collectionId);

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (updateDto.title) {
      collection.title = updateDto.title;
    }

    if (updateDto.description) {
      collection.description = updateDto.description;
    }

    if (updateDto.author) {
      collection.author = updateDto.author;
    }

    const cardsIds = collection.cards.map((card) => '' + card);

    cardsIds.forEach((id) => this.deleteCard(collectionId, id));

    if (updateDto.cards && updateDto.cards.length > 0) {
      for (const cardDto of updateDto.cards) {
        this.addCard(cardDto, collectionId);
      }
    }
    const updatedCollection = await collection.save();

    return updatedCollection;
  }

  async addCard(dto: CreateCardDto, collectionId: ObjectId): Promise<Card> {
    const card = await this.cardModel.create({
      description: dto.description,
      termin: dto.termin,
      collection: collectionId,
    });

    const collection = await this.CollectionModel.findById(collectionId);

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    collection.cards.push(card);

    await collection.save();

    return card;
  }

  async getOne(id: ObjectId): Promise<Collection> {
    const collection = await this.CollectionModel.findById(id)
      .populate({ path: 'cards' })
      .exec();
    return collection;
  }

  async getAll(count = 10, offset = 0, userId: string): Promise<Collection[]> {
    return await this.CollectionModel.find({ user: userId }).skip(offset).limit(count);
  }

  async search(query: string, userId: ObjectId): Promise<Collection[]> {
    const collections = await this.CollectionModel.find({
      title: { $regex: new RegExp(query, 'i') },
      user: userId,
    });

    return collections;
  }

  async delete(id: ObjectId, userId: ObjectId): Promise<Types.ObjectId> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const collection = await this.CollectionModel.findByIdAndDelete(id);

    user.collections = user.collections.filter(
      collection => '' + collection !== String(id)
    )
    await user.save();

    return collection._id;
  }

  async deleteCard(
    collectionId: ObjectId,
    cardId: ObjectId | string,
  ): Promise<Schema.Types.ObjectId| string> {
    
    const collection = await this.CollectionModel.findById(collectionId);

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const updatedCards = collection.cards.filter(
      (card) => '' + card !== String(cardId),
    );

    await this.CollectionModel.findByIdAndUpdate(
      collectionId,
      { cards: updatedCards },
      { new: true }, 
    );

    await this.cardModel.findByIdAndDelete(cardId);

    return cardId;
  }
}
