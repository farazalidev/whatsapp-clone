import { Request } from 'express';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import * as core from 'express-serve-static-core';

interface NewHeaders {
  file_name: string;
  total_chunks: string;
  chunk_number: string;
  ext: string;
  checksum: string;
  sended_at: string;
  bytes_uploaded: number;
  total_file_size: number;
  file_checksum: string;
  height: number;
  width: number;
  range: string;
  mime: string;
}

export interface ExtendedReq extends Request<core.ParamsDictionary, any, any, core.Query> {
  user: UserEntity;
  headers: IncomingHttpHeaders & Headers & NewHeaders;
  // Add other properties as needed
}
