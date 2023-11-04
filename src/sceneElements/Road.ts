import { BoxGeometry, Group, Mesh, MeshLambertMaterial } from "three";
import SceneElement from "./SceneElement";
import { ROAD_LINE_SIZE, ROAD_LINE_SPACE } from "../system/constants";
import RoadModel from "../model/RoadModel";
import ModelWithCoordinates from "../model/ModelWithCoordinates";

export default class Road extends SceneElement {
  lines: Group;
  roadLength: number;
  roadWidth: number;
  initialPosition: number;
  smoothing: WeakMap<ModelWithCoordinates, { z: number }>;

  constructor(length: number, width: number) {
    super(new Group());
    this.roadLength = length;
    this.roadWidth = width;
    this.smoothing = new WeakMap();
    const ground = new Mesh(
      new BoxGeometry(width, 1, length),
      new MeshLambertMaterial({
        color: 0x232429,
      })
    );
    ground.receiveShadow = true;
    ground.position.y = -1;
    this.element.add(ground);
    const totalLines = Math.ceil(
      this.roadLength / (ROAD_LINE_SIZE + ROAD_LINE_SPACE)
    );
    this.lines = new Group();
    [...Array(totalLines).keys()].forEach((key) => {
      const line = new Mesh(
        new BoxGeometry(2, 1, ROAD_LINE_SIZE),
        new MeshLambertMaterial({
          color: 0xffffff,
        })
      );
      line.receiveShadow = true;
      line.position.y = -0.9;
      line.position.z =
        (key - totalLines / 2) * Math.round(ROAD_LINE_SIZE + ROAD_LINE_SPACE);
      this.lines.add(line);
    });

    this.initialPosition = this.lines.position.z;
    this.element.add(this.lines);
  }

  smoothPos(obj: ModelWithCoordinates) {
    if (!this.smoothing.has(obj)) {
      this.smoothing.set(obj, { z: obj.z });
    }
    const smoothed = this.smoothing.get(obj) as ModelWithCoordinates;
    const dz = obj.z - smoothed.z;
    if (Math.abs(dz) < ROAD_LINE_SIZE - ROAD_LINE_SPACE) smoothed.z += dz * 0.3;
    else smoothed.z = obj.z;
    return smoothed;
  }

  animate(model: RoadModel) {
    const { z } = this.smoothPos(model);
    this.lines.position.z = z;
  }
}
