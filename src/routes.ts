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
import { FindServiceByDateController } from "./controllers/service/FindServiceByDateController";
import { FindServiceReportController } from "./controllers/service/FindServiceReportController";
import { FindCostController } from "./controllers/cost/FindCostController";
import { FindFirstCostController } from "./controllers/cost/FindFirstCostController";
import { DeleteCostController } from "./controllers/cost/DeleteCostController";
import { UpdateCostController } from "./controllers/cost/UpdateCostController";
import { CreateCostController } from "./controllers/cost/CreateCostController";
import { FindTypeServiceController } from "./controllers/typeService/FindTypeServiceController";
import { CreateResaleController } from "./controllers/resale/CreateResaleController";
import { FindResaleController } from "./controllers/resale/FindResaleController";
import { FindFirstResaleController } from "./controllers/resale/FindFirstResaleController";
import { DeleteResaleController } from "./controllers/resale/DeleteResaleController";
import { UpdateResaleController } from "./controllers/resale/UpdateResaleController";
import { FindCostResaleController } from "./controllers/cost/FindCostResaleController";
import { CreateNewProductController } from "./controllers/cost/CreateNewProductController";
import { ChangePriceResaleProductController } from "./controllers/cost/ChangePriceResaleProductController";
import { DeleteCostProductController } from "./controllers/cost/DeleteCostProductController";

const router = Router();
const upload = multer(uploadConfig.upload("./uploads"))

router.post("/api/session", new AuthUserController().handle)
router.post("/api/user", new CreateUserController().handle)
router.get("/api/user/:id", isAuthenticated, new DetailUserController().handle)

// router.get("/api/service/report", isAuthenticated, new FindServiceReportController().handle)
// router.post("/api/service", isAuthenticated, upload.fields([{name: "vehicle"}, {name: "service"}]), new CreateServiceController().handle)
// router.get("/api/service", isAuthenticated, new FindServiceController().handle)
// router.get("/api/service/:id", isAuthenticated, new FindFirstServiceController().handle)
// router.delete("/api/service/:id", isAuthenticated, new DeleteServiceController().handle)
// router.put("/api/service/:id", isAuthenticated, upload.fields([{name: "vehicle"}, {name: "service"}]), new UpdateServiceController().handle)
// router.get("/api/service/os/:id", isAuthenticated, new GenerateOsController().handle)
// router.get("/api/service/date/:date", isAuthenticated, new FindServiceByDateController().handle)

router.get("/api/car/:plate", isAuthenticated, new FindByPlateCarController().handle)

router.get("/api/cost/resale", isAuthenticated, new FindCostResaleController().handle)
router.get("/api/cost", isAuthenticated, new FindCostController().handle)
router.get("/api/cost/:id", isAuthenticated, new FindFirstCostController().handle)
router.delete("/api/cost/:id", isAuthenticated, new DeleteCostController().handle)
router.put("/api/cost", isAuthenticated, new UpdateCostController().handle)
router.post("/api/cost", isAuthenticated, new CreateCostController().handle)
router.delete("/api/cost/product/:id", isAuthenticated, new DeleteCostProductController().handle)
router.post("/api/cost/product", isAuthenticated, new CreateNewProductController().handle)
router.put("/api/cost/price", isAuthenticated, new ChangePriceResaleProductController().handle)

router.get("/api/typeService", isAuthenticated, new FindTypeServiceController().handle)

router.put("/api/resale", isAuthenticated, new UpdateResaleController().handle)
router.post("/api/resale", isAuthenticated, new CreateResaleController().handle)
router.get("/api/resale", isAuthenticated, new FindResaleController().handle)
router.get("/api/resale/:id", isAuthenticated, new FindFirstResaleController().handle)
router.delete("/api/resale/:id", isAuthenticated, new DeleteResaleController().handle)


export { router }