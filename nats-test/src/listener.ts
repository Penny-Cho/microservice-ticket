import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  //setManualMode를 true로 할 시, listener가 죽었을 때를 대비하여 제대로 받았는지 테스트한 뒤 30초 경과 뒤에 다른 listener로 emit하고 지속적으로 그 행위를 반복할 수 있음.
  const options = stan.subscriptionOptions().setManualAckMode(true);

  // second argument qGroup (orders-service-queue-group):
  // 위 코드에서 randombyte로 생성한 randomId를 보면, id를 다르게 설정하여 여러 개의 listener를 생성하여 이벤트를 분산시킬 수 있음.
  // 이 때, 아래와 같이 qGroup을 생성하여 특정한 종류의 event를 받았을 때, 그것을 listening하고 있는 listener가 여러 개라면, 그룹으로 묶고
  // 동시에 여러 개의 listener에 보내는 것이 아닌 그 중의 한개에만 보냄으로써 중복을 막을 수 있음.
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});
