import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors';
import { router } from "./routes";
import cors from "cors"
import path from "path"

const app = express();
// app.use(formidable());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies using query-string library
// or
app.use(express.urlencoded({ extended: true }))
app.use(cors({
     origin: "*"
}));
(<any>BigInt).prototype.toJSON = function () {
     return this.toString()
}

app.use(router)

app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
     if (err instanceof Error) {
          try {
               JSON.parse(err.message)
          } catch (error) {
               return res.status(200).json({
                    error: err.message, failed: true
               });
          }
          return res.status(200).json({ ...JSON.parse(err.message), failed: true });
     }

     return res.status(500).json({
          status: 'error',
          message: "Internal server error"
     });

});

app.listen(3333, () => {
     console.log("deu certo");
})