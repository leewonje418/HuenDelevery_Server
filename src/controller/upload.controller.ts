import { Request, Response } from 'express';

export class UploadController {
  upload = async (req: Request, res: Response) => {
    const { file } = req;

    res.status(200).json({
      message: '파일 업로드 성공',
      file,
    });
  }
}