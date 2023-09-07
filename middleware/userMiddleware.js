const jwt = require("jsonwebtoken");
const userMiddleware = {
  checkGetData: (req, res, next) => {
    const brToken = req.headers.authorization;
    const token = brToken.substring(7);

    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Wrong token" });
    });
    next();
  },
  checkGetToken: (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Please provide all data" });

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email) || !passwordRegex.test(password))
      return res.status(401).json({ message: "Wrong email or password" });
    next();
  },
  checkSignUpData: (req, res, next) => {
    const { username, password, email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const usernameRegex = /^[A-Za-z0-9_.]{3,20}$/;
    if (!username || !password || !email)
      return res.status(400).json({ error: "Please provide all data" });

    if (!emailRegex.test(email))
      return res.status(401).json({ error: "Please provide valid email" });

    if (!passwordRegex.test(password))
      return res.status(401).json({
        error:
          "The password must have: </br> at least one letter (uppercase or lowercase) </br> At least one digit </br> The password must be at least 8 characters long",
      });
    if (!usernameRegex.test(username))
      return res.status(401).json({
        error: "Username must contain minimum 3 and maximum 20 characters",
      });
    next();
  },
};

module.exports = userMiddleware;
