/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common';
import * as os from 'os';

const cluster = require('cluster');
import * as process from 'node:process';

const numCPUs = os.cpus().length;
console.log('🚀 ~ numCPUs:', numCPUs);

@Injectable()
export class ClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isMaster) {
      console.log(`MASTER SERVER (${process.pid}) IS RUNNING `);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      callback();
    }
  }
}
