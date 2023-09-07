const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const blogMiddleware = require("../middleware/blogMiddleware");
const commentController = require("../controllers/commentController");
const commentMiddleware = require("../middleware/commentMiddleware");

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
router.get("/:id/comments", commentController.getAllComments);

router.get("/:id/comments/length", commentController.getLengthOfComments);

router.post(
  "/:postId/comments/new",
  commentMiddleware.createComment,
  commentController.createComment
);

router.patch(
  "/comments/:commentId",
  commentMiddleware.updateComment,
  commentController.updateComment
);
router.delete(
  "/comments/:commentId",
  commentMiddleware.deleteComment,
  commentController.deleteComment
);
module.exports = router;
