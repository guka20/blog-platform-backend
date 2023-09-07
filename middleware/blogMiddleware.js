const jwt = require("jsonwebtoken");
const blogMiddleware = {
  createBlog: (req, res, next) => {
    const { content, title } = req.body;
    const brToken = req.headers.authorization;
    if (!brToken)
      return res.status(400).json({ error: "Token is not defined" });

    const token = brToken.substring(7);
    let modifiedContent = content?.split(" ")?.join("");
    let modifiedTitle = title?.split(" ")?.join("");

    if (!modifiedContent || !modifiedTitle) {
      return res
        .status(400)
        .json({ error: "Please fill title and content fields" });
    }
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Wrong token" });
    });
    next();
  },
  deleteBlogById: (req, res, next) => {
    const brToken = req.headers.authorization;
    if (!brToken)
      return res.status(400).json({ error: "Token is not defined" });
    const token = brToken.substring(7);
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Wrong token" });
    });
    next();
  },
};

module.exports = blogMiddleware;
