const jwt = require("jsonwebtoken");
const connection = require("../config/db");
const commentMiddleware = {
  createComment: async (req, res, next) => {
    const { content } = req.body;
    const { postId } = req.params;
    const brToken = req.headers.authorization;
    if (!brToken) {
      return res.status(400).json({ error: "Token is not defined" });
    }

    const token = brToken.substring(7);
    let modifiedContent = content?.split(" ")?.join("");

    if (!modifiedContent) {
      return res.status(400).json({ error: "Please fill comment field" });
    }

    const checkingQuery = "SELECT id FROM user_details WHERE id = ?";
    const checkingPost = "SELECT id FROM blog_details WHERE id = ?";

    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Wrong token" });
      }

      const { id } = decoded;
      try {
        const [postResult, userResult] = await Promise.all([
          connection.promise().query(checkingPost, [postId]),
          connection.promise().query(checkingQuery, [id]),
        ]);

        if (postResult[0].length === 0) {
          return res.status(500).json({ message: "Post not found" });
        }

        if (userResult[0].length === 0) {
          return res.status(500).json({ message: "Wrong access token" });
        }

        next();
      } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  },

  updateComment: (req, res, next) => {
    const { content } = req.body;
    const { commentId } = req.params;
    const brToken = req.headers.authorization;
    if (!brToken) {
      return res.status(400).json({ error: "Token is not defined" });
    }

    const token = brToken.substring(7);
    let modifiedContent = content?.split(" ")?.join("");

    if (!modifiedContent) {
      return res.status(400).json({ error: "Please fill comment field" });
    }

    const checkingQuery = "SELECT id FROM user_details WHERE id = ?";
    const checkOwnerId = "SELECT id,ownerId FROM comments WHERE id = ?";

    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Wrong token" });
      }
      const { id } = decoded;

      try {
        const [userResult, ownerResult] = await Promise.all([
          connection.promise().query(checkingQuery, [id]),
          connection.promise().query(checkOwnerId, [commentId]),
        ]);
        if (userResult[0].length === 0) {
          return res.status(500).json({ error: "Wrong access token" });
        }
        if (ownerResult[0].length === 0) {
          res.status(500).json({ error: "There is not comment on this ID" });
        } else if (ownerResult[0][0].ownerId !== id) {
          return res.status(500).json({
            error: "User does not have access to update the comment",
          });
        } else {
          next();
        }
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  },
  deleteComment: (req, res, next) => {
    const { commentId } = req.params;
    const brToken = req.headers.authorization;
    if (!brToken) {
      return res.status(400).json({ error: "Token is not defined" });
    }

    const token = brToken.substring(7);

    const checkingQuery = "SELECT id FROM user_details WHERE id = ?";
    const checkOwnerId = "SELECT id,ownerId FROM comments WHERE id = ?";
    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Wrong token" });
      }
      try {
        const [userResult, ownerResult] = await Promise.all([
          connection.promise().query(checkingQuery, [id]),
          connection.promise().query(checkOwnerId, [commentId]),
        ]);
        if (userResult[0].length === 0) {
          return res.status(500).json({ error: "Wrong access token" });
        }
        if (ownerResult[0].length === 0) {
          res.status(500).json({ error: "There is not comment on this ID" });
        } else if (ownerResult[0][0].ownerId !== id) {
          return res.status(500).json({
            error: "User does not have access to delete the comment",
          });
        }
        next();
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  },
};
module.exports = commentMiddleware;
