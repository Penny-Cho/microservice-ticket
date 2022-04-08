import { Schema, model } from "mongoose";
import { Password } from "../services/password";

export interface UserAttrs {
  email: string;
  password: string;
}

// toJSON Method
// In order to match with other database type such as MySQL or POSTGRES and other program languages return JSON structure,
// should modify or remove mongo specific key names such as _id, __v and etc.
// doing below, only "id" and "email" will be sent to front as the response.

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done;
});

const User = model<UserAttrs>("User", userSchema);

export { User };
