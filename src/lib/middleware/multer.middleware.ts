import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, `../../../public`));
    },
    filename: (_req, file, cb) => {
      const uuid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // tslint:disable-next-line: no-bitwise
        const r = Math.random() * 16 | 0;
        // tslint:disable-next-line: no-bitwise
        const v = c === 'x' ? r : (r & 3 | 8);
        return v.toString();
      });

      const extName = path.extname(file.originalname)
      cb(null, `${Date.now()}_${uuid}${extName}`);
    },
  })
}).single('file');

export default (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err !== undefined) {
      res.status(500).json({
        message: '파일 업로드 실패',
      });
    } else {
      next();
    }
  });
};

