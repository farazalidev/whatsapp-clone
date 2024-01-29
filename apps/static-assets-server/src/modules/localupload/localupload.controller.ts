import { Controller, Get, HttpException, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { ProfilePicStorage } from '../storage/profile-pic.storage';
import * as fs from 'fs';
import { storage } from '../storage/storage';
import { LocalUploadService } from './localupload.service';
import { isSuccess } from '@server/utils/isSuccess.typeguard';
import { Request, Response } from 'express';
import { GetUser } from '@server/modules/auth/decorators/getuser.decorator';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { Repository } from 'typeorm';
import { ResponseType } from '@server/Misc/ResponseType.type';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { AttachmentFileStorage } from '../storage/attachment-file.storage';
import { AttachmentThumbnailStorage } from '../storage/attachemt-thumbnail.storage';
import { chunkStorage } from '../storage/chunk.storage';
import { isAttachmentResumableResponseType } from './types/response.types';
import { mergeChunks } from 'src/utils/mergeChunks';
import { ExtendedReq } from 'src/guards/types';

@Controller('file')
export class LocalUploadController {
  constructor(
    private localUploadService: LocalUploadService,
    @InjectRepository(ContactEntity) private contactRepo: Repository<ContactEntity>,
    @InjectRepository(UserChatEntity) private userChatRepo: Repository<UserChatEntity>,
  ) {}

  @Post('upload/profile-pic')
  @UseInterceptors(FileInterceptor('profile-pic', ProfilePicStorage))
  async uploadProfilePic(
    @GetUser() user: UserEntity,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<ResponseType> {
    const response = await this.localUploadService.uploadProfilePic(file, user.user_id);
    if (!isSuccess(response)) {
      throw new HttpException(response.error.message, response.error.statusCode);
    }
    return response;
  }

  // read own profile pic
  @Get('read/profile-pic/:size')
  readProfilePic(@GetUser() user: UserEntity, @Param() param: { size: string }, @Req() req, @Res() res: Response) {
    try {
      const filePath = `${storage.main}${user.user_id}/profile-pics/${param.size}.webp`;
      const isFileExists = fs.existsSync(filePath);
      if (!isFileExists) {
        throw new Error('File not found');
      }
      return res.sendFile(`${param.size}.webp`, {
        root: `${storage.main}${user.user_id}/profile-pics/`,
        cacheControl: true,
        dotfiles: 'deny',
        maxAge: 300 * 1000,
      });
    } catch (error) {
      console.log('🚀 ~ LocalUploadController ~ readProfilePic ~ error:', error);
      return res.status(404).json({ error: 'File not found' });
    }
  }

  // read others profile pic
  @Get('read-other/profile-pic/:receiverid/:size')
  async readOtherProfilePic(@GetUser() user: UserEntity, @Res() res: Response, @Param() param: { path: string; size: string; receiverid: string }) {
    console.log('🚀 ~ LocalUploadController ~ readOtherProfilePic ~ user:', user);
    try {
      const isIamAcceptor = await this.userChatRepo.findOne({ where: [{ chat_with: { user_id: user.user_id } }, { chat_for: { user_id: param.receiverid } }] });

      if (isIamAcceptor) {
        const filePath = `${storage.main}${param.receiverid}/profile-pics/${param.size}.webp`;
        const isFileExists = fs.existsSync(filePath);
        if (!isFileExists) {
          throw new HttpException('File not found', 404);
        }
        return res.sendFile(`${param.size}.webp`, {
          root: `${storage.main}${param.receiverid}/profile-pics/`,
          cacheControl: true,
          dotfiles: 'deny',
          maxAge: parseInt(process.env.PROFILE_IMAGE_CACHE_MAX_AGE) * 1000 || 0,
        });
      }

      console.log('receiverid', param.receiverid);
      console.log('user_id', user.user_id);

      const isUserInTheContact = await this.contactRepo.findOne({
        where: [{ contact_for: { user_id: param.receiverid } }, { contact: { user_id: user.user_id } }],
      });

      console.log('🚀 ~ LocalUploadController ~ readOtherProfilePic ~ isUserInTheContact:', isUserInTheContact);

      if (!isUserInTheContact) {
        throw new HttpException('this user is not in your contact list', 400);
      }

      const filePath = `${storage.main}${param.receiverid}/profile-pics/${param.size}.webp`;
      const isFileExists = fs.existsSync(filePath);
      if (!isFileExists) {
        throw new HttpException('File not found', 404);
      }
      return res.sendFile(`${param.size}.webp`, {
        root: `${storage.main}${param.receiverid}/profile-pics/`,
        cacheControl: true,
        dotfiles: 'deny',
        maxAge: 300 * 1000,
      });
    } catch (error) {
      throw new HttpException('unable to get profile pic', 500);
    }
  }

  @Post('upload-attachment-file')
  @UseInterceptors(FileInterceptor('attachment-file', AttachmentFileStorage))
  async uploadFile(@GetUser() user: UserEntity, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: Request) {
    res.send({
      filePath: req.headers.file_name,
    });
  }
  @Post('upload-thumbnail')
  @UseInterceptors(FileInterceptor('attachment-thumbnail', AttachmentThumbnailStorage))
  async uploadAttachmentsThumbnail(@GetUser() user, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: Request) {
    res.send({
      filePath: `${req.headers.file_name}-thumbnail`,
    });
  }

  @Get('get-attachment/:path/:ext')
  async getAttachmentFile(@GetUser() user: UserEntity, @Param() param: { path: string; ext: string }, @Res() res: Response) {
    res.sendFile(`${param.path}${param.ext}`, {
      root: `${storage.main}${user.user_id}/attachments/`,
      cacheControl: true,
      dotfiles: 'deny',
      maxAge: parseInt(process.env.PROFILE_IMAGE_CACHE_MAX_AGE) * 1000 || 0,
    });
  }

  @Post('chunk-upload')
  @UseInterceptors(FileInterceptor('attachment-chunk', chunkStorage))
  async chunksUpload(@UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: ExtendedReq, @GetUser() user: UserEntity) {
    const chunkNumber = req.headers.chunk_number;
    const total_chunks = req.headers.total_chunks;

    // if it is last chunk then merge the file and save it
    if (Number(chunkNumber) === Number(total_chunks) - 1) {
      await mergeChunks(user.user_id, req.headers.file_id as string, req.headers.ext);
    }

    res.send({
      filePath: file.originalname,
    });
  }

  @Get('is-attachment-existed/:path/:ext')
  async isExisted(@Param() param: { path: string; ext: string }, @GetUser() user: UserEntity) {
    console.log(param.path + '.' + param.ext);

    try {
      const filePath = `${storage.main}${user.user_id}/attachments/${param.path}${param.ext}`;
      fs.readFileSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Get('can-resumable-attachment/:path')
  async canResumable(@Param() param: { path: string }, @GetUser() user: UserEntity): Promise<isAttachmentResumableResponseType> {
    try {
      const path = `${storage.main}${user.user_id}/attachments-chunks/${param.path}/`;
      const isExisted = fs.existsSync(path);
      if (isExisted) {
        const files = fs.readdirSync(path);

        const chunkNumbers = files
          .map((fileName) => {
            const match = fileName.match(/-(\d+)$/);
            return match ? parseInt(match[1], 10) : null;
          })
          .filter((chunkNumber) => chunkNumber !== null);

        if (chunkNumbers.length > 0) {
          const lastChunk = Math.max(...chunkNumbers);
          return {
            lastChunk,
            resumable: true,
          };
        } else {
          return {
            lastChunk: 0,
            resumable: false,
          };
        }
      }
      return {
        lastChunk: 0,
        resumable: false,
      };
    } catch (error) {
      return {
        lastChunk: 0,
        resumable: false,
      };
    }
  }
}
