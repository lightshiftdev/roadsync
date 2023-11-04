import { Model } from "@croquet/croquet";
import CarModel from "./CarModel";
import TreeModel from "./TreeModel";
import RoadModel from "./RoadModel";
import { Address } from "viem";

export type Message = {
  from: string;
  to: string;
  amount: string;
  nonce: number;
  briber?: string;
  bribed?: string;
  settler?: string;
  settled?: string;
};

export default class SimModel extends Model {
  cars: Map<Address, CarModel> = new Map();
  trees: Map<string, TreeModel> = new Map();
  road: RoadModel = RoadModel.create({});
  messageQueue: Map<number, Message> = new Map();
  nonce: number = 0;

  init(_options: any): void {
    this.cars = new Map<Address, CarModel>();
    this.trees = new Map<string, TreeModel>();
    this.road = RoadModel.create({});
    this.nonce = 0;
    for (let i = 0; i < 17; i++) {
      const tree = TreeModel.create({});
      this.trees.set(tree.id, tree);
    }

    this.subscribe(this.sessionId, "view-exit", this.viewExited);
    this.subscribe(this.id, "custom-view-join", this.customViewJoined);
    this.subscribe(this.id, "add-message-to-queue", this.addMessageToQueue);
    this.subscribe(this.id, "set-bribe", this.setMessageBribe);
    this.subscribe(this.id, "set-settle", this.setMessageSettle);

    this.mainLoop();
  }

  addMessageToQueue(message: Omit<Message, "nonce">) {
    this.nonce = this.nonce + 1;
    this.messageQueue.set(this.nonce, {
      ...message,
      nonce: this.nonce,
    });
  }

  setMessageBribe({
    signature,
    nonce,
    isBriber,
  }: {
    signature: string;
    nonce: number;
    isBriber: boolean;
  }) {
    const message = this.messageQueue.get(nonce) as Message;
    const newMessage = {
      ...message,
      briber: isBriber ? signature : message.briber,
      bribed: !isBriber ? signature : message.bribed,
    };
    this.messageQueue.set(nonce, newMessage);

    if (!!newMessage.bribed && !!newMessage.briber) {
      this.startAction({
        from: message.from as Address,
        to: message.to as Address,
      });
    }
  }

  setMessageSettle({
    signature,
    nonce,
    isBriber,
  }: {
    signature: string;
    nonce: number;
    isBriber: boolean;
  }) {
    const message = this.messageQueue.get(nonce) as Message;
    this.messageQueue.set(nonce, {
      ...message,
      settler: isBriber ? signature : message.settler,
      settled: !isBriber ? signature : message.settled,
    });
  }

  startAction({ from, to }: { from: Address; to: Address }) {
    const fromCar = this.cars.get(from);
    const toCar = this.cars.get(to);
    if (!!fromCar && !!toCar) {
      fromCar.goTo(toCar.z);
      toCar.goTo(fromCar.z);
    }
  }

  customViewJoined(address: Address) {
    const car = CarModel.create({ address });
    car.setPosition(this.cars.size * 50, "right");
    this.cars.set(address, car);
  }

  viewExited(address: Address) {
    const car = this.cars.get(address);
    this.cars.delete(address);
    car?.destroy();
    this.unsubscribe(this.id, "custom-view-join");
  }

  mainLoop() {
    this.future(60).mainLoop();
    for (const car of this.cars.values()) car.move();
    for (const tree of this.trees.values()) tree.move();
    this.road.move();
  }
}

SimModel.register("SimModel");
