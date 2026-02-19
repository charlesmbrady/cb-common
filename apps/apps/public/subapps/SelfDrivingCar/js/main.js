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
const defaultSettings = {
  carCount: SIM_CONFIG.carCount,
  followRatio: SIM_CONFIG.followRatio,
  showNetwork: true,
  mutationRate: 0.1,
  trainingIterations: 5,
  trainingDurationSeconds: 10,
};

let userSettings = loadSettings();
const activeSettings = { ...defaultSettings, ...userSettings };

function applyNetworkVisibility() {
  networkCanvas.style.display = activeSettings.showNetwork ? 'block' : 'none';
}

let trainingActive = false;
let trainingIterationsLeft = 0;
let trainingTimerId = null;
let trainingBrain = null;

let traffic = buildTraffic(road);
let cars = generateCars(activeSettings.carCount, road);

hydrateBrains(cars);
let bestCar = cars[0];
let manualMode = false;
let manualCar = null;
let manualButtonEl = null;
let restartButtonEl = null;
let pauseButtonEl = null;
let settingsButtonEl = null;
let trainButtonEl = null;
let settingsModalEl = null;
let settingsFormEl = null;
let pause = false;

applyNetworkVisibility();
hookUi();
updateTrainButton();
maybeShowInstructions();
resizeCanvases();
animate();

function hookUi() {
  const saveButton = document.getElementById('saveBrain');
  const discardButton = document.getElementById('discardBrain');
  const infoButton = document.getElementById('infoButton');
  settingsButtonEl = document.getElementById('settingsButton');
  pauseButtonEl = document.getElementById('pauseButton');
  manualButtonEl = document.getElementById('manualControl');
  trainButtonEl = document.getElementById('trainButton');
  restartButtonEl = document.getElementById('restartButton');
  const closeModal = document.getElementById('closeModal');
  const modal = document.getElementById('instructionModal');
  settingsModalEl = document.getElementById('settingsModal');
  settingsFormEl = document.getElementById('settingsForm');
  const cancelSettingsEl = document.getElementById('cancelSettings');

  if (saveButton) {
    saveButton.addEventListener('click', () => saveBestBrain(bestCar.brain));
  }
  if (discardButton) {
    discardButton.addEventListener('click', () => {
      trainingBrain = null;
      clearBestBrain();
    });
  }
  if (infoButton && modal) {
    infoButton.addEventListener('click', () => showModal(modal));
  }
  if (settingsButtonEl && settingsModalEl) {
    settingsButtonEl.addEventListener('click', () => openSettingsModal());
  }
  if (pauseButtonEl) {
    pauseButtonEl.addEventListener('click', () => togglePause());
  }
  if (manualButtonEl) {
    manualButtonEl.addEventListener('click', () =>
      toggleManual(manualButtonEl)
    );
  }
  if (trainButtonEl) {
    trainButtonEl.addEventListener('click', () => toggleTraining());
  }
  if (restartButtonEl) {
    restartButtonEl.addEventListener('click', () => resetSimulation());
  }
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => hideModal(modal));
  }
  if (settingsFormEl) {
    settingsFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSettingsFromForm();
    });
  }
  if (cancelSettingsEl && settingsModalEl) {
    cancelSettingsEl.addEventListener('click', () =>
      hideModal(settingsModalEl)
    );
  }

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      const tag = event.target && event.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault();
        toggleManual(manualButtonEl);
      }
    }
  });

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
  const baseBrain = trainingBrain || loadBestBrain();
  if (!baseBrain) return;

  fleet.forEach((car, index) => {
    car.brain = JSON.parse(JSON.stringify(baseBrain));
    if (index !== 0) {
      NeuralNetwork.mutate(car.brain, activeSettings.mutationRate);
    }
  });
}

function animate(time) {
  if (!pause) {
    traffic.forEach((vehicle) => vehicle.update(road.borders, []));
    cars.forEach((car) => car.update(road.borders, traffic));

    updatePassingStats(cars, traffic);

    bestCar = manualMode && manualCar ? manualCar : getLeadCar(cars);
  }

  carCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(
    0,
    -bestCar.y + carCanvas.height * activeSettings.followRatio
  );
  road.draw(carCtx);
  traffic.forEach((vehicle) => vehicle.draw(carCtx));

  carCtx.globalAlpha = pause ? 0.3 : 0.2;
  cars.forEach((car) => car.draw(carCtx));
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  drawHud();

  if (activeSettings.showNetwork) {
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
  }
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

function resetSimulation(options = {}) {
  const { preserveManual = true } = options;
  const wasManual = preserveManual ? manualMode : false;
  const prevFollow = activeSettings.followRatio;

  cars.forEach((car) => car.dispose && car.dispose());

  traffic = buildTraffic(road);
  cars = generateCars(activeSettings.carCount, road);
  hydrateBrains(cars);
  bestCar = cars[0];
  manualCar = null;
  manualMode = false;

  if (wasManual) {
    setManualMode(true);
  } else {
    setManualMode(false);
  }

  activeSettings.followRatio = prevFollow;
}

function openSettingsModal() {
  if (!settingsModalEl) return;
  populateSettingsForm();
  showModal(settingsModalEl);
}

function populateSettingsForm() {
  const countInput = document.getElementById('settingCarCount');
  const followInput = document.getElementById('settingFollowRatio');
  const showNetworkInput = document.getElementById('settingShowNetwork');
  const mutationInput = document.getElementById('settingMutationRate');
  const trainIterInput = document.getElementById('settingTrainIterations');
  const trainDurationInput = document.getElementById('settingTrainDuration');
  if (countInput) countInput.value = activeSettings.carCount;
  if (followInput) followInput.value = activeSettings.followRatio;
  if (showNetworkInput) showNetworkInput.checked = activeSettings.showNetwork;
  if (mutationInput) mutationInput.value = activeSettings.mutationRate;
  if (trainIterInput) trainIterInput.value = activeSettings.trainingIterations;
  if (trainDurationInput)
    trainDurationInput.value = activeSettings.trainingDurationSeconds;
}

function saveSettingsFromForm() {
  const countInput = document.getElementById('settingCarCount');
  const followInput = document.getElementById('settingFollowRatio');
  const showNetworkInput = document.getElementById('settingShowNetwork');
  const mutationInput = document.getElementById('settingMutationRate');
  const trainIterInput = document.getElementById('settingTrainIterations');
  const trainDurationInput = document.getElementById('settingTrainDuration');
  const next = { ...activeSettings };
  if (countInput) {
    const val = Number(countInput.value);
    if (!Number.isNaN(val) && val >= 10 && val <= 1000) {
      next.carCount = val;
    }
  }
  if (followInput) {
    const val = Number(followInput.value);
    if (!Number.isNaN(val) && val >= 0.3 && val <= 0.95) {
      next.followRatio = val;
    }
  }
  if (showNetworkInput) {
    next.showNetwork = Boolean(showNetworkInput.checked);
  }
  if (mutationInput) {
    const val = Number(mutationInput.value);
    if (!Number.isNaN(val) && val >= 0 && val <= 1) {
      next.mutationRate = val;
    }
  }
  if (trainIterInput) {
    const val = Number(trainIterInput.value);
    if (!Number.isNaN(val) && val >= 1 && val <= 500) {
      next.trainingIterations = Math.floor(val);
    }
  }
  if (trainDurationInput) {
    const val = Number(trainDurationInput.value);
    if (!Number.isNaN(val) && val >= 1 && val <= 120) {
      next.trainingDurationSeconds = val;
    }
  }
  Object.assign(activeSettings, next);
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(activeSettings));
  applyNetworkVisibility();
  if (settingsModalEl) hideModal(settingsModalEl);
  resetSimulation();
}

function toggleTraining() {
  if (trainingActive) {
    stopTrainingLoop();
  } else {
    startTrainingLoop();
  }
}

function startTrainingLoop() {
  trainingIterationsLeft = Math.max(1, activeSettings.trainingIterations);
  trainingActive = true;
  pause = false;
  setManualMode(false);
  updateTrainButton();
  runTrainingCycle();
}

function stopTrainingLoop() {
  trainingActive = false;
  trainingIterationsLeft = 0;
  if (trainingTimerId) {
    clearTimeout(trainingTimerId);
    trainingTimerId = null;
  }
  updateTrainButton();
}

function runTrainingCycle() {
  if (!trainingActive) return;
  if (trainingIterationsLeft <= 0) {
    stopTrainingLoop();
    return;
  }

  resetSimulation({ preserveManual: false });
  const durationMs = Math.max(1, activeSettings.trainingDurationSeconds) * 1000;

  if (trainingTimerId) {
    clearTimeout(trainingTimerId);
  }

  trainingTimerId = setTimeout(() => {
    captureBestBrainForTraining();
    trainingIterationsLeft -= 1;
    if (trainingIterationsLeft <= 0) {
      stopTrainingLoop();
      return;
    }
    runTrainingCycle();
  }, durationMs);
}

function captureBestBrainForTraining() {
  if (!bestCar || !bestCar.brain) return;
  trainingBrain = JSON.parse(JSON.stringify(bestCar.brain));
}

function getLeadCar(candidates) {
  if (!candidates || candidates.length === 0) return null;
  return candidates.reduce((lead, car) => {
    if (car.carsPassed !== lead.carsPassed) {
      return car.carsPassed > lead.carsPassed ? car : lead;
    }
    return car.y < lead.y ? car : lead;
  }, candidates[0]);
}

function updatePassingStats(carList, trafficList) {
  if (!carList || !trafficList) return;
  carList.forEach((car) => {
    if (!car.passedTrafficIds) {
      car.passedTrafficIds = new Set();
    }
    trafficList.forEach((trafficCar) => {
      if (car.y < trafficCar.y && !car.passedTrafficIds.has(trafficCar.id)) {
        car.passedTrafficIds.add(trafficCar.id);
        car.carsPassed += 1;
      }
    });
  });
}

function drawHud() {
  if (!bestCar) return;
  carCtx.save();
  carCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  carCtx.fillRect(8, 8, 190, 54);
  carCtx.fillStyle = '#fff';
  carCtx.font = '14px sans-serif';
  carCtx.fillText(`Best cars passed: ${bestCar.carsPassed}`, 16, 28);
  carCtx.fillText(`Best y: ${bestCar.y.toFixed(1)}`, 16, 48);
  carCtx.restore();
}

function updateTrainButton() {
  if (!trainButtonEl) return;
  trainButtonEl.textContent = trainingActive ? '⏹️' : '🏋️';
  trainButtonEl.title = trainingActive ? 'Stop training' : 'Start training';
}

function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEYS.settings);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed || {};
  } catch (e) {
    return {};
  }
}

function togglePause() {
  pause = !pause;
  if (pauseButtonEl) {
    pauseButtonEl.textContent = pause ? '▶️' : '⏸️';
  }
}
