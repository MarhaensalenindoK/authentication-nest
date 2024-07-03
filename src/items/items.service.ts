import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dtos/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {
    this.itemRepository = itemRepository;
  }

  create(item: CreateItemDto, user: User) {
    const newItem = this.itemRepository.create(item);

    newItem.user = user;

    return this.itemRepository.save(newItem);
  }

  async approveItem(id: number, approve: boolean) {
    const item = await this.itemRepository.findOneBy({ id });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    item.approved = approve;

    return this.itemRepository.save(item);
  }
}
