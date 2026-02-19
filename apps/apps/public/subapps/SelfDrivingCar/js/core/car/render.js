export function renderCar(ctx, car, drawSensor = false) {
  if (car.sensor && drawSensor) {
    car.sensor.draw(ctx);
  }

  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(-car.angle);

  if (car.damaged || car.controlType === 'DUMMY') {
    ctx.drawImage(
      car.mask,
      -car.width / 2,
      -car.height / 2,
      car.width,
      car.height
    );
    ctx.globalCompositeOperation = 'multiply';
  }

  ctx.drawImage(
    car.img,
    -car.width / 2,
    -car.height / 2,
    car.width,
    car.height
  );

  ctx.restore();
}

export function tintCarMask(car, color) {
  const maskCtx = car.mask.getContext('2d');
  maskCtx.globalCompositeOperation = 'source-over';
  maskCtx.clearRect(0, 0, car.mask.width, car.mask.height);
  maskCtx.fillStyle = color;
  maskCtx.fillRect(0, 0, car.mask.width, car.mask.height);
  maskCtx.globalCompositeOperation = 'destination-atop';
  maskCtx.drawImage(car.img, 0, 0, car.mask.width, car.mask.height);
  car.currentMaskColor = color;
}
