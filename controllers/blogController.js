const jwt = require("jsonwebtoken");
const connection = require("../config/db");
const blogController = {
  getAll: (req, res) => {
    const { limit, skip } = req.body;
    const blogsLimit = Number(limit) || 30;
    const blogsSkip = Number(skip) || 0;
    const query = "SELECT * FROM blog_details LIMIT ? OFFSET ?";
    connection.query(query, [blogsLimit, blogsSkip], (err, result) => {
      if (err) throw err;
      res.json({
        message: "Success",
        data: result,
        limit: result.length,
        skip: Number(skip),
      });
    });
  },
  searchBlog: (req, res) => {
    const { search, limit, skip } = req.body;
    const blogsLimit = Number(limit) || 30;
    const blogsSkip = Number(skip) || 0;
    const query =
      "SELECT title ,content FROM blog_details WHERE title LIKE ? OR content LIKE ? LIMIT ? OFFSET ?";
    connection.query(
      query,
      [`%${search}%`, `%${search}%`, blogsLimit, blogsSkip],
      (err, result) => {
        if (err) throw err;
        res.json({
          message: "Searched successfully",
          data: result,
          size: result.length,
          skip: Number(blogsSkip),
        });
      }
    );
  },
  getBlogById: (req, res) => {
    const query = "SELECT * FROM blog_details WHERE id = ?";
    const { id } = req.params;
    connection.query(query, [id], (err, result) => {
      if (err) throw err;
      if (result.length === 0)
        return res.status(404).json({ error: "Page Not Founded" });
      res.json({ message: "Success", data: result[0] });
    });
  },
  createNewBlog: (req, res) => {
    const { title, content } = req.body;
    const brToken = req.headers.authorization;
    const token = brToken.substring(7);
    const checkingQuery = "SELECT id FROM user_details WHERE id = ?";
    const addQuery =
      "INSERT INTO blog_details (title,content,ownerId) VALUES (?,?,?)";
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) throw err;
      const { id } = decoded;
      connection.query(checkingQuery, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0)
          return res.status(400).json({ error: "Wrong Access token" });
      });
      connection.query(addQuery, [title, content, id], (err, result) => {
        if (err) throw err;
        res.json({
          message: "Blog Created Successfully",
          data: result,
        });
      });
    });
  },
  updateBlogById: (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;
    const brToken = req.headers.authorization;
    const token = brToken.substring(7);
    const query =
      "UPDATE blog_details SET title=?, content=? WHERE id=? AND ownerId=?";
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) throw err;
      connection.query(
        query,
        [title, content, id, decoded.id],
        (err, result) => {
          if (err) throw err;
          console.log(result);
          if (result.changedRows === 0)
            return res.status(400).json({ message: "Nothing to update" });
          res.json({ message: "Updated successfully" });
        }
      );
    });
  },
  deleteBlogById: (req, res) => {
    const { id } = req.params;
    const brToken = req.headers.authorization;
    const token = brToken.substring(7);
    const query = "DELETE FROM blog_details WHERE id = ? AND ownerId = ?";
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      connection.query(query, [id, decoded.id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0)
          return res.status(400).json({ message: "Nothing to delete" });
        res.json({ message: "Deleted successfully" });
      });
    });
  },
};

module.exports = blogController;
