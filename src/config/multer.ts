import crypto from "crypto"
import multer, { Options } from "multer"

import { extname, resolve } from "path"

export default {
    upload(folder: string) {
        const config: Options = {
            storage: multer.diskStorage({

                destination: resolve(__dirname, "..", "..", folder),
                filename: (req, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString("hex");
                    const fileName = `${fileHash}-${file.originalname}.jpeg`
                    if (Array.isArray(req.body[file.fieldname])) {
                        req.body[file.fieldname].push({filename: fileName})
                    } else {
                        req.body[file.fieldname] = [{filename: fileName}]
                    }
                    return callback(null, fileName)
                },
            }),

        }

        return config
    }
}