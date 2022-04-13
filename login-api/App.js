var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 15;
var jwt = require("jsonwebtoken");
const secret = "iig-quiz";

app.use(cors());

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "iig_quiz",
});

app.post("/register", jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    connection.execute(
      "INSERT INTO users (Username, password, Firstname, Lastname) VALUES (?, ?, ?, ?)",
      [
        req.body.Username,
        hash,
        req.body.Firstname,
        req.body.Lastname,
      ],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  });
});

app.post("/login", jsonParser, function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE Username=?",
    [req.body.Username],
    function (err, users, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: "error", message: "No user found" });
        return;
      }
      bcrypt.compare(
        req.body.password,
        users[0].password,
        function (err, isLogin) {
          if (isLogin) {
            var token = jwt.sign({ Username: users[0].Username }, secret);
            res.json({ status: "ok", message: "login success", token });
          } else {
            res.json({ status: "error", message: "login failed" });
          }
        }
      );
    }
  );
});

app.post("/authen", jsonParser, function (req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		var decoded = jwt.verify(token, secret);
		res.json({ status: "ok", message: decoded});
		res.json({decoded})
	} catch (err) {
		res.json({ status: "error", message: err.message });
	}
	con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM customers WHERE Username=?", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
    return result;
  });
});

app.listen(5500, function () {
  console.log("CORS-enabled web server listening on port 5500");
});
