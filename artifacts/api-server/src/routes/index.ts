import { Router, type IRouter } from "express";
import healthRouter from "./health";
import investingRouter from "./investing";
import projectsRouter from "./projects";
import blogRouter from "./blog";

const router: IRouter = Router();

router.use(healthRouter);
router.use(investingRouter);
router.use(projectsRouter);
router.use(blogRouter);

export default router;
