import { Response } from 'express';
import HttpError from '../../error/httpError';
import logger from '../logger/logger';

export default (res: Response, err: HttpError | Error) => {
  logger.error(err);

  if (err instanceof HttpError) {
    res.status(err.code).json({
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    message: '서버 오류',
  });
}