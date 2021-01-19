import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, `../../../public`));
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
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
