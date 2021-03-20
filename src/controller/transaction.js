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
        status: "error",
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
    const { tempUserId, products } = req.body;

    const createTransaction = await Transaction.create({
      userId: tempUserId,
      status: "Success",
    });

    products.map(async (product) => {
      await Order.create({
        productId: product.id,
        transactionId: createTransaction.id,
        qty: product.qty,
      });
    });

    // const createOrder = await Order.create({
    //   productId,
    //   transactionId : createTransaction.id,

    // })

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
