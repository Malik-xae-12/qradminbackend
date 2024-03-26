const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Users = require("./Users");
const Orders = require("./Order");
const Products = require("./products");

const app = express();
const port = process.env.PORT || 3002;

// Middlewares
app.use(express.json());
app.use(cors());

//* Connection URL
const connection_url =
  "mongodb+srv://malikxae12:malik@clusteramazon.6fxjy2b.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAmazon";
mongoose.connect(connection_url);

// API

app.get("/", (req, res) => res.status(200).send("Home Page"));

// API for SIGNUP

app.post("/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;
  console.log(req.body)

  const encrypt_password = await bcrypt.hash(password, 10);

  const userDetail = {
    email: email,
    password: encrypt_password,
    fullName: fullName,
  };

  const user_exist = await Users.findOne({ email: email });

  if (user_exist) {
    res.send({ message: "The Email is already in use !" });
  } else {
    Users.create(userDetail)
      .then(() => {
        res.send({ message: "User Created Succesfully" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await Users.findOne({ email: email });

  if (userDetail) {
    if (await bcrypt.compare(password, userDetail.password)) {
      res.send(userDetail);
    } else {
      res.send({ error: "invaild Password" });
    }
  } else {
    res.send({ error: "user is not exist" });
  }
});

app.get("/", (req, res) => res.status(200).send("Home Page"));

// add product

app.post("/products/add", (req, res) => {
  const productDetail = req.body;

  console.log("Product Detail >>>>", productDetail);

  Products.create(productDetail)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});


app.post("/orders/get", async (req, res) => {
  const email = req.body.email;
  Orders.find()
    .then((response) => {
      console.log(response);
      
      res.send(response);
    })
    .catch((err) => console.log("Order Detail>>", err));
});

app.listen(port, () => console.log("listening on the port", port));
