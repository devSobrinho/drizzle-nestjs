import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  GetUser,
  IGetUser,
} from 'src/common/decorators/api/get-user.decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024, files: 1 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/image/g)) cb(null, true);
        else {
          cb(
            new BadRequestException(
              'Somente arquivos de imagem são permitidos!',
            ),
            false,
          );
        }
      },
    }),
  )
  @Post('upload-avatar')
  upload(@UploadedFile() file: Express.Multer.File, @GetUser() user: IGetUser) {
    return this.userService.uploadAvatar(file, user);
  }
}
