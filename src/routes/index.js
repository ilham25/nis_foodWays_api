const express = require("express");

const router = express.Router();

const { getUsers, deleteUser } = require("../controller/user");
const {
  getAllProducts,
  getProductsByPartner,
  getDetailProduct,
} = require("../controller/product");
const {
  getTransactionsByPartner,
  getDetailTransaction,
  getUserTransaction,
} = require("../controller/transaction");

const { register, login } = require("../controller/auth");

router.get("/users", getUsers);
router.delete("/user/delete/:id", deleteUser);

router.get("/products", getAllProducts);
router.get("/products/:id", getProductsByPartner);
router.get("/product/:id", getDetailProduct);

router.get("/transactions/:id", getTransactionsByPartner);
router.get("/transaction/:id", getDetailTransaction);
router.get("/my-transactions/:id", getUserTransaction);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
