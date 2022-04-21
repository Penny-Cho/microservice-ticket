import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User, UserAttrs } from "../models/user";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@pentickets/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be vaild"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use!");
    }

    const user = new User<UserAttrs>({
      email,
      password,
    });
    await user.save();

    //generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // !표시: tell typescript that the thing has been actually defined
      process.env.JWT_KEY!
    );

    //Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
