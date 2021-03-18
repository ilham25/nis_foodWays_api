const { User, Product } = require("../../models/");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.send({
      status: "success",
      data: {
        users,
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

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// [
//   {
//     id: 1,
//     fullName: "spiderman",
//     email: "spiderman@gmail.com",
//     phone: "08123819391",
//     location: "082138193913,0292912193201",
//     image: "spiderman.png",
//     role: "user",
//   },
//   {
//     id: 2,
//     fullName: "KFC",
//     email: "KFC@kfcsupport.com",
//     phone: "07298192",
//     location: "081283193131,0092912193201",
//     image: "kfc-oke.png",
//     role: "partner",
//   },
//   {
//     id: 3,
//     fullName: "surti",
//     email: "surti@gmail.com",
//     phone: "08218931312221",
//     location: "0092913919312,0091293913122",
//     image: "surti-foto.png",
//     role: "user",
//   },
// ];
