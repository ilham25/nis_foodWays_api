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
} = require("../controller/transaction");

router.get("/users", getUsers);
router.delete("/user/delete/:id", deleteUser);

router.get("/products", getAllProducts);
router.get("/products/:id", getProductsByPartner);
router.get("/product/:id", getDetailProduct);

router.get("/transactions/:id", getTransactionsByPartner);
router.get("/transaction/:id", getDetailTransaction);

module.exports = router;
