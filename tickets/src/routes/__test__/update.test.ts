import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("😡 returns a 404 if the proviced id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", getCookieFromSignin())
    .send({
      title: "sdfsd",
      price: 20,
    })
    .expect(404);
});

it("😡 returns a 401(forbidden) if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "sdfsd",
      price: 20,
    })
    .expect(401);
});

it("😡 returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookieFromSignin())
    .send({
      title: "adsfse",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", getCookieFromSignin())
    .send({
      title: "fwefesfd",
      price: 1000,
    })
    .expect(401);
});

it("😡 returns a 400 if the user provices an invalid title or price", async () => {
  const cookie = getCookieFromSignin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "adsfse",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "dsfdf",
      price: -2,
    })
    .expect(400);
});

it("🥰 updates the ticket provided valid tickets", async () => {
  const cookie = getCookieFromSignin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "adsfse",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});
