import { Controller, Get, HttpException, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { ProfilePicStorage } from '../storage/profile-pic.storage';
import * as fs from 'fs';
import { storage } from '../storage/storage';
import { LocalUploadService } from './localupload.service';
import { isSuccess } from '@server/utils/isSuccess.typeguard';
import { Response } from 'express';
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
import { reduceImageQuality } from 'src/utils/reduceImageQuality';
import * as fsPromises from 'fs/promises';
import { join } from 'path';
import { calculateChecksum } from 'src/utils/calculateChecksum';

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
      return res.status(404).json({ error: 'File not found' });
    }
  }

  // read others profile pic
  @Get('read-other/profile-pic/:receiverid/:size')
  async readOtherProfilePic(@GetUser() user: UserEntity, @Res() res: Response, @Param() param: { path: string; size: string; receiverid: string }) {
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

      const isUserInTheContact = await this.contactRepo.findOne({
        where: [{ contact_for: { user_id: param.receiverid } }, { contact: { user_id: user.user_id } }],
      });

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
  async uploadFile(@GetUser() user: UserEntity, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: ExtendedReq) {
    const filePath = `${storage.main}${user.user_id}/attachments/${req.headers.file_id}${req.headers.ext}`;
    const writePath = `${storage.main}${user.user_id}/attachments/${req.headers.file_id}${req.headers.ext}`;
    try {
      if (req.headers.ext === '.png' || req.headers.ext === 'jpeg' || req.headers.ext === '.jpg') {
        await reduceImageQuality({ path: filePath, quality: 30, shouldRemove: false, writePath });
      }
      res.send({
        filePath: req.headers.file_id,
      });
    } catch (error) {
      // fs.unlinkSync(filePath);
    }
  }
  @Post('upload-attachment-thumbnail')
  @UseInterceptors(FileInterceptor('attachment-thumbnail', AttachmentThumbnailStorage))
  async uploadAttachmentsThumbnail(@GetUser() user, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: ExtendedReq) {
    const path = `${storage.main}${user.user_id}/attachments/${req.headers.file_name}-original-thumbnail${req.headers.ext}`;
    const writePath = `${storage.main}${user.user_id}/attachments/${req.headers.file_name}-thumbnail${req.headers.ext}`;

    if (req.headers.ext === '.png' || req.headers.ext === 'jpeg' || req.headers.ext === '.jpg') {
      await reduceImageQuality({ path, quality: 30, shouldRemove: true, writePath });
    }
    res.send({
      filePath: `${req.headers.file_name}-thumbnail`,
    });
  }

  @Get('get-attachment/:user_id/:path/:ext')
  async getAttachmentFile(@Param() param: { path: string; ext: string; user_id: string }, @Res() res: Response) {
    res.sendFile(`${param.path}${param.ext}`, {
      root: `${storage.main}${param.user_id}/attachments/`,
      cacheControl: true,
      dotfiles: 'deny',
      maxAge: parseInt(process.env.PROFILE_IMAGE_CACHE_MAX_AGE) * 1000 || 0,
    });
  }

  @Get('is-attachment-existed/:path')
  async isExisted(@Param() param: { path: string }, @GetUser() user: UserEntity, @Res() res: Response) {
    try {
      const filePath = `${storage.main}${user.user_id}/attachments/${param.path}`;
      fs.accessSync(filePath, fs.constants.F_OK);
      res.send(true);
    } catch (error) {
      res.send(false);
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

  @Get('get-all-media/:chat_id')
  async getAllMediaOfChat(@Param() param: { chat_id: string }, @Res() res: Response) {
    const mediaMessages = await this.localUploadService.getAllMediaOfChatService(param.chat_id);
    res.json(mediaMessages);
  }

  @Post('upload-chunk')
  @UseInterceptors(FileInterceptor('attachment-chunk', chunkStorage))
  async uploadChunk(@Req() req: ExtendedReq, @GetUser() user: UserEntity, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    // we will receive a chunk of a file from the server
    // The client side will send us the chunk and it md5 hash
    // we will save the chunk in the storage and then we will perform SHA-256 checksum
    // if the checksum was successful then we will send the success response
    // else we wil remove that chunk from storage and then we will requests client to send
    // that chunk again

    const filePath = `${storage.main}${user.user_id}/attachments-chunks/${req.headers.file_name}/${req.headers.sended_at}`;
    try {
      const sendedFileHash = req.headers.checksum;

      const bytesUploaded = req.headers.bytesUploaded;
      const totalFileSize = req.headers.totalFileSize;

      // file checksum
      const fileSHA256hash = await calculateChecksum(filePath, 'SHA-256', 'hex');
      // console.log('🚀 ~ LocalUploadController ~ uploadChunk ~ fileSHA256hash:', fileSHA256hash, '\n', sendedFileHash);
      if (fileSHA256hash === sendedFileHash) {
        // if the sended chunk is last chunk then merge all chunks
        if (bytesUploaded === totalFileSize) {
          await mergeChunks(user.user_id, req.headers.file_name, req.headers.ext);
        }
        return res.json({ success: true, uploadedSize: file.size });
      }

      fs.unlinkSync(filePath);

      return res.json({ success: false, uploadedSize: file.size });
    } catch (error) {
      console.log('🚀 ~ LocalUploadController ~ uploadChunk ~ error:', error);
      fs.unlinkSync(filePath);
      return res.json({ success: false });
    }
  }

  @Get('chunks-size/:dir')
  async getChunksInfo(@GetUser() user: UserEntity, @Param() param: { dir: string }, @Res() res: Response) {
    const directory = `${storage.main}${user.user_id}/attachments-chunks/${param.dir}/`;

    try {
      const files = await fsPromises.readdir(directory);

      // Filtering files
      const fileNames = files.filter(async (file) => (await fsPromises.stat(join(directory, file))).isFile());

      let directorySize = 0;

      for (let i = 0; i < fileNames.length; i++) {
        const filePath = join(directory, fileNames[i]);

        // Get file size in bytes
        const fileSize = (await fsPromises.stat(filePath)).size;
        console.log('🚀 ~ LocalUploadController ~ fileNames.forEach ~ fileSize:', fileSize);

        directorySize += fileSize;
      }

      return res.json({ uploadedFileSize: directorySize });
    } catch (err) {
      console.error('🚀 ~ LocalUploadController ~ getChunksInfo ~ err:', err);
      return res.json({ uploadedFileSize: 0 });
    }
  }
}
