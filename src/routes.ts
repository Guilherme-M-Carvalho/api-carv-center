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
import { DeleteServiceController } from "./controllers/service/DeleteServiceController";
import { UpdateServiceController } from "./controllers/service/UpdateServiceController";
import { GenerateOsController } from "./controllers/service/GenerateOsController";

const router = Router();
const upload = multer(uploadConfig.upload("./uploads"))

router.post("/api/session", new AuthUserController().handle)
router.post("/api/user", new CreateUserController().handle)
router.get("/api/user/:id", isAuthenticated, new DetailUserController().handle)

router.post("/api/service", isAuthenticated, upload.fields([{name: "vehicle"}, {name: "service"}]), new CreateServiceController().handle)
router.get("/api/service", isAuthenticated, new FindServiceController().handle)
router.get("/api/service/:id", isAuthenticated, new FindFirstServiceController().handle)
router.delete("/api/service/:id", isAuthenticated, new DeleteServiceController().handle)
router.put("/api/service/:id", isAuthenticated, upload.fields([{name: "vehicle"}, {name: "service"}]), new UpdateServiceController().handle)
router.get("/api/service/os/:id", isAuthenticated, new GenerateOsController().handle)

router.get("/api/car/:plate", isAuthenticated, new FindByPlateCarController().handle)



export { router }