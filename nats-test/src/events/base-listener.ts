import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
  //Name of the quque groups this listener will join
  abstract subject: string;
  //Name of the channel this listener is going to listen to
  abstract queueGroupName: string;

  abstract onMessage(data: any, msg: Message): void;

  //pre-initialized NATS client
  private client: Stan;
  //Number of seconds this listner has to ack(acknowledge) a message
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  //default subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  //Code to set up the subscription
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
