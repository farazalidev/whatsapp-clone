import { Request } from 'express';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import * as core from 'express-serve-static-core';

interface NewHeaders {
  file_id: string;
  total_chunks: string;
  chunk_number: string;
  ext: string;
}

export interface ExtendedReq extends Request<core.ParamsDictionary, any, any, core.Query> {
  user: UserEntity;
  headers: IncomingHttpHeaders & Headers & NewHeaders;
  // Add other properties as needed
}
