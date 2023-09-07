const requestMiddleware = (req, res, next) => {
  const { secretkey } = req.headers;
  if (secretkey !== process.env.SECRETACCESSKEY) {
    return res.json({ message: "Unsecured request, provide secret key" });
  }
  next();
};

module.exports = requestMiddleware;
