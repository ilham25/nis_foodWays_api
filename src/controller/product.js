const { User, Product } = require("../../models");

exports.getAllProducts = async (req, res) => {
  try {
    const rawProducts = await Product.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "image",
              "role",
              "gender",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
    });
    const productsString = JSON.stringify(rawProducts);
    const productsObject = JSON.parse(productsString);

    const products = productsObject.map((product) => {
      const url = process.env.UPLOAD_URL;
      return {
        ...product,
        image: url + product.image,
      };
    });
    res.send({
      status: "success",
      message: "Success get all product data",
      data: { products },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getProductsByPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const rawProducts = await Product.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [],
          where: {
            id,
            role: "partner",
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
    });
    const productsString = JSON.stringify(rawProducts);
    const productsObject = JSON.parse(productsString);

    const products = productsObject.map((product) => {
      const url = process.env.UPLOAD_URL;
      return {
        ...product,
        image: url + product.image,
      };
    });
    res.send({
      status: "success",
      message: "Success get product data",
      data: { products },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const rawProduct = await Product.findOne({
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "image",
              "role",
              "gender",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
      where: {
        id,
      },
    });

    if (rawProduct == null)
      return res.status(400).send({
        status: "failed",
        message: "Product doesn't available",
      });

    const productString = JSON.stringify(rawProduct);
    const productObject = JSON.parse(productString);
    const url = process.env.UPLOAD_URL;
    const product = {
      ...productObject,
      image: url + productObject.image,
    };

    res.send({
      status: "success",
      message: "Success get product detail",
      data: { product },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const createProduct = await Product.create({
      ...req.body,
      image: req.files.image[0].filename,
      userId: req.user.id,
    });
    const product = await Product.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "image",
              "role",
              "gender",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
      where: {
        id: createProduct.id,
      },
    });
    res.send({
      status: "success",
      message: "Success add new product",
      data: { product },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const checkProduct = await Product.findOne({
      where: {
        id,
      },
    });
    if (checkProduct == null)
      return res.status(400).send({
        status: "failed",
        message: "Product doesn't available",
      });

    if (checkProduct.userId !== req.user.id)
      return res.status(401).send({
        status: "failed",
        message: "You dont have access to this product",
      });

    const removeProduct = await Product.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "success",
      data: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const editProduct = await Product.update(
      { ...req.body },
      {
        where: {
          id,
        },
      }
    );

    const rawProduct = await Product.findOne({
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "image",
              "role",
              "gender",
            ],
          },
          where: {
            id: req.user.id,
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
      where: {
        id,
      },
    });

    if (rawProduct == null)
      return res.status(400).send({
        status: "failed",
        message: "Product not available or user doesn't access",
      });

    const productString = JSON.stringify(rawProduct);
    const productObject = JSON.parse(productString);
    const url = process.env.UPLOAD_URL;
    const product = {
      ...productObject,
      image: url + productObject.image,
    };

    res.send({
      status: "success",
      message: "Success get product detail",
      data: { product },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
