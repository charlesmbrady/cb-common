// Utility for initializing and animating the data stream/starfield canvas
export function initStreamAnimation(
  canvas: HTMLCanvasElement,
  options: {
    streams?: number;
    speed?: number;
    length?: number;
    colors?: string[];
    dotSize?: number;
    dotsPerStream?: number;
    fov?: number;
  } = {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { stop: () => {} };
  }
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);
  const STREAMS = options.streams || 80;
  const SPEED = options.speed || 0.008;
  const LENGTH = options.length || 0.18;
  const COLORS = options.colors || ['#6366F1', '#34D399', '#818CF8'];
  const DOT_SIZE = options.dotSize || 2;
  const DOTS_PER_STREAM = options.dotsPerStream || 8;
  const FOV = options.fov || 650;

  function randomAngle() {
    return Math.random() * 2 * Math.PI;
  }
  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  function randomStream() {
    const angle = randomAngle();
    return {
      angle,
      color: randomColor(),
      z: Math.random(),
    };
  }
  let streams = Array.from({ length: STREAMS }, randomStream);

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  let animationId: number;
  function animate() {
    ctx!.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    for (let i = 0; i < STREAMS; i++) {
      const s = streams[i];
      for (let d = 0; d < DOTS_PER_STREAM; d++) {
        const z = s.z + (d / DOTS_PER_STREAM) * LENGTH;
        const r = FOV * z;
        const x = cx + Math.cos(s.angle) * r;
        const y = cy + Math.sin(s.angle) * r;
        ctx!.globalAlpha = 1 - z;
        ctx!.beginPath();
        ctx!.arc(x, y, DOT_SIZE, 0, 2 * Math.PI);
        ctx!.fillStyle = s.color;
        ctx!.fill();
      }
      s.z += SPEED;
      if (s.z > 1) {
        streams[i] = randomStream();
      }
    }
    ctx!.globalAlpha = 1;
    animationId = requestAnimationFrame(animate);
  }

  function start() {
    resize();
    animate();
  }
  function stop() {
    cancelAnimationFrame(animationId);
  }
  window.addEventListener('resize', resize);
  start();
  return { stop };
}
