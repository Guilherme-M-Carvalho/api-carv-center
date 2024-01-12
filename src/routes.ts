import { Router, Response, Request } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateServiceController } from "./controllers/service/CreateServiceController";
import { FindServiceController } from "./controllers/service/FindServiceController";
import { FindByPlateCarController } from "./controllers/car/FindByPlateCarController";
import { FindFirstServiceController } from "./controllers/service/FindFirstServiceController";

const router = Router();

router.post("/api/session", new AuthUserController().handle)
router.post("/api/user", new CreateUserController().handle)
router.get("/api/user/:id", isAuthenticated, new DetailUserController().handle)

router.post("/api/service", isAuthenticated, new CreateServiceController().handle)
router.get("/api/service", isAuthenticated, new FindServiceController().handle)
router.get("/api/service/:id", isAuthenticated, new FindFirstServiceController().handle)

router.get("/api/car/:plate", isAuthenticated, new FindByPlateCarController().handle)

export { router }