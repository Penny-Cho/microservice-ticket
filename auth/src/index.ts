import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://ticket-auth-mongo-srv:27017/auth");
    console.log("connected to mongo auth db");
  } catch (err) {
    console.error("mongodbError", err);
  }

  app.listen(3000, () => {
    console.log("auth on 3000!!!");
  });
};

start();
