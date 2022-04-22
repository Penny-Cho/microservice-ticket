import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var getCookieFromSignin: () => string[];
}

let mongo: any;

beforeAll(async () => {
  // for test purpose, made a random string to replace the original one
  process.env.JWT_KEY = "wfefew";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getCookieFromSignin = () => {
  //Build a JWT payload { id, email };
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build on session object
  const session = { jwt: token };

  //Turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSOn and encdoe it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
