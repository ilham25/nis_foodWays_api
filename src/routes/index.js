const express = require("express");

const router = express.Router();

const { getUsers, deleteUser } = require("../controller/user");
const {
  getAllProducts,
  getProductsByPartner,
  getDetailProduct,
} = require("../controller/product");

router.get("/users", getUsers);
router.delete("/user/delete/:id", deleteUser);

router.get("/products", getAllProducts);
router.get("/products/:id", getProductsByPartner);
router.get("/product/:id", getDetailProduct);

module.exports = router;
