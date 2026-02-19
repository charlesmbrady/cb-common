import { NeuralNetwork } from '../../ml/network.js';

export function createBrain(rayCount) {
  return new NeuralNetwork([rayCount, 6, 4]);
}

export function applyBrainOutputs(sensor, brain, controls) {
  if (!sensor || !brain || !controls) return;

  const offsets = sensor.readings.map((reading) =>
    reading == null ? 0 : 1 - reading.offset
  );
  const outputs = NeuralNetwork.feedForward(offsets, brain);

  controls.forward = outputs[0];
  controls.left = outputs[1];
  controls.right = outputs[2];
  controls.reverse = outputs[3];
}
