class NeuralNetwork {
  //Each neuron is a sensor input, and each output is a control for the car (forward, left, right, reverse) or whatever else we want to control
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  // // Not in use, here's some notes that explain how to use:
  // Use parents when generating cars: In main.js, load two selected brains (parentA, parentB). For each car: cars[i].brain = NeuralNetwork.crossover(parentA, parentB); if (i !== 0) NeuralNetwork.mutate(cars[i].brain, 0.05); Keep car 0 as the elite (no mutation).
  // Scenario-specific brains: Tag brains (e.g., “heavy traffic,” “tight lanes”) when saving. Pick parents whose tags match the scenario you want to improve.
  // Fitness signal: Make sure you compute and store a per-run score (e.g., max -y traveled before damage). Use it to decide which brains to keep and to surface top options in the UI.
  static crossover(networkA, networkB) {
    const clone = JSON.parse(JSON.stringify(networkA));

    for (let l = 0; l < clone.levels.length; l++) {
      const level = clone.levels[l];
      for (let i = 0; i < level.inputs.length; i++) {}
      for (let j = 0; j < level.outputs.length; j++) {
        //pick a weight from either parent randomly
        level.weights[i][j] =
          Math.random() < 0.5
            ? networkA.levels[l].weights[i][j]
            : networkB.levels[l].weights[i][j];
      }
    }
  }

  // takes network and a mutation amount (how similar the mutated network should be to the original, with 0 being identical and 1 being completely random), and randomly mutates the weights and biases of the network based on the mutation amount
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] =
          Math.random() < amount ? Math.random() * 2 - 1 : level.biases[i];
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          // with a certain probability, change the weight to a new random value between -1 and 1, otherwise keep the same weight
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount); // values we get from the car's sensors
    this.outputs = new Array(outputCount); //computed using weights and biases, these will be the controls for the car
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  // make this static so it can be serialized
  static #randomize(level) {
    // go through every input/output pair and assign a random weight between -1 and 1
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    // both weights and biasis are random between -1 and 1
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  // this is the function that takes in the inputs and computes the outputs based on the weights and biases
  static feedForward(givenInputs, level) {
    // go through all the level inputs and assign the given inputs (values from car sensors) to them
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // calculate sum of inputs * weights for each output and compare it to the bias to determine if the output should be 1 or 0
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}
