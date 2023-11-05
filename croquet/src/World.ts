// import Loop from "./system/Loop";
import { createCamera } from "./system/camera";
import { createLight } from "./system/light";
import { createRenderer } from "./system/renderer";
import { createScene } from "./system/scene";
import Road from "./sceneElements/Road";
import Car from "./sceneElements/Car";
import Tree from "./sceneElements/Tree";
import Ground from "./sceneElements/Ground";
import {
  ISOMETRIC_ADJUSTED_PLANE,
  ROAD_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from "./system/constants";
import { View } from "@croquet/croquet";
import SimModel, { Message } from "./model/SimModel";
import { Raycaster, Vector2 } from "three";
import Wallet from "./smartcontract/Wallet";
import { Address, formatEther, parseGwei } from "viem";
import CarModel from "./model/CarModel";
import { waitForTransaction } from "@wagmi/core";
// import { CameraHelper } from "three";

export class World extends View {
  model;
  camera;
  scene;
  light;
  renderer;
  road: Road;
  trees: Map<string, Tree>;
  cars: Map<Address, Car>;
  wallet: Wallet;
  address: Address;
  nonce: number;
  processingMessage: number;
  startAction: number;
  collectPayment?: Message;
  collectButton;
  i: number;

  constructor(model: SimModel) {
    super(model);
    this.model = model;
    this.scene = createScene();
    this.camera = createCamera();
    this.light = createLight();
    this.renderer = createRenderer();
    this.trees = new Map();
    this.cars = new Map();
    this.road = new Road(ISOMETRIC_ADJUSTED_PLANE, ROAD_WIDTH);
    this.wallet = new Wallet();
    this.address = "0x";
    this.nonce = this.model.nonce;
    this.processingMessage = this.model.nonce - 1;
    this.startAction = this.model.nonce - 1;
    this.i = 0;
    this.collectButton = document.querySelector(
      "#collect-payment"
    ) as HTMLButtonElement;
    this.collectButton?.addEventListener(
      "click",
      this.handleCollectPayment.bind(this)
    );
    this.init();
  }

  init() {
    // scene.add(new THREE.AxesHelper(40));
    // this.scene.add(new CameraHelper(this.light.shadow.camera));
    this.scene.add(this.light);
    this.camera.lookAt(this.scene.position);

    const ground = new Ground(
      ISOMETRIC_ADJUSTED_PLANE,
      ISOMETRIC_ADJUSTED_PLANE,
      30,
      30
    );

    this.scene.add(this.road.get(), ground.get());
    this.render();

    void this.updateBalance();

    document.querySelector("#control-up")?.addEventListener("click", () => {
      this.publish(this.address, "accelerate");
    });
    document.querySelector("#control-down")?.addEventListener("click", () => {
      this.publish(this.address, "decelerate");
    });
    document.querySelector("#control-left")?.addEventListener("click", () => {
      this.publish(this.address, "change-left");
    });
    document.querySelector("#control-right")?.addEventListener("click", () => {
      this.publish(this.address, "change-right");
    });

    document.onkeydown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
          this.publish(this.address, "accelerate");
          break;
        case "s":
        case "S":
        case "ArrowDown":
          this.publish(this.address, "decelerate");
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          this.publish(this.address, "change-left");
          break;
        case "d":
        case "D":
        case "ArrowRight":
          this.publish(this.address, "change-right");
          break;
      }
    };

    this.renderer.domElement.addEventListener("pointerdown", (event) => {
      const mouse = new Vector2();
      mouse.x = (event.clientX / WINDOW_WIDTH) * 2 - 1;
      mouse.y = -(event.clientY / WINDOW_HEIGHT) * 2 + 1;

      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects(this.scene.children);
      const toAddress = intersects[0].object.name;
      const fromAddress = this.address;
      console.log(intersects[0].object.name);
      if (
        this.processingMessage < this.nonce &&
        toAddress &&
        toAddress !== fromAddress
      ) {
        this.processingMessage = this.nonce;
        this.publish(this.model.id, "add-message-to-queue", {
          from: fromAddress,
          to: toAddress,
          amount: "0.00000000001",
        });
      }
    });
  }

  getWalletAddress() {
    const address = this.wallet.getAddress();
    if (this.address !== address) {
      if (this.address !== "0x") {
        this.publish(this.model.id, "custom-view-left", this.address);
      }
      this.address = address;
      if (!!this.address && this.address !== "0x") {
        this.publish(this.model.id, "custom-view-join", address);
      }
    }
  }

  async updateBalance() {
    const balanceElement = document.querySelector("#user-balance");
    if (balanceElement && this.address && this.address !== "0x") {
      const balance = await this.wallet.readContract();
      balanceElement.innerHTML = `${formatEther(balance)}`;
    }
  }

  update(_: number): void {
    this.road.animate(this.model.road);
    this.getWalletAddress();
    this.updateCars();
    this.updateTrees();
    this.updateMessageQueue();
    this.updateActionsCompleted();
    this.renderer.render(this.scene, this.camera);
    if (this.i === 60 * 3) {
      this.i = 0;
      this.updateBalance();
    }
    this.i += 1;
  }

  updateTrees() {
    for (const [treeId, treeM] of this.model.trees) {
      let tree = this.trees.get(treeId);
      if (!tree) {
        tree = new Tree({
          multiplier: 7,
          x: treeM.x,
          z: treeM.z,
          id: treeM.id,
        });
        this.trees.set(treeId, tree);
        this.scene.add(tree.get());
      }
      tree.animate(treeM);
    }
  }

  updateCars() {
    for (const [address, car] of this.cars) {
      if (!this.model.cars.has(address)) {
        this.scene.remove(car.get());
        this.cars.delete(address);
      }
    }

    for (const [address, carM] of this.model.cars) {
      let car = this.cars.get(address);
      if (!car) {
        car = new Car({
          speed: carM.speed,
          lane: carM.lane,
          colors: {
            body: carM.color,
            cabin: carM.color,
          },
          address,
        });
        this.cars.set(address, car);
        this.scene.add(car.get());
      }
      car.speed = carM.speed;
      car.changeLane(carM.lane);
      car.animate(carM);
    }
  }

  updateMessageQueue() {
    for (const [nonce, message] of this.model.messageQueue) {
      if (nonce > this.nonce) {
        if (
          (this.processingMessage === this.nonce &&
            message.from === this.address) ||
          message.to === this.address
        ) {
          this.nonce = nonce;
          this.processingMessage = this.nonce - 1;
          this.wallet.signMessage(message, true).then((signature) => {
            this.publish(this.model.id, "set-bribe", {
              signature,
              nonce,
              isBriber: message.from === this.address,
            });
            this.startAction = this.nonce;
          });
        }
      }
    }
  }

  updateActionsCompleted() {
    if (this.startAction === this.nonce) {
      const message = this.model.messageQueue.get(this.nonce);
      const fromCar = this.model.cars.get(message?.from as Address) as CarModel;
      const toCar = this.model.cars.get(message?.to as Address) as CarModel;
      if (!!message && fromCar.z < toCar.z && fromCar.lane === toCar.lane) {
        if (message.from === this.address || message.to === this.address) {
          this.startAction = this.nonce - 1;
          this.wallet.signMessage(message, false).then((signature) => {
            this.publish(this.model.id, "set-settle", {
              signature,
              nonce: message.nonce,
              isBriber: message.from === this.address,
            });
            if (message.to === this.address) {
              this.collectPayment = message;
              if (this.collectButton) {
                this.collectButton.classList.add("show");
                this.collectButton.innerHTML = `Collect ${parseGwei(
                  message.amount
                )}ETH`;
              }
            }
          });
        }
      }
    }
  }

  async handleCollectPayment() {
    if (!this.collectPayment) {
      this.collectPayment = undefined;
      this.collectButton?.classList.remove("show");
      return;
    }
    try {
      this.collectButton.disabled = true;
      const message = this.model.messageQueue.get(this.nonce) as Message;
      const tx = await this.wallet.sendMessage(message);
      await waitForTransaction({
        hash: tx.hash,
      });
      this.collectButton.disabled = false;
      this.collectPayment = undefined;
      this.collectButton?.classList.remove("show");
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
