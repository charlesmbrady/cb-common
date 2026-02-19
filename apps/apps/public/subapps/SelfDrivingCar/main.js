const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 600;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
const N = 400;

const cars = generateCars(N);
const traffic = [
  // new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(0), -200, 30, 50, 'DUMMY', 2),
  // new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),

  new Car(road.getLaneCenter(0), -100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -110, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -232, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -300, 30, 50, 'DUMMY', 2),

  new Car(road.getLaneCenter(0), -400, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -600, 30, 50, 'DUMMY', 2),

  new Car(road.getLaneCenter(0), -700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -800, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -900, 30, 50, 'DUMMY', 2),

  new Car(road.getLaneCenter(0), -1000, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -1010, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -1320, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -1410, 30, 50, 'DUMMY', 2),
];

let bestCar = cars[0];

// if existing saved brain in local storage, use it
if (localStorage.getItem('bestBrain')) {
  //go through all the cars and give them the saved brain, but mutate it a little bit for all the cars except the first one, which will be the best car that we saved
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}
animate();

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem('bestBrain');
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
  }
  return cars;
}

function animate(t) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((car) => car.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red');
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'blue');
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'blue', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -t / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
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
