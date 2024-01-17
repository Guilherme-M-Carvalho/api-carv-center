import { Router, Response, Request } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateServiceController } from "./controllers/service/CreateServiceController";
import { FindServiceController } from "./controllers/service/FindServiceController";
import { FindByPlateCarController } from "./controllers/car/FindByPlateCarController";
import { FindFirstServiceController } from "./controllers/service/FindFirstServiceController";
import uploadConfig from "./config/multer";
import multer from "multer";

const router = Router();
const upload = multer(uploadConfig.upload("./uploads"))

router.post("/api/session", new AuthUserController().handle)
router.post("/api/user", new CreateUserController().handle)
router.get("/api/user/:id", isAuthenticated, new DetailUserController().handle)

router.post("/api/service", isAuthenticated, upload.fields([{name: "vehicle"}, {name: "service"}]), new CreateServiceController().handle)
router.get("/api/service", isAuthenticated, new FindServiceController().handle)
router.get("/api/service/:id", isAuthenticated, new FindFirstServiceController().handle)

router.get("/api/car/:plate", isAuthenticated, new FindByPlateCarController().handle)

router.post("/api/files", isAuthenticated, upload.fields([{name: "car"}, {name: "service"}]), (req, res) => {
    console.log(JSON.parse(req.body.teste), req.files);
    return res.send({
        ok: "teste"
    })
})



export { router }