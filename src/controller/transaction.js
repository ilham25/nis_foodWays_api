const { User, Product, Transaction, Order } = require("../../models");

exports.getTransactionsByPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const rawTransactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "phone",
              "image",
              "role",
              "gender",
            ],
          },
        },
        {
          model: Order,
          as: "order",
          include: [
            {
              model: Product,
              as: "product",
              attributes: {
                // insert exclude id if want to use order id
                exclude: ["createdAt", "updatedAt", "userId"],
              },
              where: {
                userId: id,
              },
            },
          ],

          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "transactionId",
              "productId",
              "ProductId",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    const transactionsString = JSON.stringify(rawTransactions);
    const transactionsObject = JSON.parse(transactionsString);
    const filteredTransaction = transactionsObject.filter(
      (item) => item.order.length
    );
    const transactions = filteredTransaction.map((trans) => {
      return {
        ...trans,
        order: [
          ...trans.order.map((order) => ({
            // id: order.id, // uncomment to use order id
            qty: order.qty,
            ...order.product,
          })),
        ],
      };
    });

    res.send({
      status: "success",
      message: "Success get product by partner id",
      data: {
        transactions,
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
exports.getDetailTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const rawTransactions = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "phone",
              "image",
              "role",
              "gender",
            ],
          },
        },
        {
          model: Order,
          as: "order",
          include: [
            {
              model: Product,
              as: "product",
              attributes: {
                // insert exclude id if want to use order id
                exclude: ["createdAt", "updatedAt", "userId"],
              },
            },
          ],

          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "transactionId",
              "productId",
              "ProductId",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      where: {
        id,
      },
    });

    if (rawTransactions == null)
      return res.status(400).send({
        status: "failed",
        message: "Transaction doesn't available",
      });

    const transactionsString = JSON.stringify(rawTransactions);
    const transactionsObject = JSON.parse(transactionsString);

    const transactions = transactionsObject.order
      ? {
          ...transactionsObject,
          order: [
            ...transactionsObject.order.map((order) => ({
              // id: order.id, // uncomment to use order id
              qty: order.qty,
              ...order.product,
            })),
          ],
        }
      : {
          ...transactionsObject,
          order: [],
        };

    res.send({
      status: "success",
      message: "Success get product detail",
      data: {
        transactions,
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

exports.getUserTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const rawTransactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: [],
          where: {
            id,
          },
        },
        {
          model: Order,
          as: "order",
          include: [
            {
              model: Product,
              as: "product",
              attributes: {
                // insert exclude id if want to use order id
                exclude: ["createdAt", "updatedAt", "userId"],
              },
            },
          ],

          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "transactionId",
              "productId",
              "ProductId",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    const transactionsString = JSON.stringify(rawTransactions);
    const transactionsObject = JSON.parse(transactionsString);
    const filteredTransaction = transactionsObject.filter(
      (item) => item.order.length
    );
    const transactions = filteredTransaction.map((trans) => {
      return {
        ...trans,
        order: [
          ...trans.order.map((order) => ({
            // id: order.id, // uncomment to use order id
            qty: order.qty,
            ...order.product,
          })),
        ],
      };
    });

    res.send({
      status: "success",
      message: "Success get product by user id",
      data: {
        transactions,
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

exports.addTransaction = async (req, res) => {
  try {
    const { products } = req.body;
    const { id } = req.user;

    const createTransaction = await Transaction.create({
      userId: id,
      status: "Success",
    });

    const addProducts = await Order.bulkCreate(
      products.map((product) => ({
        productId: product.id,
        transactionId: createTransaction.id,
        qty: product.qty,
      }))
    );

    const rawTransactions = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "phone",
              "image",
              "role",
              "gender",
            ],
          },
        },
        {
          model: Order,
          as: "order",
          include: [
            {
              model: Product,
              as: "product",
              attributes: {
                // insert exclude id if want to use order id
                exclude: ["createdAt", "updatedAt", "userId"],
              },
            },
          ],
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "transactionId",
              "productId",
              "ProductId",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      where: {
        id: createTransaction.id,
      },
    });

    const transactionsString = JSON.stringify(rawTransactions);
    const transactionsObject = JSON.parse(transactionsString);

    const transactions = {
      ...transactionsObject,
      order: [
        ...transactionsObject.order.map((order) => ({
          // id: order.id, // uncomment to use order id
          qty: order.qty,
          ...order.product,
        })),
      ],
    };

    res.send({
      status: "on the way",
      message: "Success add transaction",
      data: {
        transactions,
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

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const rawTransactions = await Transaction.findOne({
      where: {
        id,
      },
    });

    if (rawTransactions == null)
      return res.status(400).send({
        status: "failed",
        message: "Transaction doesn't available",
      });

    const removeTransactions = await Transaction.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "Success remove transaction",
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

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const editTransaction = await Transaction.update(
      { ...req.body },
      {
        where: {
          id,
        },
      }
    );

    const rawTransactions = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "phone",
              "image",
              "role",
              "gender",
            ],
          },
        },
        {
          model: Order,
          as: "order",
          include: [
            {
              model: Product,
              as: "product",
              attributes: {
                // insert exclude id if want to use order id
                exclude: ["createdAt", "updatedAt", "userId"],
              },
            },
          ],

          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "transactionId",
              "productId",
              "ProductId",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      where: {
        id,
      },
    });

    if (rawTransactions == null)
      return res.status(400).send({
        status: "failed",
        message: "Transaction doesn't available",
      });

    const transactionsString = JSON.stringify(rawTransactions);
    const transactionsObject = JSON.parse(transactionsString);

    const transactions = transactionsObject.order
      ? {
          ...transactionsObject,
          order: [
            ...transactionsObject.order.map((order) => ({
              // id: order.id, // uncomment to use order id
              qty: order.qty,
              ...order.product,
            })),
          ],
        }
      : {
          ...transactionsObject,
          order: [],
        };

    res.send({
      status: "success",
      message: "Success edit product detail",
      data: {
        transactions,
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
