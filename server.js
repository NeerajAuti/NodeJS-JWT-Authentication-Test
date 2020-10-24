const express = require("express");
const path = require("path");
const exjwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
    next();
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = 3000;
const secretKey = "My Super Key";
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});
let users = [
  {
    id: 1,
    username: "Neeraj",
    password: "123",
  },
  {
    id: 2,
    username: "test",
    password: "456",
  },
];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret reveled after Login",
  });
});

app.get("/api/settings", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Settings is available after login",
  });
});

app.post("/api/post", (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "3m" }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      break;
    } else {
      res.status(401).json({
        success: false,
        err: "Username or Password is incorrect",
        token: null,
      });
    }
  }
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or Password is incorrect 2",
    });
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
