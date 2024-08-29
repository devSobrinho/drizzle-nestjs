import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/common/database/entities/main';
import { UserRepository } from 'src/common/database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<UserEntity> {
    return (await this.userRepository.getOneById(id, [
      'id',
      'email',
    ])) as UserEntity;
  }
}
