import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import {
  CreateCardDto,
  CreateCollectionDto,
} from './dto/create-collection.dto';
import { ObjectId } from 'mongoose';

@Controller('/collections')
export class CollectionController {
  constructor(private collectionService: CollectionService) { }

  @Post()
  create(
    @Body() dto: CreateCollectionDto,
    @Request() req) {
    const userId = req.user.sub;
    return this.collectionService.create(dto, userId);
  }

  @Put(':collectionId')
  async editCollection(
    @Param('collectionId') collectionId: ObjectId,
    @Body() updateDto: CreateCollectionDto,
    @Request() req
  ) {
    const userId = req.user.sub;
    try {
      return this.collectionService.editCollection(collectionId, updateDto, userId);
    } catch (error) {
      throw error;
    }
  }

  @Post(':collectionId/card')
  createCard(
    @Body() dto: CreateCardDto,
    @Param('collectionId') collectionId: ObjectId,
    @Request() req
  ) {
    return this.collectionService.addCard(dto, collectionId);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId, @Request() req) {
    return this.collectionService.getOne(id);
  }

  @Get()
  getAll(@Query('count') count: number, @Query('offset') offset: number, @Request() req) {
    const userId = req.user.sub;
    return this.collectionService.getAll(count, offset, userId);
  }

  @Get('search')
  search(@Query('query') query: string, @Request() req) {
    const userId = req.user.sub;
    return this.collectionService.search(query, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId, @Request() req) {
    const userId = req.user.sub;
    return this.collectionService.delete(id, userId);
  }

  @Delete(':collectionId/card/:cardId')
  deleteCard(
    @Param('collectionId') collectionId: ObjectId,
    @Param('cardId') cardId: ObjectId,
    @Request() req
  ) {
    try {
      return this.collectionService.deleteCard(collectionId, cardId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
