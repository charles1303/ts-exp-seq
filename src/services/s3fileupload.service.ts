import { injectable } from "inversify";
import { IUploadService } from "./i-upload.service";
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as util from 'util';
import { BadRequestError } from "../errors/app.errors";

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


@injectable()
export default class S3FileUploadService implements IUploadService {

    private uploadConfig: any;

    constructor() {
       this.uploadConfig = multer({
        storage: multerS3({
          s3: s3,
          bucket: AWS_S3_BUCKET_NAME,
          acl: 'public-read',
          key: function(_request, file, cb) {
            cb(null, `${Date.now().toString()} - ${file.originalname}`);
          },
        }),
      });
    }
    
    async upload(req: any, res: any): Promise<any> {
      try {

            const upload = util.promisify(this.uploadConfig.any());

            await upload(req, res);

            let filenames: string[] = [];
            let files: any[] = req.files;
            for(var index in files) { 
              filenames.push(files[index].filename);
            }
            return {status: "success", data:filenames};
        } catch (error) {
          console.log(error);
          throw new BadRequestError(`Failed to upload image file: ${error}`);
    }
  }

    public getUploadConfig () {
        return this.uploadConfig;
    }

}