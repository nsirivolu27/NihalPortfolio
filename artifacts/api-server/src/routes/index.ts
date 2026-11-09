import { Router, type IRouter } from "express";
import healthRouter from "./health";
import investingRouter from "./investing";

const router: IRouter = Router();

router.use(healthRouter);
router.use(investingRouter);

export default router;
