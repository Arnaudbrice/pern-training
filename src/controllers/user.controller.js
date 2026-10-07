import { User } from "../models/associations.js";
import bcrypt from "bcrypt";

//********** POST /api/users **********
export const createUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // checks if the user already exists
    const alreadyUser = await User.findOne({
      where: { email: email },
    });
    if (alreadyUser) {
      throw new Error("User already exists", { cause: 409 });
    }

    // hashes the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    //! deletes the password, because defaultScope works only with findAll/findOne/findByPk

    // turn sequelize instance to js object
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    return res.status(201).json(userWithoutPassword);
  } catch (err) {
    return next(err);
  }
};
