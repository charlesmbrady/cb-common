/* ------------------------------------------------------------------ */
/*  NeuralNetwork – simple feed-forward network with mutation          */
/*  Local copy for three-core to avoid cross-library rootDir issues.   */
/*  Canonical source lives in ctx-core.                                */
/* ------------------------------------------------------------------ */

/** Linear interpolation */
function lerp(A: number, B: number, t: number): number {
  return A + (B - A) * t;
}

export interface NetworkLevel {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];
}

export interface NeuralNetworkData {
  levels: NetworkLevel[];
}

export class NeuralNetwork implements NeuralNetworkData {
  levels: NetworkLevel[];

  constructor(neuronCounts: number[]) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(
        NeuralNetwork.createLevel(neuronCounts[i], neuronCounts[i + 1])
      );
    }
  }

  /* ---------- Static helpers ------------------------------------- */

  static createLevel(inputCount: number, outputCount: number): NetworkLevel {
    const inputs = new Array<number>(inputCount).fill(0);
    const outputs = new Array<number>(outputCount).fill(0);
    const biases = new Array<number>(outputCount).fill(0);
    const weights: number[][] = [];

    for (let i = 0; i < inputCount; i++) {
      weights[i] = new Array<number>(outputCount).fill(0);
    }

    NeuralNetwork.randomizeLevel({ inputs, outputs, biases, weights });
    return { inputs, outputs, biases, weights };
  }

  static randomizeLevel(level: NetworkLevel): void {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(
    givenInputs: number[],
    network: NeuralNetworkData
  ): number[] {
    let outputs = NeuralNetwork.feedForwardLevel(
      givenInputs,
      network.levels[0]
    );
    for (let i = 1; i < network.levels.length; i++) {
      outputs = NeuralNetwork.feedForwardLevel(outputs, network.levels[i]);
    }
    return outputs;
  }

  static feedForwardLevel(
    givenInputs: number[],
    level: NetworkLevel
  ): number[] {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }
    return level.outputs;
  }

  static mutate(network: NeuralNetworkData, amount = 1): void {
    for (const level of network.levels) {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] =
          Math.random() < amount ? Math.random() * 2 - 1 : level.biases[i];
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    }
  }

  static crossover(
    networkA: NeuralNetworkData,
    networkB: NeuralNetworkData
  ): NeuralNetworkData {
    const clone: NeuralNetworkData = JSON.parse(JSON.stringify(networkA));
    for (let l = 0; l < clone.levels.length; l++) {
      const level = clone.levels[l];
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] =
            Math.random() < 0.5
              ? networkA.levels[l].weights[i][j]
              : networkB.levels[l].weights[i][j];
        }
      }
      for (let b = 0; b < level.biases.length; b++) {
        level.biases[b] =
          Math.random() < 0.5
            ? networkA.levels[l].biases[b]
            : networkB.levels[l].biases[b];
      }
    }
    return clone;
  }

  /** Deep-clone a network's data (levels array). */
  static clone(network: NeuralNetworkData): NeuralNetworkData {
    return JSON.parse(JSON.stringify(network));
  }
}
