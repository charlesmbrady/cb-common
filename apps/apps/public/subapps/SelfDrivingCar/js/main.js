import { CAR_CONFIG, SIM_CONFIG } from './config.js';
import { Car } from './core/car/index.js';
import { Road } from './core/road.js';
import { Visualizer } from './ml/visualizer.js';
import { NeuralNetwork } from './ml/network.js';
import {
  clearBestBrain,
  loadBestBrain,
  saveBestBrain,
} from './services/storage.js';
import { STORAGE_KEYS } from './config.js';

const carCanvas = document.getElementById('carCanvas');
const networkCanvas = document.getElementById('networkCanvas');
const CAR_CANVAS_WIDTH = 300;
const NETWORK_CANVAS_WIDTH = 600;
carCanvas.width = CAR_CANVAS_WIDTH;
networkCanvas.width = NETWORK_CANVAS_WIDTH;
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.8);
let traffic = buildTraffic(road);
let cars = generateCars(SIM_CONFIG.carCount, road);

hydrateBrains(cars);
let bestCar = cars[0];
let manualMode = false;
let manualCar = null;
let manualButtonEl = null;
let restartButtonEl = null;

hookUi();
maybeShowInstructions();
resizeCanvases();
animate();

function hookUi() {
  const saveButton = document.getElementById('saveBrain');
  const discardButton = document.getElementById('discardBrain');
  const infoButton = document.getElementById('infoButton');
  manualButtonEl = document.getElementById('manualControl');
  restartButtonEl = document.getElementById('restartButton');
  const closeModal = document.getElementById('closeModal');
  const modal = document.getElementById('instructionModal');

  if (saveButton) {
    saveButton.addEventListener('click', () => saveBestBrain(bestCar.brain));
  }
  if (discardButton) {
    discardButton.addEventListener('click', clearBestBrain);
  }
  if (infoButton && modal) {
    infoButton.addEventListener('click', () => showModal(modal));
  }
  if (manualButtonEl) {
    manualButtonEl.addEventListener('click', () =>
      toggleManual(manualButtonEl)
    );
  }
  if (restartButtonEl) {
    restartButtonEl.addEventListener('click', () => resetSimulation());
  }
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => hideModal(modal));
  }

  window.addEventListener('resize', resizeCanvases);
}

function maybeShowInstructions() {
  const modal = document.getElementById('instructionModal');
  if (!modal) return;
  const seen = localStorage.getItem(STORAGE_KEYS.instructionsSeen);
  if (!seen) {
    showModal(modal);
    localStorage.setItem(STORAGE_KEYS.instructionsSeen, 'true');
  }
}

function showModal(modal) {
  modal.classList.remove('hidden');
}

function hideModal(modal) {
  modal.classList.add('hidden');
}

function resizeCanvases() {
  carCanvas.width = CAR_CANVAS_WIDTH;
  networkCanvas.width = NETWORK_CANVAS_WIDTH;
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
}

function buildTraffic(roadInstance) {
  const blueprint = [
    { lane: 0, y: -100 },
    { lane: 1, y: -110 },
    { lane: 2, y: -232 },
    { lane: 1, y: -300 },
    { lane: 0, y: -400 },
    { lane: 1, y: -500 },
    { lane: 2, y: -600 },
    { lane: 0, y: -700 },
    { lane: 1, y: -800 },
    { lane: 2, y: -900 },
    { lane: 0, y: -1000 },
    { lane: 1, y: -1010 },
    { lane: 2, y: -1320 },
    { lane: 1, y: -1410 },
  ];

  return blueprint.map(
    ({ lane, y }) =>
      new Car(
        roadInstance.getLaneCenter(lane),
        y,
        CAR_CONFIG.width,
        CAR_CONFIG.height,
        'DUMMY',
        2
      )
  );
}

function generateCars(count, roadInstance) {
  const generated = [];
  for (let i = 1; i <= count; i++) {
    generated.push(
      new Car(
        roadInstance.getLaneCenter(1),
        100,
        CAR_CONFIG.width,
        CAR_CONFIG.height,
        'AI'
      )
    );
  }
  return generated;
}

function hydrateBrains(fleet) {
  const savedBrain = loadBestBrain();
  if (!savedBrain) return;

  fleet.forEach((car, index) => {
    car.brain = JSON.parse(JSON.stringify(savedBrain));
    if (index !== 0) {
      NeuralNetwork.mutate(car.brain, 0.1);
    }
  });
}

function animate(time) {
  traffic.forEach((vehicle) => vehicle.update(road.borders, []));
  cars.forEach((car) => car.update(road.borders, traffic));

  bestCar =
    manualMode && manualCar
      ? manualCar
      : cars.reduce((lead, car) => (car.y < lead.y ? car : lead), cars[0]);

  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * SIM_CONFIG.followRatio);
  road.draw(carCtx);
  traffic.forEach((vehicle) => vehicle.draw(carCtx));

  carCtx.globalAlpha = 0.2;
  cars.forEach((car) => car.draw(carCtx));
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}

function toggleManual(buttonEl) {
  setManualMode(!manualMode, buttonEl);
}

function setManualMode(enabled, buttonEl = manualButtonEl) {
  if (enabled) {
    manualMode = true;
    manualCar = bestCar;
    manualCar.setControlMode('KEYS');
    if (buttonEl) buttonEl.textContent = '🤖';
  } else {
    manualMode = false;
    if (manualCar) {
      manualCar.setControlMode('AI');
    }
    manualCar = null;
    if (buttonEl) buttonEl.textContent = '🔑';
  }
}

function resetSimulation() {
  const wasManual = manualMode;

  cars.forEach((car) => car.dispose && car.dispose());

  traffic = buildTraffic(road);
  cars = generateCars(SIM_CONFIG.carCount, road);
  hydrateBrains(cars);
  bestCar = cars[0];
  manualCar = null;
  manualMode = false;

  if (wasManual) {
    setManualMode(true);
  } else {
    setManualMode(false);
  }
}
