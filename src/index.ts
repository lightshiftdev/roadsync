import { World } from "./World";

const world = new World();

world.init();
world.start();

/* function actions() {
  setTimeout(() => {
    secondCar.accelerate();
    setTimeout(() => {
      secondCar.changeLane();
      setTimeout(() => {
        secondCar.changeLane();
      }, 2000);
    }, 1000);
  }, 2000);
}

function render() {
  requestAnimationFrame(render);
  road.animate();
  firstCar.animate();
  secondCar.animate();
  firstCar.animate();
  ground.animate();
  tree.animate();

} */
