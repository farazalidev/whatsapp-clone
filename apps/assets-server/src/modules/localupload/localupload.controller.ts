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
import { mergeChunks } from 'src/utils/mergeChunks';
import { ExtendedReq } from 'src/guards/types';
import { reduceImageQuality, reduceThumbnailQuality } from 'src/utils/reduceImageQuality';
import * as fsPromises from 'fs/promises';
import { join } from 'path';
import { calculateChecksum } from 'src/utils/calculateChecksum';
import * as fsExtra from 'fs-extra';
import { dirExists } from 'src/utils/dirExists';
import { getContentType } from 'src/utils/getContentType';
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity';
import { VoiceMessageStorage } from '../storage/voiceMessageStorage';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

@Controller('file')
export class LocalUploadController {
  constructor(
    private localUploadService: LocalUploadService,
    @InjectRepository(ContactEntity) private contactRepo: Repository<ContactEntity>,
    @InjectRepository(UserChatEntity) private userChatRepo: Repository<UserChatEntity>,
    @InjectRepository(MessageMediaEntity) private messageMediaRepo: Repository<MessageMediaEntity>,
    @InjectRepository(MessageEntity) private messagesRepo: Repository<MessageEntity>,
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

  @Get('get-profile-pic/:user_id/:size')
  async getProfilePic(@Res() res: Response, @GetUser() user: UserEntity, @Param() param: { user_id: string; size: string }) {
    try {
      // byMe means if the user request profile pic of its own
      const byMe = param.user_id === user.user_id;

      if (byMe) {
        const filePath = `${storage.main}${param.user_id}/profile-pics/${param.size}.webp`;
        const isFileExists = fs.existsSync(filePath);
        if (!isFileExists) {
          throw new HttpException('File not found', 404);
        }
        return res.sendFile(`${param.size}.webp`, {
          root: `${storage.main}${param.user_id}/profile-pics/`,
          cacheControl: true,
          dotfiles: 'deny',
          maxAge: 300 * 1000,
        });
      }

      // TODO: profile pic privacy implementation
      // check for user relation with the requested user

      // const isUserRelated = await this.contactRepo.findOne({ where: { contact_for: { user_id: param.user_id }, contact: { user_id: user.user_id } } });

      // if (!isUserRelated) {
      //   return res.json({ success: false, error: 'no relation with user' });
      // }

      const filePath = `${storage.main}${param.user_id}/profile-pics/${param.size}.webp`;
      const isFileExists = fs.existsSync(filePath);
      if (!isFileExists) {
        throw new HttpException('File not found', 404);
      }
      return res.sendFile(`${param.size}.webp`, {
        root: `${storage.main}${param.user_id}/profile-pics/`,
        cacheControl: true,
        dotfiles: 'deny',
        maxAge: 300 * 1000,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('upload-attachment-file')
  @UseInterceptors(FileInterceptor('attachment-file', AttachmentFileStorage))
  async uploadFile(@GetUser() user: UserEntity, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: ExtendedReq) {
    const filePath = `${storage.main}${user.user_id}/attachments/${req.headers.file_id}${req.headers.ext}`;
    const writePath = `${storage.main}${user.user_id}/attachments/${req.headers.file_id}${req.headers.ext}`;
    try {
      if (req.headers.mime.startsWith('image/') && !req.headers.mime.startsWith('image/svg')) {
        await reduceImageQuality({ path: filePath, quality: 70, shouldRemove: false, writePath, height: req.headers.height, width: req.headers.width });
      }
      res.send({
        filePath: req.headers.file_id,
      });
    } catch (error) {
      fs.unlinkSync(filePath);
    }
  }

  @Post('upload-attachment-thumbnail')
  @UseInterceptors(FileInterceptor('attachment-thumbnail', AttachmentThumbnailStorage))
  async uploadAttachmentsThumbnail(@GetUser() user, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: ExtendedReq) {
    const path = `${storage.main}${user.user_id}/attachments/${req.headers.file_name}-thumbnail-unp${req.headers.ext}`;
    try {
      if ((req.headers.mime?.startsWith('image/') || req.headers.mime.startsWith('video/')) && !req.headers.mime.startsWith('image/svg')) {
        await reduceThumbnailQuality({
          path,
          shouldRemove: true,
          ext: req.headers.ext,
          file_name: req.headers.file_name,
          root_path: `${user.user_id}/attachments/`,
        });
      }
      res.json({ success: true });
    } catch (error) {
      fs.rmSync(path);
      res.json({ success: false });
    }
  }

  @Get('get-attachment/:user_id/:file_id')
  async getAttachment(@Res() res: Response, @Param() param: { user_id: string; file_id: string }, @Req() req: ExtendedReq) {
    try {
      const foundedFile = await this.messageMediaRepo.findOne({
        where: { id: param.file_id, message: { chat: [{ chat_for: { user_id: param.user_id } }, { chat_with: { user_id: param.user_id } }] } },
      });

      // if the file is an image
      if (foundedFile?.mime?.startsWith('image/')) {
        if (!foundedFile) {
          return res.json({ success: false, error: 'you are not supposed to access this file.' });
        }

        const filePath = `${param.file_id}${foundedFile.ext}`;
        const root = `${storage.main}${param.user_id}/attachments/`;
        return res.sendFile(filePath, { root });
      }

      // if the file is vide
      if (foundedFile?.mime.startsWith('video/')) {
        const videoPath = `${storage.main}${param.user_id}/attachments/${param.file_id}${foundedFile.ext}`;
        const range = req.headers.range;

        if (range) {
          const videoSize = fs.statSync(videoPath).size;
          const chunkSize = 0.5 * 1024 * 1024;
          const start = Number(range.replace(/\D/g, ''));
          const end = Math.min(start + chunkSize, videoSize - 1);

          const contentLength = end - start + 1;
          const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
          };
          res.writeHead(206, headers);
          const stream = fs.createReadStream(videoPath, { start, end });
          stream.pipe(res);
        }
        return { error: 'range is not specified' };
      }
    } catch (error) {
      return res.json({ success: false, error: 'error while fetching this file.' });
    }
  }

  @Get('get-attachment-thumbnail/:user_id/:file_id/:suffix')
  async getAttachmentThumbnail(
    @GetUser() user: UserEntity,
    @Param() param: { file_id: string; user_id: string; suffix: string },
    @Res() res: Response,
    @Req() req: ExtendedReq,
  ) {
    const filePath = `${param.file_id}-thumbnail-${param.suffix || 'sm'}${req.headers.ext}`;
    const rootPath = `${storage.main}${param.user_id}/attachments/`;
    return res.sendFile(filePath, {
      root: rootPath,
      cacheControl: true,
      dotfiles: 'deny',
      maxAge: parseInt(process.env.PROFILE_IMAGE_CACHE_MAX_AGE) * 1000 || 0,
    });
  }

  /**
   * user_id should be the file uploader user_id
   */
  @Get('attachment-download/:user_id/:file_id')
  async download(@Res() res: Response, @Param() param: { user_id: string; file_id: string }) {
    const foundedFile = await this.messageMediaRepo.findOneOrFail({
      where: { id: param.file_id, message: { chat: [{ chat_for: { user_id: param.user_id } }, { chat_with: { user_id: param.user_id } }] } },
    });

    const filePath = `${storage.main}${param.user_id}/attachments/${param.file_id}${foundedFile.ext}`;

    if (!foundedFile) {
      return res.status(404).json({ success: false, error: 'file not be founded or unauthorized' });
    }

    try {
      res.setHeader('Content-disposition', 'attachment; filename=' + foundedFile.original_name);
      res.setHeader('Content-type', getContentType(foundedFile.ext));
      const fileStream = fs.createReadStream(filePath);
      return fileStream.pipe(res);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }

  @Get('get-all-media/:chat_id')
  async getAllMediaOfChat(@Param() param: { chat_id: string }, @Res() res: Response) {
    try {
      const mediaMessages = await this.localUploadService.getAllMediaOfChatService(param.chat_id);
      res.json(mediaMessages);
    } catch (error) {
      console.log(error);
    }
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

      const bytesUploaded = req.headers.bytes_uploaded;
      const totalFileSize = req.headers.total_file_size;

      // file checksum
      const fileSHA256hash = await calculateChecksum(filePath, 'SHA-256', 'hex');
      if (fileSHA256hash === sendedFileHash) {
        // if the sended chunk is last chunk then merge all chunks
        if (bytesUploaded === totalFileSize) {
          await mergeChunks(user.user_id, req.headers.file_name, req.headers.ext);

          // after merging chunks check checksum file
          const savedFilePath = `${storage.main}${user.user_id}/attachments/${req.headers.file_name}${req.headers.ext}`;

          const chunksPath = `${storage.main}${user.user_id}/attachments-chunks/${req.headers.file_name}/`;

          const savedFileCheckSum = await calculateChecksum(savedFilePath, 'SHA-256', 'hex');

          //  if the checksum unsuccessful
          if (savedFileCheckSum !== req.headers.file_checksum) {
            await fsExtra.remove(chunksPath);

            fs.rm(savedFilePath, { force: true }, (err) => {
              console.log(err);
            });
          }
        }

        return res.json({ success: true, uploadedSize: file.size });
      }

      fs.unlinkSync(filePath);

      return res.json({ success: false, uploadedSize: file.size });
    } catch (error) {
      fs.unlinkSync(filePath);
      return res.json({ success: false });
    }
  }

  @Get('chunks-size/:dir')
  async getChunksInfo(@GetUser() user: UserEntity, @Param() param: { dir: string }, @Res() res: Response, @Req() req: ExtendedReq) {
    const chunksDirectory = `${storage.main}${user.user_id}/attachments-chunks/${param.dir}/`;
    const fileDirectory = `${storage.main}${user.user_id}/attachments/${param.dir}${req.headers.ext}`;

    try {
      const isChunksDirectoryExisted = dirExists(chunksDirectory);

      const isFileExisted = fs.existsSync(fileDirectory);

      if (!isChunksDirectoryExisted) {
        return res.json({ uploadedFileSize: 0, chunksDirectory: isChunksDirectoryExisted, isFileExisted });
      }

      const files = await fsPromises.readdir(chunksDirectory);

      // Filtering files
      const fileNames = files.filter(async (file) => (await fsPromises.stat(join(chunksDirectory, file))).isFile());

      let directorySize = 0;

      for (let i = 0; i < fileNames.length; i++) {
        const filePath = join(chunksDirectory, fileNames[i]);

        // Get file size in bytes
        const fileSize = (await fsPromises.stat(filePath)).size;

        directorySize += fileSize;
      }

      return res.json({ uploadedFileSize: directorySize, chunksDirectory: isChunksDirectoryExisted, isFileExisted });
    } catch (err) {
      return res.json({ uploadedFileSize: 0, chunksDirectory: false, isFileExisted: false, err });
    }
  }

  @Get('merge-chunks/:dir')
  async mergeChunks(@GetUser() user: UserEntity, @Param() param: { dir: string }, @Req() req: ExtendedReq, @Res() res: Response) {
    try {
      await mergeChunks(user.user_id, param.dir, req.headers.ext);
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false });
    }
  }

  @Post('upload-voice-message')
  @UseInterceptors(FileInterceptor('voice-message', VoiceMessageStorage))
  async uploadVoiceMessage(@UploadedFile() file: Express.Multer.File, @GetUser() user: UserEntity, @Req() req: ExtendedReq) {
    try {
      const uploadedFilePath = `${storage.main}${user.user_id}/voice-messages/${req.headers.file_name}`;

      await fsExtra.exists(uploadedFilePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Get('get-voice-message/:message_id/:sender_id')
  async getVoiceMessage(
    @GetUser() user: UserEntity,
    @Param() param: { message_id: string; chat_id: string; sender_id: string },
    @Req() req: ExtendedReq,
    @Res() res: Response,
  ) {
    // first check if this voice message belongs to user
    const isMessageExisted = await this.messagesRepo.findOne({
      where: { id: param.message_id, chat: [{ chat_for: { user_id: user.user_id } }, { chat_with: { user_id: user.user_id } }] },
    });

    if (isMessageExisted) {
      const messagePath = `${storage.main}${param.sender_id}/voice-messages/${isMessageExisted.media.id}`;

      const audioSize = fs.statSync(messagePath).size;

      res.writeHead(200, {
        'Content-Type': 'audio/webm',
        'Content-Length': audioSize,
      });
      const readStream = fs.createReadStream(messagePath);
      readStream.pipe(res);
    }
  }
}
