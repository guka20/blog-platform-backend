const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/users");
const blogsRouter = require("./routes/blogs");
const requestMiddleware = require("./middleware/requestMiddleware");
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(requestMiddleware);
app.use("/api/user", userRouter);
app.use("/api/blog", blogsRouter);

const port = process.env.HOSTPORT || 8000;
app.listen(port, () => {
  console.log("Server is running on: " + port);
});
