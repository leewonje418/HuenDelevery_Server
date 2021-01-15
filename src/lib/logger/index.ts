import colors from 'colors';
import webLogger from './logger';

const error = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.red(e));
  });
};

const success = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.green(e));
  });
};

const warning = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.yellow(e));
  });
};

export default {
  error,
  success,
  warning,
};