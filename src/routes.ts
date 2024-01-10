import { Router, Response, Request } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";

const router = Router();

router.post("/api/session", new AuthUserController().handle)
router.post("/api/user", new CreateUserController().handle)
router.get("/api/user/:id", isAuthenticated, new DetailUserController().handle)

export { router }