const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().email().min(10).max(30).required(),
      password: Joi.string().min(5).max(20).required(),
      fullName: Joi.string().max(50).required(),
      gender: Joi.string().max(20).required(),
      phone: Joi.string().min(10).max(13).required(),
      role: Joi.string().max(10).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkEmail)
      return res.status(400).send({
        status: "register failed",
        message: "Email already registered",
      });

    const hashStrength = 10;
    const hashedPassword = await bcrypt.hash(password, hashStrength);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const secretKey = process.env.JWT_SECRET_TOKEN;
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      data: {
        user: {
          fullName: user.fullName,
          token,
          role: user.role,
        },
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(10).max(30).required(),
      password: Joi.string().min(5).max(20).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const validateUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!validateUser)
      return res.status(400).send({
        status: "login failed",
        message: "Invalid credentials",
      });

    const isValidPass = await bcrypt.compare(password, validateUser.password);

    if (!isValidPass) {
      return res.status(400).send({
        status: "login failed",
        message: "Invalid credentials",
      });
    }

    const secretKey = process.env.JWT_SECRET_TOKEN;
    const token = jwt.sign(
      {
        id: validateUser.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      message: "Login Success",
      data: {
        user: {
          fullName: validateUser.fullName,
          email: validateUser.email,
          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};