import { Schema, model } from "mongoose";
import { Password } from "../services/password";

export interface UserAttrs {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done;
});

const User = model<UserAttrs>("User", userSchema);

export { User };

// import { Schema, model, connect } from 'mongoose';

// // 1. Create an interface representing a document in MongoDB.
// interface User {
//   name: string;
//   email: string;
//   avatar?: string;
// }

// // 2. Create a Schema corresponding to the document interface.
// const schema = new Schema<User>({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   avatar: String
// });

// // 3. Create a Model.
// const UserModel = model<User>('User', schema);

// run().catch(err => console.log(err));

// async function run(): Promise<void> {
//   // 4. Connect to MongoDB
//   await connect('mongodb://localhost:27017/test');

// const doc = new UserModel<User>({
//     name: 'Bill',
//     email: 'bill@initech.com',
//     avatar: 'https://i.imgur.com/dM7Thhn.png'
//    });
//   await doc.save();

//   console.log(doc.email); // 'bill@initech.com'
// }
