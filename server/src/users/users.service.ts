import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private UsersModel: Model<User>,
    ) { }

    async findOne(username: string) {
        const user = await this.UsersModel.findOne({ username })
        return user;
    }

    async singUp(dto: CreateUserDto) {
        const user = await this.UsersModel.create({
            ...dto,
        });

        return user;
    }
}
