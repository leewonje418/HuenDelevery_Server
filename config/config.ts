import 'dotenv/config';

import logger from '../src/lib/logger'

const getProcessEnv = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    const err = `${name} 환경변수가 정의되지 않았습니다`;
    logger.error(err, 'getProcessEnv');
    throw new Error(err);
  }

  return value;
};

export const PORT = getProcessEnv('PORT');

export const MYSQL = {
  USERNAME: getProcessEnv('MYSQL_USERNAME'),
  PASSWORD: getProcessEnv('MYSQL_PASSWORD'),
  DATABASE: getProcessEnv('MYSQL_DATABASE'),
  HOST: getProcessEnv('MYSQL_HOST'),
  PORT: parseInt(getProcessEnv('MYSQL_PORT'), 10),
  SYNC: getProcessEnv('MYSQL_SYNC') === 'true',
};

export const JWT = {
  SECRET: getProcessEnv('JWT_SECRET'),
  EXPIRES_IN: getProcessEnv('JWT_EXPIRES_IN'),
};
