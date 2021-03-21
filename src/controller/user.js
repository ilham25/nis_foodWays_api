const { User, Product } = require("../../models/");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "gender"],
      },
    });
    res.send({
      status: "success",
      message: "Success get all users data",
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
    const checkUser = await User.findOne({
      where: {
        id,
      },
    });

    if (checkUser == null)
      return res.status(400).send({
        status: "failed",
        message: "User doesn't available",
      });

    const removeProduct = await User.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "success",
      message: "Success delete user data",
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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id != id)
      return res.status(401).send({
        status: "failed",
        message: "User doesn't have access",
      });

    const editUser = await User.update(
      { ...req.body, image: req.files.image[0] && req.files.image[0].filename },
      {
        where: {
          id,
        },
      }
    );

    const rawUser = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "gender"],
      },
    });

    if (rawUser == null)
      return res.status(400).send({
        status: "failed",
        message: "User doesn't available",
      });

    const userString = JSON.stringify(rawUser);
    const userObject = JSON.parse(userString);
    const url = process.env.UPLOAD_URL;
    const user = {
      ...userObject,
      image: url + userObject.image,
    };

    res.send({
      status: "success",
      message: "Success edit user data",
      data: {
        user,
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
