import { controllers } from "@/app/controllers";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.get("/", controllers.product.scan);
router.get("/analytics", controllers.product.analytics);
router.post("/sync", controllers.product.sync);

export { router as productRouter };
