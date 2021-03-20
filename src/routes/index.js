const express = require("express");

const router = express.Router();

const { getUsers, deleteUser } = require("../controller/user");
const {
  getAllProducts,
  getProductsByPartner,
  getDetailProduct,
  addProduct,
  deleteProduct,
} = require("../controller/product");
const {
  getTransactionsByPartner,
  getDetailTransaction,
  getUserTransaction,
  addTransaction,
} = require("../controller/transaction");

const { register, login } = require("../controller/auth");

const { authenticated } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/upload");
const { checkPartner, checkUser } = require("../middlewares/checkRole");

router.get("/users", getUsers);
router.delete("/user/delete/:id", deleteUser);

router.get("/products", getAllProducts);
router.get("/products/:id", getProductsByPartner);
router.get("/product/:id", getDetailProduct);
router.post(
  "/product/",
  authenticated,
  checkPartner,
  uploadFile("image"),
  addProduct
);
router.delete("/product/:id", authenticated, checkPartner, deleteProduct);

router.get(
  "/transactions/:id",
  authenticated,
  checkPartner,
  getTransactionsByPartner
);
router.get("/transaction/:id", authenticated, getDetailTransaction);
router.get(
  "/my-transactions/:id",
  authenticated,
  checkUser,
  getUserTransaction
);
router.post("/transaction", authenticated, checkUser, addTransaction);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
