const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const commentController = {
  getAllComments: (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM comments WHERE postId = ?";

    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Success", data: result, size: result.length });
    });
  },
  getLengthOfComments: (req, res) => {
    const { id } = req.params;
    const query = "SELECT Count(id) as length FROM comments WHERE postId = ?";
    connection.query(query, [id], (err, result) => {
      if (err) throw err;
      res.json({ size: result[0].length });
    });
  },
  createComment: (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const brToken = req.headers.authorization;
    const token = brToken.substring(7);
    const addQuery =
      "INSERT INTO comments (postId,ownerId,content) VALUES (?,?,?)";
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
      }
      const { id } = decoded;
      connection.query(addQuery, [postId, id, content], (err, result) => {
        if (err) throw err;
        res.json({
          postId,
          content,
        });
      });
    });
  },
  updateComment: (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;
    const query = "UPDATE comments SET content = ? WHERE id = ?";
    connection.query(query, [content, commentId], (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.changedRows === 0)
        return res.json({ message: "Nothing to update" });
      res.json({ message: "Updated successfully" });
    });
  },
  deleteComment: (req, res) => {
    const { commentId } = req.params;
    const query = "DELETE FROM comments WHERE id=?";
    connection.query(query, [commentId], (err, result) => {
      if (err) throw err;
      res.json({ message: "Deleted successfully" });
    });
  },
};
module.exports = commentController;
