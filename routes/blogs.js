const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const blogMiddleware = require("../middleware/blogMiddleware");

router.get("/all", blogController.getAll);
router.get("/search", blogController.searchBlog);
router.get("/:id", blogController.getBlogById);
router.post("/new", blogMiddleware.createBlog, blogController.createNewBlog);
router.patch("/:id", blogMiddleware.createBlog, blogController.updateBlogById);
router.delete(
  "/:id",
  blogMiddleware.deleteBlogById,
  blogController.deleteBlogById
);

module.exports = router;
