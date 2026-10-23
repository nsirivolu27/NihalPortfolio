import { Router, type IRouter } from "express";
import healthRouter from "./health";
import investingRouter from "./investing";
import projectsRouter from "./projects";

const router: IRouter = Router();

router.use(healthRouter);
router.use(investingRouter);
router.use(projectsRouter);

export default router;
