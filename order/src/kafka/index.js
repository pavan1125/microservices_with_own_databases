import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-app-1",
  brokers: ["localhost:9092","localhost:9093","localhost:9094"],
});
