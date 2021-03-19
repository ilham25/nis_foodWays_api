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
    console.log("fT", filteredTransaction);
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
