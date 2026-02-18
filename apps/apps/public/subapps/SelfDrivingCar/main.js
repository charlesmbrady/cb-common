const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 600;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)];

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red');
  }
  car.draw(carCtx, 'blue');

  carCtx.restore();
  Visualizer.drawNetwork(networkCtx, car.brain);
  requestAnimationFrame(animate);
}

// const canvas = document.getElementById('myCanvas');
// canvas.height = window.innerHeight;
// canvas.width = 200;

// const ctx = canvas.getContext('2d');
// const road = new Road(canvas.width / 2, canvas.width * 0.9);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'KEYS');

// const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)];

// animate();

// /* -------------------------------------------------------------------------- */
// /*                                  Functions                                 */
// /* -------------------------------------------------------------------------- */
// function animate() {
//   for (let i = 0; i < traffic.length; i++) {
//     traffic[i].update(road.borders, []);
//   }
//   car.update(road.borders, traffic);

//   canvas.height = window.innerHeight;

//   ctx.save();
//   ctx.translate(0, -car.y + canvas.height * 0.7);

//   road.draw(ctx);
//   for (let i = 0; i < traffic.length; i++) {
//     traffic[i].draw(ctx);
//   }
//   car.draw(ctx);

//   ctx.restore();
//   requestAnimationFrame(animate);
// }
