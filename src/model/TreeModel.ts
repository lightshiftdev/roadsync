import { ISOMETRIC_ADJUSTED_PLANE, ROAD_WIDTH } from "../system/constants";
import ModelWithCoordinates from "./ModelWithCoordinates";

export default class TreeModel extends ModelWithCoordinates {
  init(): void {
    this.setRandomPosition(true);
  }

  setRandomPosition(firstTime: boolean = false) {
    const max = ISOMETRIC_ADJUSTED_PLANE / 2;
    const min = ROAD_WIDTH / 2 + 3;
    const side = Math.round(Math.random()) === 0 ? -1 : 1;
    const random = Math.random() * (max - min) + min;
    this.x = side * random;
    this.z = firstTime
      ? -Math.random() * ISOMETRIC_ADJUSTED_PLANE + ISOMETRIC_ADJUSTED_PLANE / 2
      : -Math.random() * ISOMETRIC_ADJUSTED_PLANE -
        ISOMETRIC_ADJUSTED_PLANE / 2;
  }

  move() {
    if (this.z >= ISOMETRIC_ADJUSTED_PLANE / 2) {
      this.setRandomPosition(false);
    } else {
      this.z = this.z + 1;
    }
  }
}

TreeModel.register("TreeModel");
