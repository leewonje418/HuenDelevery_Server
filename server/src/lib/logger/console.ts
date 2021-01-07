import * as colors from "colors";
import webLogger from './logger';

const red = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.red(e));
  });
};

const green = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.green(e));
  });
};

const yellow = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.yellow(e));
  });
};

const gray = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.gray(e));
  });
};

const grey = (...str: string[]) => {
  str.forEach((e: string) => {
    webLogger.info(e);
    console.log(colors.grey(e));
  });
};

export default {
  red,
  green,
  yellow,
  grey,
  gray
};