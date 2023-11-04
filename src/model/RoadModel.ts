import { ROAD_LINE_SIZE, ROAD_LINE_SPACE } from "../system/constants";
import ModelWithCoordinates from "./ModelWithCoordinates";

export default class RoadModel extends ModelWithCoordinates {
  init(): void {}

  move() {
    const size = Math.round(ROAD_LINE_SIZE + ROAD_LINE_SPACE);
    const incrementor = this.z >= size ? -size : 1;
    this.z = this.z + incrementor;
  }
}

RoadModel.register("RoadModel");
