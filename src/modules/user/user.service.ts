import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/common/database/drizzle/repositories/user.repository';
import { IGetUser } from 'src/common/decorators/api/get-user.decorator';
import { UploadService } from '../upload/upload.service';
import { BUCKER_NAME } from 'src/common/constants/bucker.constant';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uploadService: UploadService,
  ) {}

  async getById(id: string) {
    return await this.userRepository.getOneById(id, ['id', 'email']);
  }

  async uploadAvatar(file: Express.Multer.File, user: IGetUser) {
    const result = await this.uploadService.upload(
      BUCKER_NAME.PROFILE_AVATAR,
      file,
    );

    await this.userRepository.updateById(user.id, {
      avatarUrl: result.fileName,
    });

    return result.presigned;
  }
}
