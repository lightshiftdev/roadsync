import { BoxGeometry, Group, Mesh, MeshLambertMaterial } from "three";

export default class Road {
  road: Group;
  lines: Group;
  roadLength: number;
  lineSize: number;
  lineSpace = 5;
  roadWidth: number;
  initialPosition: number;

  constructor(length: number, width: number) {
    this.road = new Group();
    this.roadLength = length;
    this.roadWidth = width;
    const ground = new Mesh(
      new BoxGeometry(width, 1, length),
      new MeshLambertMaterial({
        color: 0x232429,
      })
    );
    ground.position.y = -1;
    this.road.add(ground);
    this.lineSize = this.roadLength / 16;
    const totalLines = Math.ceil(this.roadLength / 20);
    this.lines = new Group();
    [...Array(totalLines).keys()].forEach((key) => {
      const line = new Mesh(
        new BoxGeometry(2, 1, this.lineSize),
        new MeshLambertMaterial({
          color: 0xffffff,
        })
      );
      line.position.y = -0.9;
      line.position.z =
        (key - totalLines / 2) * Math.round(this.lineSize + this.lineSpace);
      this.lines.add(line);
    });

    this.initialPosition = this.lines.position.z;
    this.road.add(this.lines);
  }

  getRoad() {
    return this.road;
  }

  animateRoad() {
    const size = Math.round(this.lineSize + this.lineSpace);
    const incrementor =
      this.lines.position.z === this.initialPosition + size ? -size : 1;
    this.lines.position.z += incrementor;
  }
}
