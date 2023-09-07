const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userController = {
  getData: (req, res) => {
    const brToken = req.headers.authorization;
    const token = brToken.substring(7);

    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Wrong token" });
      const query = "SELECT username,email,id FROM user_details WHERE id = ?";
      connection.query(query, [decoded.id], (err, result) => {
        if (err) throw err;
        if (result.length === 0)
          return res.status(401).json({ error: "Wrong Access Token" });
        res.json({ message: "Login successfully", data: result[0] });
      });
    });
  },
  getUsernameById: (req, res) => {
    const query = "SELECT username FROM user_details WHERE id = ?";
    const { id } = req.params;

    connection.query(query, [id], (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.length === 0)
        return res.status(400).json({ error: "Something went wrong" });
      res.json({ data: result[0] });
    });
  },
  getToken: (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM user_details WHERE email = ?";
    connection.query(query, [email], (err, result) => {
      if (err) throw err;
      if (result.length === 0)
        return res.status(401).json({ error: "Email Does not exist" });
      bcrypt.compare(password, result[0].password, (err, compared) => {
        if (err) {
          throw err;
        }
        if (!compared) return res.status(401).json({ error: "Wrong password" });
        else {
          const payload = {
            id: result[0].id,
            email: result[0].email,
          };
          const token = jwt.sign(payload, process.env.SECRETKEY);
          res.json({ token });
        }
      });
    });
  },
  createUser: (req, res) => {
    const saltRounds = 10;
    const { username, password, email } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) throw err;
      const query =
        "INSERT INTO user_details (username,password,email) VALUES (?,?,?)";
      connection.query(query, [username, hash, email], (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(401).json({ error: "Email already exist" });
          throw err;
        }
        res.json({
          message: "User signed up successfully",
          data: { username, email },
        });
      });
    });
  },
};

module.exports = userController;
