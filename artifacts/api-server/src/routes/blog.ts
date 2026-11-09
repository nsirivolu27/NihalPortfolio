import { Router, type IRouter } from "express";
import { fetchBlogPage } from "../lib/blog-feed";

const router: IRouter = Router();
router.get("/blog", async (req, res) => {
  const result = await fetchBlogPage(req.query.start);
  res.setHeader("Cache-Control", result.status === 200
    ? "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
    : "no-store");
  res.status(result.status).json(result.body);
});
export default router;
