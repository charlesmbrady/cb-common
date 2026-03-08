/* ------------------------------------------------------------------ */
/*  NetworkVisualizer – draws a NeuralNetwork onto a 2D canvas ctx     */
/* ------------------------------------------------------------------ */

import type { NeuralNetworkData } from './neural-network';
import { lerp } from './math';
import { getRGBA } from './colors';

export class NetworkVisualizer {
  static drawNetwork(
    ctx: CanvasRenderingContext2D,
    network: NeuralNetworkData
  ): void {
    if (!network) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;
    const levelHeight = height / network.levels.length;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 3]);
      NetworkVisualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i === network.levels.length - 1 ? ['^', '<', '>', 'v'] : []
      );
    }
  }

  static drawLevel(
    ctx: CanvasRenderingContext2D,
    level: {
      inputs: number[];
      outputs: number[];
      weights: number[][];
      biases: number[];
    },
    left: number,
    top: number,
    width: number,
    height: number,
    outputLabels: string[]
  ): void {
    const right = left + width;
    const bottom = top + height;
    const { inputs, outputs, weights, biases } = level;
    const nodeRadius = 18;

    // Connections
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(NetworkVisualizer.getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(NetworkVisualizer.getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }

    // Input nodes
    for (let i = 0; i < inputs.length; i++) {
      const x = NetworkVisualizer.getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // Output nodes
    for (let i = 0; i < outputs.length; i++) {
      const x = NetworkVisualizer.getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.font = `${nodeRadius * 1.5}px Arial`;
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  private static getNodeX(
    nodes: number[],
    index: number,
    left: number,
    right: number
  ): number {
    return lerp(
      left,
      right,
      nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
