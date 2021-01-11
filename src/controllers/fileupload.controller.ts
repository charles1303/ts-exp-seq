import { inject, injectable } from "inversify";
import { TYPES } from "../configs/types";
import { IUploadService } from "../services/i-upload.service";
import { Request, Response } from 'express';


@injectable()
export default class FileUploadController {
  @inject(TYPES.FileUploadService) private fileUploadService: IUploadService;
  @inject(TYPES.S3FileUploadService) private s3FileUploadService: IUploadService;

  constructor() {}

  public async doUpload(req: Request, res: Response): Promise<any> {

    try {
      const resp = await this.fileUploadService.upload(req, res);
      
      return res.status(resp.status === "success" ? 201: 500).json({status: resp.status, data: resp.data });



    } catch (error) {
        return res.status(500).send({ status: "error", data: `Failed to upload image file: ${error}` });
    }
}

public async doS3Upload(req: Request, res: Response): Promise<any> {

    try {
      await this.s3FileUploadService.upload(req, res);
    } catch (error) {
        return res.status(500).send({ status: "error" });
    
    }
    return res.status(200).send({ status: "success" });
}
}