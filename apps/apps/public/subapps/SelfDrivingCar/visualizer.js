class Visualizer {
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
  }

  static drawLevel(ctx, level, left, top, width, height) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    const nodeRadius = 18;

    // draw connections between input and output nodes
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;

        // the color of the connection is based on the weight value, with positive weights being blue and negative weights being red, and the alpha (transparency) of the color is based on the absolute value of the weight
        const value = weights[i][j];
        ctx.strokeStyle = getRGBA(weights[i][j]) || 'rgba(0, 0, 0, 0.1)'; // if the weight is 0, use a default color with low opacity
        ctx.stroke();
      }
    }

    // draw input nodes on the bottom of the canvas
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);

      //draw a black circle first
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      // then draw a smaller white circle on top to create a border effect / space between the nodes and the connections
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }

    // draw output nodes on top of the canvas
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);

      //draw a black circle first
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      // then draw a smaller white circle on top to create a border effect / space between the nodes and the connections
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      // draw biases around the output nodes, with the color based on the bias value (positive → blue, negative → red) and the alpha (transparency) based on the absolute value of the bias
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]) || 'rgba(0, 0, 0, 0.1)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
