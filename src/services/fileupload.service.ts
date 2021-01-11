
import { injectable } from "inversify";
import * as multer from 'multer';
import { BadRequestError } from "../errors/app.errors";
import { IUploadService } from "./i-upload.service";
import * as util from 'util';


const storage = multer.diskStorage({    destination: function (_req, _file, cb) {
        cb(null, process.env.UPLOAD_DIR)
    },

    filename: function (_req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
});

const fileFilter = (_req: any,file: any,cb: any) => {
if(file.mimetype === "image/jpg"  || 
   file.mimetype ==="image/jpeg"  || 
   file.mimetype ===  "image/png"){
 
cb(null, true);
}else{
  cb(new Error("Image uploaded is not of type jpg/jpeg  or png"),false);
}}

const upload = multer({storage: storage, fileFilter : fileFilter});

@injectable()
export default class FileUploadService implements IUploadService {


    private uploadConfig: any;
    private uploadConfig2: any;

    constructor() {
        this.uploadConfig = multer({
          storage: multer.diskStorage({
              destination: function (_req, _file, cb) {
                cb(null, process.env.UPLOAD_DIR)
              },
              filename: function (_req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now())
              }
            }),
        });

          this.uploadConfig2 = upload;
      }

      public getUploadConfig () {
        return this.uploadConfig;
    }

    public getUploadConfig2 () {
        return this.uploadConfig2;
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

    async upload4(req: any, res: any): Promise<any> {
        try {
            this.doupload(req, res, function(error) {
              throw new BadRequestError(`Failed to upload image file: ${error}`);
              
            });
            return {status: "success", data:"File uploaded"};
          } catch (error) {
            console.log(error);
            throw new BadRequestError(`Failed to upload image file: ${error}`);
      }
    }



    async upload3(req: any, res: any): Promise<any> {
        var resp: any;
        try {
            this.doupload(req, res, function(error) {
              if (error) {
                console.log(error);
                resp = new Promise((resolve, _reject) => {
                    resolve({status: "error", message:`Failed to upload image file: ${error}`});
                });
                return {status: "error", message:`Failed to upload image file: ${error}`};
              }
              resp =  new Promise((resolve, _reject) => {
                resolve({status: "success", message:`${req.files[0].filename}`});
            });
              return {status: "success", message:`${req.files[0].filename}`};
              
            }
            );
          } catch (error) {
            console.log(error);
            resp =  new Promise((resolve, _reject) => {
                resolve({status: "error", message:`Failed to upload image file: ${error}`});
            });
      }
      
      return resp;
    }

   async upload2(req: any, res: any): Promise<any> {
        try {
            this.doupload(req, res, function(error) {
              if (error) {
                console.log(error);
                return res.status(404).json({status: "error", message:`Failed to upload image file: ${error}`});
                
              }
              return res.status(201).json({status: "success", message:`${req.files[0].filename}`});
              
            });
          } catch (error) {
            console.log(error);
            return res.status(500).json({status: "error", message:`Failed to upload image file: ${error}`});
      }
    }

    doupload = multer({
        storage: multer.diskStorage({
            destination: function (_req, _file, cb) {
              cb(null, process.env.UPLOAD_DIR)
            },
            filename: function (_req, file, cb) {
              cb(null, file.fieldname + '-' + Date.now())
            }
          }),
      }).array('upload', 1);

}