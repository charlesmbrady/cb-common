import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';

/* ═══════════════════════════════════════════════════════════════
   CONFIG — every tunable value lives here
   ═══════════════════════════════════════════════════════════════ */
const CFG = {
  // Layout
  layout: 'inline', // 'inline' | 'v'
  bankAngle: 90, // degrees (V-engine only, total included angle)
  cylinders: 4, // total (V = split across 2 banks)

  // Block / geometry
  bore: 3.0,
  stroke: 3.4,
  get crankRadius() {
    return this.stroke / 2;
  },
  rodLength: 5.5,
  cylinderSpacing: 3.8,
  blockPadding: 1.0,

  // Part appearance
  blockColor: '#556677',
  blockOpacity: 0.12,
  blockRoughness: 0.7,
  blockMetalness: 0.3,
  crankColor: '#888899',
  crankRoughness: 0.4,
  crankMetalness: 0.7,
  rodColor: '#dd6633',
  rodRoughness: 0.35,
  rodMetalness: 0.6,
  pistonColor: '#ccccdd',
  pistonRoughness: 0.25,
  pistonMetalness: 0.7,
  sleeveColor: '#6688aa',
  sleeveOpacity: 0.15,
  flywheelColor: '#666680',
  flywheelRadius: 3.2,
  flywheelWidth: 0.6,
  pinColor: '#eeeeff',

  // Dynamics
  inertia: 0.12,
  frictionA: 1.8,
  frictionB: 0.008,
  frictionC: 0.000002,
  compressionDrag: 0.4, // extra drag per cylinder from compression

  // Torque / combustion
  maxTorque: 22,
  peakRpm: 4500,
  torqueCurveWidth: 1.0, // wider = flatter curve
  idleTargetRpm: 800,
  idleStrength: 0.6,
  redlineRpm: 7000,

  // Starter
  starterTorque: 6,
  starterMaxRpm: 350,
  crankToFireChance: 0.012,
  starterGrindFreq: 42, // Hz base frequency of starter bendix

  // Drivetrain
  showCar: false,
  gearRatio: 3.5, // transmission (single effective ratio)
  finalDrive: 3.73, // differential ratio
  wheelRadius: 1.5,
  tireWidth: 0.9,
  wheelbase: 10.0, // front-to-rear axle distance
  trackWidth: 6.5, // left-to-right wheel spacing
  chassisLength: 16.0,
  chassisWidth: 6.0,
  chassisHeight: 3.2,
  chassisColor: '#334455',
  chassisOpacity: 0.1,
  wheelColor: '#222222',
  tireColor: '#111111',

  // Vehicle physics
  carMass: 1200, // kg (light sedan / sports car)
  tireGrip: 0.7, // static friction coefficient (rubber on dry road ~0.7)
  rollingResistance: 0.012, // typical tire rolling resistance
  aeroDrag: 0.32, // Cd × frontal area (m²)
  brakeTorque: 2500, // Nm at the wheels
  maxSteerAngle: 0.55, // radians (~31°)
  steerSpeed: 2.5, // radians/s — how fast wheels turn
  steerReturnSpeed: 4.0, // radians/s — self-centering speed

  // Audio
  masterVolume: 0.7,
  exhaustResonance: 1.5,
  exhaustBassFreq: 150,
  mechanicalVolume: 0.5,
  combustionPulseWidth: 4, // sharpness of per-cylinder TDC pulse
  combustionVolume: 0.7,
};

/* helper: generate phase offsets for current cylinder count + layout */
function computePhaseOffsets() {
  const n = CFG.cylinders;
  if (n < 1) return [0];
  if (CFG.layout === 'inline') {
    // Even-fire: spread evenly over 720° (4-stroke)
    const offsets = [];
    // Classic firing order heuristic
    const step = (4 * Math.PI) / n; // 720° / n
    for (let i = 0; i < n; i++) offsets.push((i * step) % (2 * Math.PI));
    return offsets;
  }
  // V-engine: alternate banks
  const halfAngle = ((CFG.bankAngle / 2) * Math.PI) / 180;
  const perBank = Math.ceil(n / 2);
  const step = (4 * Math.PI) / n;
  const offsets = [];
  for (let i = 0; i < n; i++) {
    const bank = i % 2; // 0 = left, 1 = right
    const idx = Math.floor(i / 2);
    const basePhase = (i * step) % (2 * Math.PI);
    offsets.push(basePhase);
  }
  return offsets;
}

/* ═══════════════════════════════════════════════════════════════
   RULES ENGINE — constrains values to keep things physical
   ═══════════════════════════════════════════════════════════════ */
const RULES = {
  enforce(key, val) {
    switch (key) {
      case 'cylinders':
        val = Math.round(Math.max(1, Math.min(12, val)));
        break;
      case 'bankAngle':
        val = Math.max(15, Math.min(180, val));
        break;
      case 'bore':
        val = Math.max(0.5, Math.min(8, val));
        break;
      case 'stroke':
        val = Math.max(0.5, Math.min(10, val));
        // rod must be > crank radius
        if (CFG.rodLength <= val / 2 + 0.3) CFG.rodLength = val / 2 + 0.5;
        break;
      case 'rodLength':
        val = Math.max(CFG.stroke / 2 + 0.3, Math.min(16, val));
        break;
      case 'cylinderSpacing':
        val = Math.max(CFG.bore + 0.3, Math.min(8, val));
        break;
      case 'blockPadding':
        val = Math.max(0.2, Math.min(4, val));
        break;
      case 'flywheelRadius':
        val = Math.max(1, Math.min(8, val));
        break;
      case 'flywheelWidth':
        val = Math.max(0.1, Math.min(3, val));
        break;
      case 'inertia':
        val = Math.max(0.01, Math.min(2, val));
        break;
      case 'redlineRpm':
        val = Math.max(CFG.idleTargetRpm + 500, Math.min(15000, val));
        break;
      case 'idleTargetRpm':
        val = Math.max(200, Math.min(CFG.redlineRpm - 500, val));
        break;
      case 'peakRpm':
        val = Math.max(CFG.idleTargetRpm + 200, Math.min(CFG.redlineRpm, val));
        break;
      case 'starterMaxRpm':
        val = Math.max(50, Math.min(CFG.idleTargetRpm, val));
        break;
      case 'compressionDrag':
        val = Math.max(0, Math.min(3, val));
        break;
      case 'gearRatio':
        val = Math.max(0.5, Math.min(8, val));
        break;
      case 'finalDrive':
        val = Math.max(1.0, Math.min(6, val));
        break;
      case 'wheelRadius':
        val = Math.max(0.5, Math.min(4, val));
        break;
      case 'tireWidth':
        val = Math.max(0.3, Math.min(3, val));
        break;
      case 'wheelbase':
        val = Math.max(4, Math.min(20, val));
        break;
      case 'trackWidth':
        val = Math.max(3, Math.min(12, val));
        break;
      case 'chassisLength':
        val = Math.max(6, Math.min(25, val));
        break;
      case 'chassisWidth':
        val = Math.max(3, Math.min(12, val));
        break;
      case 'chassisHeight':
        val = Math.max(1, Math.min(6, val));
        break;
      case 'carMass':
        val = Math.max(500, Math.min(4000, val));
        break;
      case 'tireGrip':
        val = Math.max(0.2, Math.min(2.0, val));
        break;
      case 'rollingResistance':
        val = Math.max(0.005, Math.min(0.05, val));
        break;
      case 'aeroDrag':
        val = Math.max(0.1, Math.min(1.5, val));
        break;
      case 'brakeTorque':
        val = Math.max(500, Math.min(8000, val));
        break;
      case 'blockOpacity':
      case 'sleeveOpacity':
      case 'chassisOpacity':
      case 'masterVolume':
      case 'mechanicalVolume':
      case 'combustionVolume':
        val = Math.max(0, Math.min(1, val));
        break;
    }
    return val;
  },
  /** Return warnings (string[]) for current config */
  validate() {
    const w = [];
    if (CFG.rodLength < CFG.crankRadius + 0.2)
      w.push('Rod length too short — will collide with crank shaft');
    if (CFG.cylinderSpacing < CFG.bore + 0.1)
      w.push('Cylinder spacing too narrow — bores overlap');
    if (CFG.idleTargetRpm >= CFG.redlineRpm - 200)
      w.push('Idle target too close to redline');
    if (CFG.layout === 'v' && CFG.cylinders < 2)
      w.push('V-engine needs ≥ 2 cylinders');
    if (CFG.peakRpm > CFG.redlineRpm)
      w.push('Peak RPM above redline — torque curve truncated');
    return w;
  },
};

/* ═══════════════════════════════════════════════════════════════
   THREE.JS SCENE
   ═══════════════════════════════════════════════════════════════ */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(20, 14, 24);
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0, 3, 0);
orbitControls.enableDamping = true;
orbitControls.update();

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(10, 25, 15);
dirLight.castShadow = true;
scene.add(dirLight);
scene.add(dirLight.target); // needed for target.updateMatrixWorld
scene.add(new THREE.AmbientLight(0x606080, 0.7));
scene.add(new THREE.HemisphereLight(0x8888ff, 0x443322, 0.5));
// ── Ground ──
const gridHelper = new THREE.GridHelper(60, 60, 0x444466, 0x333355);
scene.add(gridHelper);

// Solid ground plane (for car mode) — very large grass-like surface
const groundGeo = new THREE.PlaneGeometry(10000, 10000, 128, 128);
// Procedural grass-like color via vertex colors
{
  const posAttr = groundGeo.getAttribute('position');
  const colors = new Float32Array(posAttr.count * 3);
  for (let i = 0; i < posAttr.count; i++) {
    const r = 0.12 + Math.random() * 0.06;
    const g = 0.28 + Math.random() * 0.14;
    const b = 0.08 + Math.random() * 0.04;
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
  groundGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}
const groundMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.95,
  metalness: 0.0,
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
groundMesh.visible = false;
scene.add(groundMesh);

// Road / ground markings — a large grid of lines for visual reference when driving
const roadGroup = new THREE.Group();
const roadLineMat = new THREE.MeshBasicMaterial({ color: 0x555560 });
const gridSpacing = 50; // meters between grid lines
const gridExtent = 500; // half-extent (total = 1000m × 1000m area)

// Lines along Z (running north-south)
for (let x = -gridExtent; x <= gridExtent; x += gridSpacing) {
  const lineGeo = new THREE.PlaneGeometry(0.15, gridExtent * 2);
  const line = new THREE.Mesh(lineGeo, roadLineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(x, 0.02, 0);
  roadGroup.add(line);
}
// Lines along X (running east-west)
for (let z = -gridExtent; z <= gridExtent; z += gridSpacing) {
  const lineGeo = new THREE.PlaneGeometry(gridExtent * 2, 0.15);
  const line = new THREE.Mesh(lineGeo, roadLineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(0, 0.02, z);
  roadGroup.add(line);
}
// Highlighted center lines (road centerline)
const centerMat = new THREE.MeshBasicMaterial({ color: 0x999955 });
const centerLineZ = new THREE.Mesh(
  new THREE.PlaneGeometry(0.3, gridExtent * 2),
  centerMat
);
centerLineZ.rotation.x = -Math.PI / 2;
centerLineZ.position.set(0, 0.025, 0);
roadGroup.add(centerLineZ);
const centerLineX = new THREE.Mesh(
  new THREE.PlaneGeometry(gridExtent * 2, 0.3),
  centerMat
);
centerLineX.rotation.x = -Math.PI / 2;
centerLineX.position.set(0, 0.025, 0);
roadGroup.add(centerLineX);
roadGroup.visible = false;
scene.add(roadGroup);

// ── Follow camera state ──
let followCamActive = false;
const followOffset = new THREE.Vector3(0, 6, -18); // behind & above
const followLookAhead = new THREE.Vector3(0, 2, 12); // look-at point ahead of car

/* ═══════════════════════════════════════════════════════════════
   DYNAMIC ENGINE BUILD — tear-down + rebuild when config changes
   ═══════════════════════════════════════════════════════════════ */
let engineRoot = new THREE.Group();
scene.add(engineRoot);
let crankGroup, rodMeshes, pistonMeshes, pistonPinMeshes, bankGroups;
let matBlock, matSleeve; // refs we need to update live

function hexToInt(h) {
  return parseInt(h.replace('#', ''), 16);
}

function buildEngine() {
  // Dispose old
  engineRoot.traverse((c) => {
    if (c.geometry) c.geometry.dispose();
  });
  scene.remove(engineRoot);
  engineRoot = new THREE.Group();
  scene.add(engineRoot);

  const phaseOffsets = computePhaseOffsets();
  const n = CFG.cylinders;
  const isV = CFG.layout === 'v';
  const halfAngle = isV ? ((CFG.bankAngle / 2) * Math.PI) / 180 : 0;

  // Materials (recreate from config)
  matBlock = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.blockColor),
    roughness: CFG.blockRoughness,
    metalness: CFG.blockMetalness,
    transparent: true,
    opacity: CFG.blockOpacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const matEdge = new THREE.LineBasicMaterial({
    color: 0x778899,
    transparent: true,
    opacity: 0.5,
  });
  const matCrank = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.crankColor),
    roughness: CFG.crankRoughness,
    metalness: CFG.crankMetalness,
  });
  const matRod = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.rodColor),
    roughness: CFG.rodRoughness,
    metalness: CFG.rodMetalness,
  });
  const matPiston = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.pistonColor),
    roughness: CFG.pistonRoughness,
    metalness: CFG.pistonMetalness,
  });
  matSleeve = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.sleeveColor),
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: CFG.sleeveOpacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const matFlywheel = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.flywheelColor),
    roughness: 0.5,
    metalness: 0.6,
  });
  const matPin = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.pinColor),
    roughness: 0.2,
    metalness: 0.9,
  });
  const matCap = new THREE.MeshStandardMaterial({
    color: 0x445566,
    roughness: 0.6,
    metalness: 0.4,
    transparent: true,
    opacity: 0.25,
  });

  // How many banks?
  const banks = isV ? 2 : 1;
  const cylPerBank = isV ? Math.ceil(n / 2) : n;
  const totalLen = (cylPerBank - 1) * CFG.cylinderSpacing;
  const startZ = -totalLen / 2;

  // Block dimensions
  const blockH = CFG.stroke + CFG.rodLength + 3;
  const blockW = CFG.bore + CFG.blockPadding * 2;
  const blockD = totalLen + CFG.bore + CFG.blockPadding * 2;

  // Build block shells for each bank
  bankGroups = [];
  for (let b = 0; b < banks; b++) {
    const bankGrp = new THREE.Group();
    if (isV) {
      const angle = b === 0 ? halfAngle : -halfAngle;
      bankGrp.rotation.z = angle;
    }
    const blockGeo = new THREE.BoxGeometry(blockW, blockH, blockD);
    const bm = new THREE.Mesh(blockGeo, matBlock);
    bm.position.set(0, blockH / 2 - 1.5, 0);
    bm.renderOrder = 10;
    bankGrp.add(bm);
    const be = new THREE.LineSegments(
      new THREE.EdgesGeometry(blockGeo),
      matEdge
    );
    be.position.copy(bm.position);
    bankGrp.add(be);
    engineRoot.add(bankGrp);
    bankGroups.push(bankGrp);
  }

  // Oil pan
  const panW = isV ? blockW * 2 + 2 : blockW + 0.6;
  const panGeo = new THREE.BoxGeometry(panW, 2.5, blockD + 0.3);
  const panMesh = new THREE.Mesh(panGeo, matBlock);
  panMesh.position.set(0, -2.0, 0);
  panMesh.renderOrder = 10;
  engineRoot.add(panMesh);
  const pe = new THREE.LineSegments(new THREE.EdgesGeometry(panGeo), matEdge);
  pe.position.copy(panMesh.position);
  engineRoot.add(pe);

  // Crank group (shared across banks)
  crankGroup = new THREE.Group();
  engineRoot.add(crankGroup);
  const shaftGeo = new THREE.CylinderGeometry(0.6, 0.6, blockD + 4, 24);
  const shaft = new THREE.Mesh(shaftGeo, matCrank);
  shaft.rotation.x = Math.PI / 2;
  shaft.castShadow = true;
  crankGroup.add(shaft);

  rodMeshes = [];
  pistonMeshes = [];
  pistonPinMeshes = [];

  const unitRodGeo = new THREE.BoxGeometry(0.45, 1, 0.35);
  const pisGeo = new THREE.CylinderGeometry(
    CFG.bore * 0.47,
    CFG.bore * 0.47,
    1.0,
    24
  );
  const wpGeo = new THREE.CylinderGeometry(0.15, 0.15, CFG.bore * 0.55, 12);
  const cpGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.6, 16);
  const cwGeo = new THREE.BoxGeometry(0.5, 2.4, 0.35);
  const slGeo = new THREE.CylinderGeometry(
    CFG.bore * 0.52,
    CFG.bore * 0.52,
    CFG.stroke + 4,
    24,
    1,
    true
  );

  for (let i = 0; i < n; i++) {
    const bank = isV ? i % 2 : 0;
    const bankIdx = isV ? Math.floor(i / 2) : i;
    const z = startZ + bankIdx * CFG.cylinderSpacing;
    const phase = phaseOffsets[i];
    const px = CFG.crankRadius * Math.cos(phase);
    const py = CFG.crankRadius * Math.sin(phase);

    // Crank webs + pin (on shared crank)
    for (const side of [-0.28, 0.28]) {
      const web = new THREE.Mesh(cwGeo, matCrank);
      web.position.set(px / 2, py / 2, z + side);
      web.rotation.z = Math.atan2(py, px) - Math.PI / 2;
      web.castShadow = true;
      crankGroup.add(web);
    }
    const pin = new THREE.Mesh(cpGeo, matPin);
    pin.position.set(px, py, z);
    pin.rotation.x = Math.PI / 2;
    pin.castShadow = true;
    crankGroup.add(pin);

    // Rod, piston, wrist pin — live in bank group (to inherit bank rotation)
    const rod = new THREE.Mesh(unitRodGeo, matRod);
    rod.castShadow = true;
    bankGroups[bank].add(rod);
    rodMeshes.push(rod);

    const pis = new THREE.Mesh(pisGeo, matPiston);
    pis.castShadow = true;
    bankGroups[bank].add(pis);
    pistonMeshes.push(pis);

    const wp = new THREE.Mesh(wpGeo, matPin);
    wp.rotation.x = Math.PI / 2;
    bankGroups[bank].add(wp);
    pistonPinMeshes.push(wp);

    // Sleeve
    const topY = CFG.crankRadius + CFG.rodLength;
    const botY =
      -CFG.crankRadius + Math.sqrt(CFG.rodLength ** 2 - CFG.crankRadius ** 2);
    const sl = new THREE.Mesh(slGeo, matSleeve);
    sl.position.set(0, (topY + botY) / 2, z);
    sl.renderOrder = 9;
    bankGroups[bank].add(sl);
  }

  // Flywheel
  const fwGeo = new THREE.CylinderGeometry(
    CFG.flywheelRadius,
    CFG.flywheelRadius,
    CFG.flywheelWidth,
    32
  );
  const fw = new THREE.Mesh(fwGeo, matFlywheel);
  fw.position.set(0, 0, startZ - CFG.cylinderSpacing * 0.8);
  fw.rotation.x = Math.PI / 2;
  fw.castShadow = true;
  crankGroup.add(fw);

  // Bearing caps
  for (let i = 0; i <= cylPerBank; i++) {
    const z = startZ - CFG.cylinderSpacing * 0.5 + i * CFG.cylinderSpacing;
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.3, 16),
      matCap
    );
    cap.position.set(0, -0.5, z);
    cap.rotation.x = Math.PI / 2;
    engineRoot.add(cap);
  }
}
buildEngine();

/* ═══════════════════════════════════════════════════════════════
   CAR BODY + DRIVETRAIN
   ═══════════════════════════════════════════════════════════════ */
let carRoot = new THREE.Group();
scene.add(carRoot);
let wheelMeshes = [],
  axleMeshes = [],
  driveshaftMesh,
  rearAxleGrp;
let matChassis;
let engineLocalY = 0,
  engineLocalZ = 0; // engine position relative to car origin

function buildCar() {
  // Dispose old
  carRoot.traverse((c) => {
    if (c.geometry) c.geometry.dispose();
  });
  scene.remove(carRoot);
  carRoot = new THREE.Group();
  scene.add(carRoot);
  wheelMeshes = [];
  axleMeshes = [];
  rearAxleGrp = null;
  driveshaftMesh = null;

  if (!CFG.showCar) {
    engineRoot.position.set(0, 0, 0);
    engineRoot.scale.set(1, 1, 1);
    return;
  }

  const CL = CFG.chassisLength,
    CW = CFG.chassisWidth,
    CH = CFG.chassisHeight;
  const WB = CFG.wheelbase,
    TW = CFG.trackWidth;
  const WR = CFG.wheelRadius,
    TiW = CFG.tireWidth;

  // Tire tube radius — the torus cross-section radius
  const tubeR = TiW * 0.45;
  // Axle center height: tire bottom touches y=0, so center = major radius + tube radius
  const axleY = WR + tubeR;
  // Chassis sits above axle line with slight clearance
  const chassisY = axleY + CH / 2 + 0.15;

  // Materials
  matChassis = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.chassisColor),
    roughness: 0.5,
    metalness: 0.4,
    transparent: true,
    opacity: CFG.chassisOpacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const matEdge = new THREE.LineBasicMaterial({
    color: 0x556688,
    transparent: true,
    opacity: 0.35,
  });
  const matWheel = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.wheelColor),
    roughness: 0.6,
    metalness: 0.5,
  });
  const matTire = new THREE.MeshStandardMaterial({
    color: hexToInt(CFG.tireColor),
    roughness: 0.9,
    metalness: 0.05,
  });
  const matAxle = new THREE.MeshStandardMaterial({
    color: 0x555566,
    roughness: 0.4,
    metalness: 0.7,
  });

  // ── Chassis body (lower box + cabin) ──
  const lowerGeo = new THREE.BoxGeometry(CW, CH * 0.5, CL);
  const lower = new THREE.Mesh(lowerGeo, matChassis);
  lower.position.set(0, chassisY - CH * 0.25, 0);
  lower.renderOrder = 11;
  carRoot.add(lower);
  const lEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(lowerGeo),
    matEdge
  );
  lEdge.position.copy(lower.position);
  carRoot.add(lEdge);

  // Cabin / upper section (slightly narrower & shorter, set back)
  const cabW = CW * 0.92,
    cabH = CH * 0.55,
    cabL = CL * 0.45;
  const cabGeo = new THREE.BoxGeometry(cabW, cabH, cabL);
  const cab = new THREE.Mesh(cabGeo, matChassis);
  cab.position.set(0, chassisY + CH * 0.25 + cabH * 0.15, -CL * 0.05);
  cab.renderOrder = 11;
  carRoot.add(cab);
  const cEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(cabGeo),
    matEdge
  );
  cEdge.position.copy(cab.position);
  carRoot.add(cEdge);

  // ── Hood bump (engine bay outline) ──
  const hoodW = CW * 0.88,
    hoodH = CH * 0.12,
    hoodL = CL * 0.38;
  const hoodGeo = new THREE.BoxGeometry(hoodW, hoodH, hoodL);
  const hood = new THREE.Mesh(hoodGeo, matChassis);
  hood.position.set(0, chassisY + CH * 0.25, CL * 0.25);
  hood.renderOrder = 11;
  carRoot.add(hood);
  const hEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(hoodGeo),
    matEdge
  );
  hEdge.position.copy(hood.position);
  carRoot.add(hEdge);

  // ── Floor pan (opaque thin slab) ──
  const floorGeo = new THREE.BoxGeometry(CW - 0.4, 0.15, CL - 0.5);
  const matFloor = new THREE.MeshStandardMaterial({
    color: 0x222233,
    roughness: 0.8,
    metalness: 0.2,
  });
  const floor = new THREE.Mesh(floorGeo, matFloor);
  floor.position.set(0, chassisY - CH * 0.5, 0);
  floor.receiveShadow = true;
  carRoot.add(floor);

  // ── Transmission tunnel (center floor spine) ──
  const tunnelW = CW * 0.12,
    tunnelH = CH * 0.22,
    tunnelL = WB * 0.85;
  const tunnelGeo = new THREE.BoxGeometry(tunnelW, tunnelH, tunnelL);
  const tunnel = new THREE.Mesh(tunnelGeo, matFloor);
  tunnel.position.set(0, chassisY - CH * 0.5 + tunnelH / 2, 0);
  carRoot.add(tunnel);

  // ── Wheels (tire + rim) ──
  // Each wheel: outer Group (positioned) → inner spinGrp (rotates on X to roll)
  const tireGeo = new THREE.TorusGeometry(WR, TiW * 0.45, 12, 28);
  const rimGeo = new THREE.CylinderGeometry(
    WR * 0.65,
    WR * 0.65,
    TiW * 0.6,
    16
  );
  const spokeGeo = new THREE.BoxGeometry(0.12, WR * 1.1, TiW * 0.15);

  const positions = [
    { x: -TW / 2, z: WB / 2 }, // front-left  [0]
    { x: TW / 2, z: WB / 2 }, // front-right [1]
    { x: -TW / 2, z: -WB / 2 }, // rear-left   [2]
    { x: TW / 2, z: -WB / 2 }, // rear-right  [3]
  ];

  positions.forEach((pos) => {
    const wheelGrp = new THREE.Group();
    wheelGrp.position.set(pos.x, axleY, pos.z);

    // spinGrp rotates around X (the left-right axle axis) to roll the wheel forward
    // All parts inside must be built with the axle along X.
    const spinGrp = new THREE.Group();

    // Tire: TorusGeometry default ring is in XY plane (hole along Z).
    // We need the hole along X (the axle) → rotate 90° around Y.
    const tire = new THREE.Mesh(tireGeo, matTire);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    spinGrp.add(tire);

    // Rim disc: CylinderGeometry along Y → rotate to lie along X (axle)
    const rim = new THREE.Mesh(rimGeo, matWheel);
    rim.rotation.z = Math.PI / 2;
    rim.castShadow = true;
    spinGrp.add(rim);

    // Spokes (5) — radiate in the YZ plane (perpendicular to X axle)
    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(spokeGeo, matWheel);
      const angle = (s / 5) * Math.PI * 2;
      spoke.position.set(
        0,
        Math.cos(angle) * WR * 0.35,
        Math.sin(angle) * WR * 0.35
      );
      spoke.rotation.x = angle;
      spinGrp.add(spoke);
    }

    wheelGrp.add(spinGrp);
    carRoot.add(wheelGrp);
    wheelMeshes.push(wheelGrp);
  });

  // ── Axles ──
  const axleGeo = new THREE.CylinderGeometry(0.15, 0.15, TW + 0.5, 10);

  // Front axle (not driven)
  const frontAxle = new THREE.Mesh(axleGeo, matAxle);
  frontAxle.position.set(0, axleY, WB / 2);
  frontAxle.rotation.z = Math.PI / 2;
  carRoot.add(frontAxle);

  // Rear axle (driven) — wrapped in group so we can spin it
  rearAxleGrp = new THREE.Group();
  rearAxleGrp.position.set(0, axleY, -WB / 2);
  const rearAxleMesh = new THREE.Mesh(axleGeo, matAxle);
  rearAxleMesh.rotation.z = Math.PI / 2;
  rearAxleGrp.add(rearAxleMesh);
  carRoot.add(rearAxleGrp);

  // Rear differential housing
  const diffGeo = new THREE.SphereGeometry(0.35, 12, 8);
  const diff = new THREE.Mesh(diffGeo, matAxle);
  rearAxleGrp.add(diff); // sits at center of rear axle

  // ── Driveshaft (engine/transmission → rear differential) ──
  // Runs along the car's centerline at axle height, from behind engine to rear diff
  const dsStartZ = WB * 0.25; // just behind engine/gearbox
  const dsEndZ = -WB / 2; // rear diff center
  const dsMidZ = (dsStartZ + dsEndZ) / 2;
  const dsLen = dsStartZ - dsEndZ;
  const dsGeo = new THREE.CylinderGeometry(0.12, 0.12, dsLen, 8);

  // Wrap in a group positioned at its center so we can spin it around Z (its length axis)
  const dsGroup = new THREE.Group();
  dsGroup.position.set(0, axleY, dsMidZ);
  const dsMesh = new THREE.Mesh(dsGeo, matAxle);
  dsMesh.rotation.x = Math.PI / 2; // orient cylinder along Z
  dsGroup.add(dsMesh);
  driveshaftMesh = dsGroup;
  carRoot.add(dsGroup);

  // U-joint hints at each end of driveshaft
  const ujGeo = new THREE.SphereGeometry(0.22, 8, 6);
  const ujFront = new THREE.Mesh(ujGeo, matAxle);
  ujFront.position.set(0, axleY, dsStartZ);
  carRoot.add(ujFront);
  const ujRear = new THREE.Mesh(ujGeo, matAxle);
  ujRear.position.set(0, axleY, dsEndZ);
  carRoot.add(ujRear);

  // ── Exhaust pipe ──
  const exhGeo = new THREE.CylinderGeometry(0.18, 0.22, CL * 0.55, 8);
  const matExh = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.6,
    metalness: 0.5,
  });
  const exhaust = new THREE.Mesh(exhGeo, matExh);
  exhaust.position.set(CW * 0.35, axleY - 0.2, -CL * 0.1);
  exhaust.rotation.x = Math.PI / 2;
  carRoot.add(exhaust);

  // ── Scale engine to fit inside the engine bay ──
  // Measure engine at scale 1
  engineRoot.scale.set(1, 1, 1);
  engineRoot.updateMatrixWorld(true);
  const engBox = new THREE.Box3().setFromObject(engineRoot);
  const engSize = new THREE.Vector3();
  engBox.getSize(engSize);

  // Engine bay available space
  const bayH = CH * 0.95; // nearly full body height
  const bayW = CW * 0.7; // leave room for fenders
  const bayL = CL * 0.38; // front ~38% of chassis

  // Uniform scale to fit
  const es = Math.min(
    bayH / Math.max(engSize.y, 0.01),
    bayW / Math.max(engSize.x, 0.01),
    bayL / Math.max(engSize.z, 0.01)
  );
  engineRoot.scale.set(es, es, es);

  // Position engine: bottom sits on floor pan, toward front of car
  const floorY = chassisY - CH * 0.5 + 0.15;
  const enginePosY = floorY - engBox.min.y * es;
  const enginePosZ = WB * 0.3; // forward of center (engine bay area)
  engineLocalY = enginePosY;
  engineLocalZ = enginePosZ;
  engineRoot.position.set(0, enginePosY, enginePosZ);
}
buildCar();

// Vehicle physics state
let carPosX = 0; // world position (lateral)
let carPosZ = 0; // world position (forward)
let carHeading = 0; // radians, 0 = +Z direction
let carVelX = 0; // world velocity (lateral)
let carVelZ = 0; // world velocity (forward)
let carSpeed = 0; // m/s (magnitude of velocity)
let wheelSpinAngle = 0; // cumulative wheel rotation (radians)
let steerAngle = 0; // current front-wheel steer angle (radians)
let steerInput = 0; // -1 (left), 0, +1 (right)
let braking = false;

let engineState = 'off'; // off | cranking | running | stopping
let theta = 0,
  omega = 0,
  throttle = 0,
  starterHeld = false;

function rpmToOmega(r) {
  return (r * Math.PI * 2) / 60;
}
function omegaToRpm(w) {
  return (w * 60) / (Math.PI * 2);
}

function torqueCurve(rpm) {
  const x = rpm / CFG.peakRpm;
  const w = CFG.torqueCurveWidth;
  return CFG.maxTorque * Math.max(0, 1 - ((x - 1) / w) ** 2);
}
function frictionTorque(w) {
  return CFG.frictionA + CFG.frictionB * Math.abs(w) + CFG.frictionC * w * w;
}

function vehicleStep(dt) {
  if (!CFG.showCar) return;
  const driveRatio = CFG.gearRatio * CFG.finalDrive;
  const WR = CFG.wheelRadius;
  const WB = CFG.wheelbase;

  // ── Steering ──
  // Smoothly move steerAngle toward target based on input
  if (steerInput !== 0) {
    steerAngle += steerInput * CFG.steerSpeed * dt;
    steerAngle = Math.max(
      -CFG.maxSteerAngle,
      Math.min(CFG.maxSteerAngle, steerAngle)
    );
  } else {
    // Self-centering: return to 0
    if (Math.abs(steerAngle) < 0.01) {
      steerAngle = 0;
    } else {
      steerAngle -=
        Math.sign(steerAngle) *
        Math.min(CFG.steerReturnSpeed * dt, Math.abs(steerAngle));
    }
  }

  // ── Longitudinal forces (same as before) ──
  const torqueScale = 20;
  const rpm = omegaToRpm(omega);
  let wheelTorque = 0;
  if (engineState === 'running') {
    const Tengine = torqueCurve(rpm) * Math.max(throttle, 0.08) * torqueScale;
    wheelTorque = Tengine * driveRatio * 0.85;
  } else if (engineState === 'cranking') {
    const Tengine = CFG.starterTorque * 0.3 * torqueScale;
    wheelTorque = Tengine * driveRatio * 0.5;
  }

  const driveForce = wheelTorque / WR;
  const normalForce = CFG.carMass * 9.81;
  const rearNormal = normalForce * 0.55;
  const maxTraction = rearNormal * CFG.tireGrip;
  const tractionForce = Math.min(driveForce, maxTraction);

  const rollingR = CFG.rollingResistance * normalForce;
  const aeroDragF = 0.5 * 1.225 * CFG.aeroDrag * carSpeed * carSpeed;
  const brakeF = braking ? CFG.brakeTorque / WR : 0;

  let resistForce = rollingR + aeroDragF + brakeF;
  if (carSpeed < 0.1) {
    resistForce = Math.min(resistForce, Math.max(0, tractionForce - 0.1));
  }

  const netForce = tractionForce - resistForce;
  const accel = netForce / CFG.carMass;

  // Forward direction from heading
  const fwdX = Math.sin(carHeading);
  const fwdZ = Math.cos(carHeading);

  // Apply longitudinal acceleration along heading
  carVelX += fwdX * accel * dt;
  carVelZ += fwdZ * accel * dt;

  // Lateral friction: damp sideways velocity (reduces sliding)
  // Lateral direction is perpendicular to forward
  const latX = -fwdZ;
  const latZ = fwdX;
  const lateralVel = carVelX * latX + carVelZ * latZ;
  const lateralDamp = Math.min(1, CFG.tireGrip * 6) * 6; // tunable stiffness
  const lateralAccel = -lateralVel * lateralDamp;
  carVelX += latX * lateralAccel * dt;
  carVelZ += latZ * lateralAccel * dt;

  carSpeed = Math.hypot(carVelX, carVelZ);

  // ── Bicycle model: heading update ──
  // Turning radius = wheelbase / tan(steerAngle)
  if (Math.abs(steerAngle) > 0.001 && carSpeed > 0.05) {
    const yawRate = (carSpeed / WB) * Math.tan(steerAngle); // rad/s
    carHeading += yawRate * dt;
  }

  // Move car along its heading direction
  carPosX += carVelX * dt;
  carPosZ += carVelZ * dt;

  // Wheel spin from ground contact (no-slip)
  const wheelOmega = carSpeed / WR;
  wheelSpinAngle += wheelOmega * dt;
}

function updateCarWheels() {
  if (!CFG.showCar || wheelMeshes.length < 4) return;

  // All 4 wheels: spin the inner spinGrp (child 0) around X (the left-right axle)
  for (let i = 0; i < 4; i++) {
    const spin = wheelMeshes[i].children[0];
    if (spin) spin.rotation.x = wheelSpinAngle;
  }

  // Visually steer front wheel groups (indices 0, 1) by rotating on Y
  wheelMeshes[0].rotation.y = steerAngle;
  wheelMeshes[1].rotation.y = steerAngle;

  // Driveshaft: the cylinder inside dsGroup is oriented along Z (rotation.x=PI/2).
  // Spinning the group around Z rotates the shaft around its own length axis.
  // Use wheelSpinAngle × finalDrive for smooth continuous rotation (no theta-wrap jumps).
  if (driveshaftMesh) {
    driveshaftMesh.rotation.z = wheelSpinAngle * CFG.finalDrive;
  }

  // Rear axle group: the mesh inside has rotation.z = PI/2 → cylinder along X.
  // Rotating the group around X spins the axle around its own length axis.
  if (rearAxleGrp) {
    rearAxleGrp.rotation.x = wheelSpinAngle;
  }
}

const FIXED_DT = 1 / 240;
let accumulator = 0;

function engineStep(dt) {
  const rpm = omegaToRpm(omega);
  let Tnet = 0;

  if (engineState === 'cranking') {
    if (starterHeld && rpm < CFG.starterMaxRpm) {
      // Starter torque + realistic uneven compression bumps
      const comprBump =
        CFG.compressionDrag *
        CFG.cylinders *
        (0.5 + 0.5 * Math.sin(theta * CFG.cylinders));
      Tnet += CFG.starterTorque - comprBump;
    }
    if (rpm > 100 && Math.random() < CFG.crankToFireChance) {
      engineState = 'running';
      starterHeld = false;
      onEngineCatch();
    }
    Tnet -= frictionTorque(omega);
  }

  if (engineState === 'running') {
    const Tbase = torqueCurve(rpm);
    const eff = Math.max(throttle, 0.05);
    Tnet += Tbase * eff;
    if (throttle < 0.1) {
      Tnet += CFG.idleStrength * (rpmToOmega(CFG.idleTargetRpm) - omega);
    }
    if (rpm > CFG.redlineRpm) Tnet -= Tbase * eff;
    Tnet -= frictionTorque(omega);
  }

  if (engineState === 'stopping') {
    // Compression-braking: sinusoidal resistance from each cylinder
    const comprBrake =
      CFG.compressionDrag *
      CFG.cylinders *
      (0.6 + 0.4 * Math.abs(Math.sin((theta * CFG.cylinders) / 2)));
    Tnet -= frictionTorque(omega) + comprBrake;
    if (omega < 0.3) {
      omega = 0;
      engineState = 'off';
      onEngineFullStop();
      return;
    }
  }

  const alpha = Tnet / CFG.inertia;
  omega = Math.max(0, omega + alpha * dt);
  theta += omega * dt;
  if (theta > Math.PI * 2) theta -= Math.PI * 2;
}

/* ═══════════════════════════════════════════════════════════════
   AUDIO — realistic layered engine sound
   ═══════════════════════════════════════════════════════════════ */
let audioCtx = null,
  audioReady = false;
let masterGain;
// Layers
let idleOsc, idleGain, idleFilter;
let combustionOscs = [],
  combustionGains = [];
let exhaustNoise, exhaustGain, exhaustFilter;
let crankleNoise, crankleGain, crankleFilter;
// Starter: multi-layer with compression-envelope AM
let starterNoiseNode, starterNoiseGain, starterNoiseFilter;
let starterBumpNode, starterBumpGain, starterBumpFilter;
let starterGearOsc, starterGearGain;
let starterSubOsc, starterSubGain;
let starterWaveshaper, starterClickBuffer;
let popBuffer;

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = CFG.masterVolume;
  masterGain.connect(audioCtx.destination);

  // Shared noise
  const bufLen = audioCtx.sampleRate * 2;
  const noiseBuf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
  const nd = noiseBuf.getChannelData(0);
  for (let j = 0; j < bufLen; j++) nd[j] = Math.random() * 2 - 1;

  // Pop buffer
  const popLen = Math.floor(audioCtx.sampleRate * 0.08);
  popBuffer = audioCtx.createBuffer(1, popLen, audioCtx.sampleRate);
  const pd = popBuffer.getChannelData(0);
  for (let j = 0; j < popLen; j++)
    pd[j] = (Math.random() * 2 - 1) * Math.exp(-j / (popLen * 0.12));

  // ── STARTER: realistic multi-layer with waveshaper ──
  // Solenoid engage click
  const clickLen = Math.floor(audioCtx.sampleRate * 0.018);
  starterClickBuffer = audioCtx.createBuffer(1, clickLen, audioCtx.sampleRate);
  const ckd = starterClickBuffer.getChannelData(0);
  for (let j = 0; j < clickLen; j++) {
    ckd[j] = (Math.random() * 2 - 1) * Math.exp(-j / (clickLen * 0.05)) * 0.9;
  }

  // Waveshaper — soft-clip distortion for mechanical grit
  starterWaveshaper = audioCtx.createWaveShaper();
  const wsLen = 1024;
  const wsCurve = new Float32Array(wsLen);
  for (let i = 0; i < wsLen; i++) {
    const x = (i * 2) / wsLen - 1;
    wsCurve[i] = Math.tanh(x * 2.8) * 0.85 + x * 0.15;
  }
  starterWaveshaper.curve = wsCurve;
  starterWaveshaper.connect(masterGain);

  // Layer 1: motor whir — bandpass noise tracks RPM
  starterNoiseNode = audioCtx.createBufferSource();
  starterNoiseNode.buffer = noiseBuf;
  starterNoiseNode.loop = true;
  starterNoiseFilter = audioCtx.createBiquadFilter();
  starterNoiseFilter.type = 'bandpass';
  starterNoiseFilter.frequency.value = 150;
  starterNoiseFilter.Q.value = 1.2;
  starterNoiseGain = audioCtx.createGain();
  starterNoiseGain.gain.value = 0;
  starterNoiseNode
    .connect(starterNoiseFilter)
    .connect(starterNoiseGain)
    .connect(starterWaveshaper);
  starterNoiseNode.start();

  // Layer 2: deep compression thumps — lowpass noise (NOT oscillator)
  starterBumpNode = audioCtx.createBufferSource();
  starterBumpNode.buffer = noiseBuf;
  starterBumpNode.loop = true;
  starterBumpFilter = audioCtx.createBiquadFilter();
  starterBumpFilter.type = 'lowpass';
  starterBumpFilter.frequency.value = 55;
  starterBumpFilter.Q.value = 3.5;
  starterBumpGain = audioCtx.createGain();
  starterBumpGain.gain.value = 0;
  starterBumpNode
    .connect(starterBumpFilter)
    .connect(starterBumpGain)
    .connect(starterWaveshaper);
  starterBumpNode.start();

  // Layer 3: gear mesh whine — narrow bandpass sawtooth
  starterGearOsc = audioCtx.createOscillator();
  starterGearOsc.type = 'sawtooth';
  starterGearOsc.frequency.value = 120;
  const gearFilter = audioCtx.createBiquadFilter();
  gearFilter.type = 'bandpass';
  gearFilter.frequency.value = 200;
  gearFilter.Q.value = 2.5;
  starterGearGain = audioCtx.createGain();
  starterGearGain.gain.value = 0;
  starterGearOsc
    .connect(gearFilter)
    .connect(starterGearGain)
    .connect(starterWaveshaper);
  starterGearOsc.start();

  // Layer 4: sub-bass body resonance
  starterSubOsc = audioCtx.createOscillator();
  starterSubOsc.type = 'sine';
  starterSubOsc.frequency.value = 32;
  starterSubGain = audioCtx.createGain();
  starterSubGain.gain.value = 0;
  starterSubOsc.connect(starterSubGain).connect(masterGain);
  starterSubOsc.start();

  // ── Idle rumble ──
  idleOsc = audioCtx.createOscillator();
  idleOsc.type = 'sawtooth';
  idleOsc.frequency.value = 20;
  idleFilter = audioCtx.createBiquadFilter();
  idleFilter.type = 'lowpass';
  idleFilter.frequency.value = 80;
  idleGain = audioCtx.createGain();
  idleGain.gain.value = 0;
  idleOsc.connect(idleFilter).connect(idleGain).connect(masterGain);
  idleOsc.start();

  // ── Per-cylinder combustion ──
  for (let i = 0; i < CFG.cylinders; i++) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 55;
    const filt = audioCtx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 200;
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(filt).connect(gain).connect(masterGain);
    osc.start();
    combustionOscs.push(osc);
    combustionGains.push(gain);
  }

  // ── Exhaust noise ──
  exhaustNoise = audioCtx.createBufferSource();
  exhaustNoise.buffer = noiseBuf;
  exhaustNoise.loop = true;
  exhaustFilter = audioCtx.createBiquadFilter();
  exhaustFilter.type = 'bandpass';
  exhaustFilter.frequency.value = CFG.exhaustBassFreq;
  exhaustFilter.Q.value = CFG.exhaustResonance;
  exhaustGain = audioCtx.createGain();
  exhaustGain.gain.value = 0;
  exhaustNoise.connect(exhaustFilter).connect(exhaustGain).connect(masterGain);
  exhaustNoise.start();

  // ── Mechanical clatter ──
  crankleNoise = audioCtx.createBufferSource();
  crankleNoise.buffer = noiseBuf;
  crankleNoise.loop = true;
  crankleFilter = audioCtx.createBiquadFilter();
  crankleFilter.type = 'bandpass';
  crankleFilter.frequency.value = 800;
  crankleFilter.Q.value = 2;
  crankleGain = audioCtx.createGain();
  crankleGain.gain.value = 0;
  crankleNoise.connect(crankleFilter).connect(crankleGain).connect(masterGain);
  crankleNoise.start();

  audioReady = true;
}

function playPop(vol) {
  if (!audioReady) return;
  const src = audioCtx.createBufferSource();
  src.buffer = popBuffer;
  const g = audioCtx.createGain();
  g.gain.value = vol;
  const f = audioCtx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 300 + Math.random() * 400;
  src.connect(f).connect(g).connect(masterGain);
  src.start();
}

function playStarterClick() {
  if (!audioReady || !starterClickBuffer) return;
  const src = audioCtx.createBufferSource();
  src.buffer = starterClickBuffer;
  const g = audioCtx.createGain();
  g.gain.value = 0.65;
  const hp = audioCtx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 300;
  src.connect(hp).connect(g).connect(masterGain);
  src.start();
}

function updateAudio(rpm, th) {
  if (!audioReady) return;
  const t = audioCtx.currentTime;
  const rpmNorm = Math.min(rpm / Math.max(1, CFG.redlineRpm), 1);
  const firingHz = Math.max(12, (rpm / 60) * (CFG.cylinders / 2));
  const cranking = engineState === 'cranking';
  const alive = engineState === 'running' || engineState === 'stopping';
  const phaseOffsets = computePhaseOffsets();

  // ── STARTER — crank-angle compression-envelope AM ──
  // Compute real compression resistance from piston positions
  let comprEnv = 0;
  if (cranking) {
    for (let i = 0; i < phaseOffsets.length; i++) {
      let cylA = (phaseOffsets[i] + th) % (Math.PI * 2);
      if (cylA < 0) cylA += Math.PI * 2;
      const dTDC = Math.min(cylA, Math.PI * 2 - cylA);
      comprEnv += Math.exp(-dTDC * dTDC * 4); // sharp peak at each TDC
    }
    comprEnv /= Math.max(1, phaseOffsets.length);
  }
  const sFade = cranking ? 1 : 0;

  // Layer 1: motor whir — continuous, low-mid rumble modulated by compression
  starterNoiseFilter.frequency.setTargetAtTime(100 + rpm * 0.4, t, 0.015);
  starterNoiseFilter.Q.setTargetAtTime(1.0 + comprEnv * 1.5, t, 0.01);
  starterNoiseGain.gain.setTargetAtTime(
    sFade * (0.04 + 0.06 * comprEnv),
    t,
    0.008
  );

  // Layer 2: deep compression thumps — heavy low-end at TDC
  starterBumpFilter.frequency.setTargetAtTime(28 + rpm * 0.06, t, 0.015);
  starterBumpFilter.Q.setTargetAtTime(2.5 + comprEnv * 3, t, 0.01);
  starterBumpGain.gain.setTargetAtTime(
    sFade * (0.05 + 0.22 * comprEnv),
    t,
    0.005
  );

  // Layer 3: subtle gear mesh — low frequency
  starterGearOsc.frequency.setTargetAtTime(65 + rpm * 0.3, t, 0.015);
  starterGearGain.gain.setTargetAtTime(sFade * 0.015, t, 0.02);

  // Layer 4: sub-bass body resonance — the felt thump
  starterSubOsc.frequency.setTargetAtTime(22 + rpm * 0.03, t, 0.03);
  starterSubGain.gain.setTargetAtTime(
    sFade * (0.06 + 0.16 * comprEnv),
    t,
    0.008
  );

  // ── Idle / running rumble ──
  idleOsc.frequency.setTargetAtTime(firingHz, t, 0.03);
  idleGain.gain.setTargetAtTime(alive ? 0.06 + 0.06 * rpmNorm : 0, t, 0.06);
  idleFilter.frequency.setTargetAtTime(80 + rpmNorm * 350, t, 0.05);

  // ── Per-cylinder combustion pulses ──
  const pw = CFG.combustionPulseWidth;
  const cVol = CFG.combustionVolume;
  for (let i = 0; i < combustionOscs.length; i++) {
    if (i >= phaseOffsets.length) {
      combustionGains[i].gain.setTargetAtTime(0, t, 0.02);
      continue;
    }
    let local = (phaseOffsets[i] + th) % (Math.PI * 2);
    if (local < 0) local += Math.PI * 2;
    const dist = Math.min(local, Math.PI * 2 - local);
    const pulse = Math.exp(-dist * dist * pw);
    const vol = alive ? pulse * 0.22 * cVol * Math.min(rpm / 500, 1) : 0;
    combustionOscs[i].frequency.setTargetAtTime(firingHz * 0.5, t, 0.02);
    combustionGains[i].gain.setTargetAtTime(vol, t, 0.005);
  }

  // ── Exhaust ──
  const eVol = alive ? 0.03 + rpmNorm * 0.14 : cranking ? 0.01 : 0;
  exhaustFilter.frequency.setTargetAtTime(
    CFG.exhaustBassFreq + rpmNorm * 500,
    t,
    0.05
  );
  exhaustFilter.Q.setTargetAtTime(CFG.exhaustResonance, t, 0.1);
  exhaustGain.gain.setTargetAtTime(eVol, t, 0.06);

  // ── Mechanical clatter ──
  const mVol = CFG.mechanicalVolume;
  const cVl = rpm > 15 ? (0.01 + rpmNorm * 0.05) * mVol : 0;
  crankleFilter.frequency.setTargetAtTime(500 + rpmNorm * 2500, t, 0.05);
  crankleGain.gain.setTargetAtTime(cVl, t, 0.05);
}

function onEngineCatch() {
  playPop(0.5);
  setTimeout(() => playPop(0.3), 50);
  setTimeout(() => playPop(0.15), 110);
}
function onEngineShutdown() {
  let d = 0;
  for (let i = 0, n = 3 + Math.floor(Math.random() * 3); i < n; i++) {
    d += 100 + Math.random() * 300;
    setTimeout(() => playPop(0.25 * (1 - i / n)), d);
  }
}
function onEngineFullStop() {
  playPop(0.08);
}

/* ═══════════════════════════════════════════════════════════════
   UI – INFO BAR
   ═══════════════════════════════════════════════════════════════ */
const infoEl = document.getElementById('info');
// ── Speedometer HUD (only visible in car mode) ──
const speedoDiv = document.createElement('div');
speedoDiv.id = 'speedometer';
speedoDiv.innerHTML = `
  <div class="speedo-mph">0</div>
  <div class="speedo-label">MPH</div>
  <div class="speedo-rpm">0 RPM</div>
  <div class="speedo-gear">GEAR 1</div>
`;
document.body.appendChild(speedoDiv);

function updateInfoText() {
  const rpm = Math.round(omegaToRpm(omega));
  const thr = Math.round(throttle * 100);
  const st = {
    off: 'OFF',
    cranking: 'CRANKING…',
    running: `${rpm} RPM`,
    stopping: 'STOPPING…',
  }[engineState];
  if (CFG.showCar) {
    const mph = (carSpeed * 2.237).toFixed(0);
    infoEl.textContent = `${st}  ·  Throttle ${thr}%  ·  ←→ / AD = steer  ·  B = brake  ·  SPACE = crank/stop  ·  ↑↓ = throttle`;
    // Update speedometer
    speedoDiv.style.display = 'block';
    speedoDiv.querySelector('.speedo-mph').textContent = mph;
    speedoDiv.querySelector('.speedo-rpm').textContent = `${rpm} RPM`;
  } else {
    infoEl.textContent = `${st}  ·  Throttle ${thr}%  ·  SPACE = crank/stop  ·  ↑↓ = throttle`;
    speedoDiv.style.display = 'none';
  }
}
updateInfoText();

// ── Dust / dirt particle system (kicked up behind rear wheels) ──
const DUST_COUNT = 200;
const dustGeo = new THREE.BufferGeometry();
const dustPositions = new Float32Array(DUST_COUNT * 3);
const dustVelocities = new Float32Array(DUST_COUNT * 3);
const dustLifetimes = new Float32Array(DUST_COUNT);
const dustAges = new Float32Array(DUST_COUNT);
for (let i = 0; i < DUST_COUNT; i++) {
  dustPositions[i * 3] = 0;
  dustPositions[i * 3 + 1] = -100; // hidden below ground
  dustPositions[i * 3 + 2] = 0;
  dustLifetimes[i] = 0;
  dustAges[i] = 999;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dustMat = new THREE.PointsMaterial({
  color: 0x8b7355,
  size: 0.4,
  transparent: true,
  opacity: 0.6,
  depthWrite: false,
  sizeAttenuation: true,
});
const dustParticles = new THREE.Points(dustGeo, dustMat);
dustParticles.visible = false;
scene.add(dustParticles);

let dustEmitIdx = 0;
function emitDust(worldX, worldY, worldZ, heading) {
  // Emit a particle behind the wheel
  const i = dustEmitIdx % DUST_COUNT;
  dustEmitIdx++;
  dustPositions[i * 3] = worldX + (Math.random() - 0.5) * 0.5;
  dustPositions[i * 3 + 1] = worldY + Math.random() * 0.3;
  dustPositions[i * 3 + 2] = worldZ + (Math.random() - 0.5) * 0.5;
  // Velocity: kick backward + upward
  const backX = -Math.sin(heading);
  const backZ = -Math.cos(heading);
  const speed = carSpeed * 0.3 + Math.random() * 1.5;
  dustVelocities[i * 3] = backX * speed + (Math.random() - 0.5) * 1.0;
  dustVelocities[i * 3 + 1] = 1.0 + Math.random() * 2.0;
  dustVelocities[i * 3 + 2] = backZ * speed + (Math.random() - 0.5) * 1.0;
  dustLifetimes[i] = 0.8 + Math.random() * 0.8;
  dustAges[i] = 0;
}

function updateDust(dt) {
  if (!CFG.showCar) {
    dustParticles.visible = false;
    return;
  }
  dustParticles.visible = true;
  const gravity = -6.0;
  for (let i = 0; i < DUST_COUNT; i++) {
    dustAges[i] += dt;
    if (dustAges[i] < dustLifetimes[i]) {
      dustVelocities[i * 3 + 1] += gravity * dt;
      dustPositions[i * 3] += dustVelocities[i * 3] * dt;
      dustPositions[i * 3 + 1] += dustVelocities[i * 3 + 1] * dt;
      dustPositions[i * 3 + 2] += dustVelocities[i * 3 + 2] * dt;
      // Clamp to ground
      if (dustPositions[i * 3 + 1] < 0.05) {
        dustPositions[i * 3 + 1] = 0.05;
        dustVelocities[i * 3 + 1] = 0;
      }
    } else {
      dustPositions[i * 3 + 1] = -100; // hide
    }
  }
  dustGeo.getAttribute('position').needsUpdate = true;
  // Fade opacity based on speed
  dustMat.opacity = Math.min(0.6, carSpeed * 0.04);

  // Emit from rear wheels when moving
  if (carSpeed > 0.5) {
    const WB = CFG.wheelbase;
    const TW = CFG.trackWidth;
    const cosH = Math.cos(carHeading);
    const sinH = Math.sin(carHeading);
    // Rear-left wheel world position
    const rlX = carPosX + cosH * (-TW / 2) + sinH * (-WB / 2);
    const rlZ = carPosZ - sinH * (-TW / 2) + cosH * (-WB / 2);
    // Rear-right wheel world position
    const rrX = carPosX + cosH * (TW / 2) + sinH * (-WB / 2);
    const rrZ = carPosZ - sinH * (TW / 2) + cosH * (-WB / 2);
    // Emit rate proportional to speed
    const emitRate = Math.min(8, carSpeed * 0.5);
    for (let e = 0; e < emitRate; e++) {
      emitDust(rlX, 0.2, rlZ, carHeading);
      emitDust(rrX, 0.2, rrZ, carHeading);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   PRESETS
   ═══════════════════════════════════════════════════════════════ */
const PRESETS = {
  'stock-i4': {
    label: 'Stock Inline-4',
    cylinders: 4,
    layout: 'inline',
    bore: 3.0,
    stroke: 3.4,
    rodLength: 5.5,
    cylinderSpacing: 3.8,
    blockPadding: 1.0,
    flywheelRadius: 3.2,
    flywheelWidth: 0.6,
    inertia: 0.12,
    frictionA: 1.8,
    frictionB: 0.008,
    compressionDrag: 0.4,
    maxTorque: 22,
    peakRpm: 4500,
    torqueCurveWidth: 1.0,
    idleTargetRpm: 800,
    idleStrength: 0.6,
    redlineRpm: 7000,
    starterTorque: 6,
    starterMaxRpm: 350,
    crankToFireChance: 0.012,
    starterGrindFreq: 42,
    exhaustBassFreq: 150,
    exhaustResonance: 1.5,
    mechanicalVolume: 0.5,
    combustionPulseWidth: 4,
    combustionVolume: 0.7,
  },
  'sport-i4': {
    label: 'Sport I4 (High Rev)',
    cylinders: 4,
    layout: 'inline',
    bore: 3.4,
    stroke: 2.9,
    rodLength: 5.0,
    cylinderSpacing: 3.6,
    blockPadding: 0.9,
    flywheelRadius: 2.8,
    flywheelWidth: 0.45,
    inertia: 0.07,
    frictionA: 1.4,
    frictionB: 0.006,
    compressionDrag: 0.3,
    maxTorque: 17,
    peakRpm: 6800,
    torqueCurveWidth: 1.3,
    idleTargetRpm: 950,
    idleStrength: 0.5,
    redlineRpm: 9200,
    starterTorque: 7,
    starterMaxRpm: 380,
    crankToFireChance: 0.015,
    starterGrindFreq: 50,
    exhaustBassFreq: 220,
    exhaustResonance: 2.2,
    mechanicalVolume: 0.4,
    combustionPulseWidth: 5.5,
    combustionVolume: 0.6,
  },
  'v8-muscle': {
    label: 'V8 Muscle Car',
    cylinders: 8,
    layout: 'v',
    bankAngle: 90,
    bore: 4.0,
    stroke: 3.5,
    rodLength: 6.0,
    cylinderSpacing: 4.5,
    blockPadding: 1.2,
    flywheelRadius: 4.0,
    flywheelWidth: 0.8,
    inertia: 0.28,
    frictionA: 2.5,
    frictionB: 0.01,
    compressionDrag: 0.5,
    maxTorque: 48,
    peakRpm: 4200,
    torqueCurveWidth: 0.9,
    idleTargetRpm: 650,
    idleStrength: 0.55,
    redlineRpm: 6200,
    starterTorque: 9,
    starterMaxRpm: 260,
    crankToFireChance: 0.01,
    starterGrindFreq: 34,
    exhaustBassFreq: 95,
    exhaustResonance: 1.1,
    mechanicalVolume: 0.65,
    combustionPulseWidth: 2.8,
    combustionVolume: 0.85,
  },
  'diesel-i6': {
    label: 'Diesel Truck I6',
    cylinders: 6,
    layout: 'inline',
    bore: 4.2,
    stroke: 5.0,
    rodLength: 8.5,
    cylinderSpacing: 4.5,
    blockPadding: 1.4,
    flywheelRadius: 4.5,
    flywheelWidth: 1.0,
    inertia: 0.5,
    frictionA: 3.2,
    frictionB: 0.012,
    compressionDrag: 1.3,
    maxTorque: 58,
    peakRpm: 2600,
    torqueCurveWidth: 0.75,
    idleTargetRpm: 600,
    idleStrength: 0.7,
    redlineRpm: 3500,
    starterTorque: 14,
    starterMaxRpm: 180,
    crankToFireChance: 0.006,
    starterGrindFreq: 28,
    exhaustBassFreq: 70,
    exhaustResonance: 0.8,
    mechanicalVolume: 0.75,
    combustionPulseWidth: 2.0,
    combustionVolume: 0.95,
  },
  'exotic-v12': {
    label: 'V12 Exotic',
    cylinders: 12,
    layout: 'v',
    bankAngle: 65,
    bore: 2.8,
    stroke: 2.5,
    rodLength: 4.6,
    cylinderSpacing: 3.0,
    blockPadding: 0.8,
    flywheelRadius: 2.6,
    flywheelWidth: 0.35,
    inertia: 0.06,
    frictionA: 1.2,
    frictionB: 0.005,
    compressionDrag: 0.2,
    maxTorque: 14,
    peakRpm: 7200,
    torqueCurveWidth: 1.3,
    idleTargetRpm: 1000,
    idleStrength: 0.45,
    redlineRpm: 9500,
    starterTorque: 5,
    starterMaxRpm: 420,
    crankToFireChance: 0.018,
    starterGrindFreq: 56,
    exhaustBassFreq: 260,
    exhaustResonance: 2.6,
    mechanicalVolume: 0.35,
    combustionPulseWidth: 6.5,
    combustionVolume: 0.55,
  },
  'old-beater': {
    label: 'Old Beater I4',
    cylinders: 4,
    layout: 'inline',
    bore: 3.0,
    stroke: 3.4,
    rodLength: 5.5,
    cylinderSpacing: 3.8,
    blockPadding: 1.0,
    flywheelRadius: 3.2,
    flywheelWidth: 0.7,
    inertia: 0.16,
    frictionA: 2.8,
    frictionB: 0.012,
    compressionDrag: 0.65,
    maxTorque: 15,
    peakRpm: 3600,
    torqueCurveWidth: 0.85,
    idleTargetRpm: 700,
    idleStrength: 0.35,
    redlineRpm: 5200,
    starterTorque: 3.5,
    starterMaxRpm: 220,
    crankToFireChance: 0.004,
    starterGrindFreq: 36,
    exhaustBassFreq: 110,
    exhaustResonance: 1.0,
    mechanicalVolume: 0.85,
    combustionPulseWidth: 2.5,
    combustionVolume: 0.8,
  },
  'smooth-i6': {
    label: 'Smooth Inline-6 (Touring)',
    cylinders: 6,
    layout: 'inline',
    bore: 3.3,
    stroke: 3.2,
    rodLength: 5.8,
    cylinderSpacing: 3.6,
    blockPadding: 1.0,
    flywheelRadius: 3.0,
    flywheelWidth: 0.5,
    inertia: 0.14,
    frictionA: 1.6,
    frictionB: 0.007,
    compressionDrag: 0.35,
    maxTorque: 30,
    peakRpm: 5500,
    torqueCurveWidth: 1.15,
    idleTargetRpm: 750,
    idleStrength: 0.55,
    redlineRpm: 7200,
    starterTorque: 6.5,
    starterMaxRpm: 340,
    crankToFireChance: 0.014,
    starterGrindFreq: 44,
    exhaustBassFreq: 170,
    exhaustResonance: 1.8,
    mechanicalVolume: 0.38,
    combustionPulseWidth: 4.8,
    combustionVolume: 0.62,
  },
  'flat4-boxer': {
    label: 'Flat-4 Boxer',
    cylinders: 4,
    layout: 'v',
    bankAngle: 180,
    bore: 3.6,
    stroke: 2.8,
    rodLength: 5.0,
    cylinderSpacing: 4.2,
    blockPadding: 1.1,
    flywheelRadius: 3.0,
    flywheelWidth: 0.5,
    inertia: 0.1,
    frictionA: 1.7,
    frictionB: 0.008,
    compressionDrag: 0.38,
    maxTorque: 21,
    peakRpm: 5200,
    torqueCurveWidth: 1.05,
    idleTargetRpm: 800,
    idleStrength: 0.5,
    redlineRpm: 7000,
    starterTorque: 5.5,
    starterMaxRpm: 320,
    crankToFireChance: 0.012,
    starterGrindFreq: 44,
    exhaustBassFreq: 130,
    exhaustResonance: 1.5,
    mechanicalVolume: 0.5,
    combustionPulseWidth: 3.8,
    combustionVolume: 0.7,
  },
};

let currentPreset = 'stock-i4';

function applyPreset(name) {
  const p = PRESETS[name];
  if (!p) return;
  currentPreset = name;
  Object.keys(p).forEach((k) => {
    if (k === 'label') return;
    CFG[k] = p[k];
  });
  needsRebuild = true;
  buildDrawer();
}

/* ═══════════════════════════════════════════════════════════════
   UI – ACCORDION SETTINGS DRAWER
   ═══════════════════════════════════════════════════════════════ */
function buildDrawer() {
  const drawer = document.getElementById('settings-drawer');
  const content = document.getElementById('drawer-content');
  content.innerHTML = '';

  document.getElementById('settings-toggle').onclick = () =>
    drawer.classList.toggle('open');

  // Rebuild flag — certain keys need mesh rebuild
  const rebuildKeys = new Set([
    'layout',
    'bankAngle',
    'cylinders',
    'bore',
    'stroke',
    'rodLength',
    'cylinderSpacing',
    'blockPadding',
    'flywheelRadius',
    'flywheelWidth',
    'showCar',
    'wheelRadius',
    'tireWidth',
    'wheelbase',
    'trackWidth',
    'chassisLength',
    'chassisWidth',
    'chassisHeight',
  ]);

  const sections = [
    {
      title: '🔧 Layout & Cylinders',
      open: true,
      items: [
        {
          label: 'Layout',
          key: 'layout',
          type: 'select',
          options: ['inline', 'v'],
        },
        {
          label: 'V-Bank Angle',
          key: 'bankAngle',
          min: 15,
          max: 180,
          step: 5,
          unit: '°',
          showIf: () => CFG.layout === 'v',
        },
        {
          label: 'Cylinders',
          key: 'cylinders',
          min: 1,
          max: 12,
          step: 1,
          unit: 'cyl',
        },
      ],
    },
    {
      title: '⬛ Engine Block',
      items: [
        { label: 'Bore', key: 'bore', min: 0.5, max: 8, step: 0.1, unit: 'm' },
        {
          label: 'Stroke',
          key: 'stroke',
          min: 0.5,
          max: 10,
          step: 0.1,
          unit: 'm',
        },
        {
          label: 'Rod Length',
          key: 'rodLength',
          min: 1,
          max: 16,
          step: 0.1,
          unit: 'm',
        },
        {
          label: 'Cyl Spacing',
          key: 'cylinderSpacing',
          min: 1,
          max: 8,
          step: 0.1,
          unit: 'm',
        },
        {
          label: 'Block Padding',
          key: 'blockPadding',
          min: 0.2,
          max: 4,
          step: 0.1,
          unit: 'm',
        },
        { label: 'Block Color', key: 'blockColor', type: 'color' },
        {
          label: 'Block Opacity',
          key: 'blockOpacity',
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          label: 'Block Roughness',
          key: 'blockRoughness',
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          label: 'Block Metalness',
          key: 'blockMetalness',
          min: 0,
          max: 1,
          step: 0.01,
        },
      ],
    },
    {
      title: '🔩 Crankshaft',
      items: [
        { label: 'Color', key: 'crankColor', type: 'color' },
        {
          label: 'Roughness',
          key: 'crankRoughness',
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          label: 'Metalness',
          key: 'crankMetalness',
          min: 0,
          max: 1,
          step: 0.01,
        },
      ],
    },
    {
      title: '🔶 Connecting Rods',
      items: [
        { label: 'Color', key: 'rodColor', type: 'color' },
        { label: 'Roughness', key: 'rodRoughness', min: 0, max: 1, step: 0.01 },
        { label: 'Metalness', key: 'rodMetalness', min: 0, max: 1, step: 0.01 },
      ],
    },
    {
      title: '⚪ Pistons',
      items: [
        { label: 'Color', key: 'pistonColor', type: 'color' },
        {
          label: 'Roughness',
          key: 'pistonRoughness',
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          label: 'Metalness',
          key: 'pistonMetalness',
          min: 0,
          max: 1,
          step: 0.01,
        },
      ],
    },
    {
      title: '🔵 Cylinder Sleeves',
      items: [
        { label: 'Color', key: 'sleeveColor', type: 'color' },
        { label: 'Opacity', key: 'sleeveOpacity', min: 0, max: 1, step: 0.01 },
      ],
    },
    {
      title: '⚫ Flywheel',
      items: [
        { label: 'Color', key: 'flywheelColor', type: 'color' },
        {
          label: 'Radius',
          key: 'flywheelRadius',
          min: 1,
          max: 8,
          step: 0.1,
          unit: 'm',
        },
        {
          label: 'Width',
          key: 'flywheelWidth',
          min: 0.1,
          max: 3,
          step: 0.1,
          unit: 'm',
        },
      ],
    },
    {
      title: '📌 Pins',
      items: [{ label: 'Color', key: 'pinColor', type: 'color' }],
    },
    {
      title: '⚙ Dynamics',
      items: [
        {
          label: 'Inertia',
          key: 'inertia',
          min: 0.01,
          max: 2,
          step: 0.01,
          unit: 'kg·m²',
        },
        {
          label: 'Friction (const)',
          key: 'frictionA',
          min: 0,
          max: 5,
          step: 0.1,
          unit: 'Nm',
        },
        {
          label: 'Friction (visc)',
          key: 'frictionB',
          min: 0,
          max: 0.05,
          step: 0.001,
        },
        {
          label: 'Friction (aero)',
          key: 'frictionC',
          min: 0,
          max: 0.00005,
          step: 0.000001,
        },
        {
          label: 'Compression Drag',
          key: 'compressionDrag',
          min: 0,
          max: 3,
          step: 0.05,
        },
      ],
    },
    {
      title: '🔥 Torque & Combustion',
      items: [
        {
          label: 'Max Torque',
          key: 'maxTorque',
          min: 5,
          max: 100,
          step: 1,
          unit: 'Nm',
        },
        { label: 'Peak RPM', key: 'peakRpm', min: 1000, max: 12000, step: 100 },
        {
          label: 'Curve Width',
          key: 'torqueCurveWidth',
          min: 0.3,
          max: 3,
          step: 0.05,
        },
        {
          label: 'Idle Target RPM',
          key: 'idleTargetRpm',
          min: 200,
          max: 2000,
          step: 50,
        },
        {
          label: 'Idle Strength',
          key: 'idleStrength',
          min: 0.05,
          max: 3,
          step: 0.05,
        },
        {
          label: 'Redline RPM',
          key: 'redlineRpm',
          min: 2000,
          max: 15000,
          step: 100,
        },
      ],
    },
    {
      title: '🔑 Starter',
      items: [
        {
          label: 'Starter Torque',
          key: 'starterTorque',
          min: 1,
          max: 20,
          step: 0.5,
          unit: 'Nm',
        },
        {
          label: 'Starter Max RPM',
          key: 'starterMaxRpm',
          min: 50,
          max: 800,
          step: 10,
        },
        {
          label: 'Catch Chance',
          key: 'crankToFireChance',
          min: 0.001,
          max: 0.08,
          step: 0.001,
          unit: '/step',
        },
        {
          label: 'Grind Base Hz',
          key: 'starterGrindFreq',
          min: 15,
          max: 120,
          step: 1,
          unit: 'Hz',
        },
      ],
    },
    {
      title: '🔊 Audio',
      items: [
        {
          label: 'Master Volume',
          key: 'masterVolume',
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          label: 'Exhaust Resonance',
          key: 'exhaustResonance',
          min: 0.3,
          max: 6,
          step: 0.1,
        },
        {
          label: 'Exhaust Bass Hz',
          key: 'exhaustBassFreq',
          min: 50,
          max: 500,
          step: 5,
          unit: 'Hz',
        },
        {
          label: 'Mechanical Vol',
          key: 'mechanicalVolume',
          min: 0,
          max: 1,
          step: 0.01,
        },
        {
          label: 'Combustion Pulse',
          key: 'combustionPulseWidth',
          min: 1,
          max: 12,
          step: 0.5,
        },
        {
          label: 'Combustion Vol',
          key: 'combustionVolume',
          min: 0,
          max: 1,
          step: 0.01,
        },
      ],
    },
    {
      title: '🚗 Car & Drivetrain',
      open: true,
      items: [
        { label: 'Show Car', key: 'showCar', type: 'toggle' },
        { label: 'Gear Ratio', key: 'gearRatio', min: 0.5, max: 8, step: 0.1 },
        {
          label: 'Final Drive',
          key: 'finalDrive',
          min: 1.0,
          max: 6,
          step: 0.1,
        },
        {
          label: 'Car Mass',
          key: 'carMass',
          min: 500,
          max: 4000,
          step: 50,
          unit: 'kg',
        },
        {
          label: 'Tire Grip (μ)',
          key: 'tireGrip',
          min: 0.2,
          max: 2.0,
          step: 0.05,
        },
        {
          label: 'Rolling Resist',
          key: 'rollingResistance',
          min: 0.005,
          max: 0.05,
          step: 0.001,
        },
        { label: 'Aero Drag', key: 'aeroDrag', min: 0.1, max: 1.5, step: 0.05 },
        {
          label: 'Brake Torque',
          key: 'brakeTorque',
          min: 500,
          max: 8000,
          step: 100,
          unit: 'Nm',
        },
        {
          label: 'Wheel Radius',
          key: 'wheelRadius',
          min: 0.5,
          max: 4,
          step: 0.1,
          unit: 'm',
        },
        {
          label: 'Tire Width',
          key: 'tireWidth',
          min: 0.3,
          max: 3,
          step: 0.1,
          unit: 'm',
        },
        {
          label: 'Wheelbase',
          key: 'wheelbase',
          min: 4,
          max: 20,
          step: 0.5,
          unit: 'm',
        },
        {
          label: 'Track Width',
          key: 'trackWidth',
          min: 3,
          max: 12,
          step: 0.5,
          unit: 'm',
        },
        {
          label: 'Chassis Len',
          key: 'chassisLength',
          min: 6,
          max: 25,
          step: 0.5,
          unit: 'm',
        },
        {
          label: 'Chassis Width',
          key: 'chassisWidth',
          min: 3,
          max: 12,
          step: 0.5,
          unit: 'm',
        },
        {
          label: 'Chassis Height',
          key: 'chassisHeight',
          min: 1,
          max: 6,
          step: 0.1,
          unit: 'm',
        },
        { label: 'Chassis Color', key: 'chassisColor', type: 'color' },
        {
          label: 'Chassis Opacity',
          key: 'chassisOpacity',
          min: 0,
          max: 1,
          step: 0.01,
        },
        { label: 'Wheel Color', key: 'wheelColor', type: 'color' },
        { label: 'Tire Color', key: 'tireColor', type: 'color' },
      ],
    },
    {
      title: '⚙️ Vehicle Physics',
      open: false,
      items: [
        {
          label: 'Car Mass',
          key: 'carMass',
          min: 400,
          max: 5000,
          step: 50,
          unit: 'kg',
        },
        {
          label: 'Tire Grip (μ)',
          key: 'tireGrip',
          min: 0.1,
          max: 1.5,
          step: 0.05,
        },
        {
          label: 'Rolling Resist',
          key: 'rollingResistance',
          min: 0.005,
          max: 0.05,
          step: 0.001,
        },
        {
          label: 'Aero Drag (Cd×A)',
          key: 'aeroDrag',
          min: 0.1,
          max: 1.5,
          step: 0.01,
        },
        {
          label: 'Brake Torque',
          key: 'brakeTorque',
          min: 500,
          max: 8000,
          step: 100,
          unit: 'Nm',
        },
        {
          label: 'Max Steer Angle',
          key: 'maxSteerAngle',
          min: 0.15,
          max: 0.8,
          step: 0.01,
          unit: 'rad',
        },
      ],
    },
  ];

  const warningsEl = document.createElement('div');
  warningsEl.id = 'drawer-warnings';
  content.appendChild(warningsEl);

  function showWarnings() {
    const w = RULES.validate();
    warningsEl.innerHTML = w
      .map((s) => `<div class="drawer-warning">⚠ ${s}</div>`)
      .join('');
  }

  // ── Preset selector ──
  const presetWrap = document.createElement('div');
  presetWrap.className = 'accordion';
  const presetHdr = document.createElement('div');
  presetHdr.className = 'accordion-header open';
  presetHdr.innerHTML = '<span class="accordion-chevron">▶</span> 🎛 Presets';
  const presetBody = document.createElement('div');
  presetBody.className = 'accordion-body';
  presetBody.style.maxHeight = '2000px';
  presetHdr.addEventListener('click', () => {
    presetHdr.classList.toggle('open');
    presetBody.style.maxHeight = presetHdr.classList.contains('open')
      ? presetBody.scrollHeight + 'px'
      : '0';
  });
  const presetRow = document.createElement('div');
  presetRow.className = 'drawer-row';
  const presetLbl = document.createElement('label');
  presetLbl.textContent = 'Engine Type';
  presetRow.appendChild(presetLbl);
  const presetSel = document.createElement('select');
  presetSel.className = 'drawer-select';
  presetSel.style.gridColumn = 'span 3';
  Object.entries(PRESETS).forEach(([key, p]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = p.label;
    if (key === currentPreset) opt.selected = true;
    presetSel.appendChild(opt);
  });
  presetSel.addEventListener('change', () => applyPreset(presetSel.value));
  presetRow.appendChild(presetSel);
  presetBody.appendChild(presetRow);
  presetWrap.appendChild(presetHdr);
  presetWrap.appendChild(presetBody);
  content.appendChild(presetWrap);

  sections.forEach((sec) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'accordion';

    const header = document.createElement('div');
    header.className = 'accordion-header' + (sec.open ? ' open' : '');
    header.innerHTML = `<span class="accordion-chevron">▶</span> ${sec.title}`;

    const body = document.createElement('div');
    body.className = 'accordion-body';
    if (sec.open) body.style.maxHeight = '2000px';

    header.addEventListener('click', () => {
      header.classList.toggle('open');
      body.style.maxHeight = header.classList.contains('open')
        ? body.scrollHeight + 'px'
        : '0';
    });

    sec.items.forEach((item) => {
      if (item.showIf && !item.showIf()) {
        // Create but hide — re-evaluated on rebuild
      }
      const row = document.createElement('div');
      row.className = 'drawer-row';
      if (item.showIf) row.dataset.conditional = item.key;

      const lbl = document.createElement('label');
      lbl.textContent = item.label;
      row.appendChild(lbl);

      if (item.type === 'select') {
        const sel = document.createElement('select');
        sel.className = 'drawer-select';
        item.options.forEach((o) => {
          const opt = document.createElement('option');
          opt.value = o;
          opt.textContent = o.toUpperCase();
          if (CFG[item.key] === o) opt.selected = true;
          sel.appendChild(opt);
        });
        sel.addEventListener('change', () => {
          CFG[item.key] = sel.value;
          needsRebuild = true;
          showWarnings();
        });
        row.appendChild(sel);
        row.appendChild(document.createElement('span'));
        row.appendChild(document.createElement('span'));
      } else if (item.type === 'toggle') {
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = !!CFG[item.key];
        chk.style.width = '18px';
        chk.style.height = '18px';
        chk.style.accentColor = '#5ae';
        chk.addEventListener('change', () => {
          CFG[item.key] = chk.checked;
          needsRebuild = true;
        });
        row.appendChild(chk);
        row.appendChild(document.createElement('span'));
        row.appendChild(document.createElement('span'));
      } else if (item.type === 'color') {
        const inp = document.createElement('input');
        inp.type = 'color';
        inp.value = CFG[item.key];
        inp.className = 'drawer-color';
        inp.addEventListener('input', () => {
          CFG[item.key] = inp.value;
          needsRebuild = true;
        });
        row.appendChild(inp);
        row.appendChild(document.createElement('span'));
        row.appendChild(document.createElement('span'));
      } else {
        const val = document.createElement('span');
        val.className = 'drawer-val';
        const fmt = (v) =>
          item.step < 0.001
            ? v.toFixed(6)
            : item.step < 0.1
            ? v.toFixed(2)
            : String(v);
        val.textContent = fmt(CFG[item.key]);

        const inp = document.createElement('input');
        inp.type = 'range';
        inp.min = item.min;
        inp.max = item.max;
        inp.step = item.step;
        inp.value = CFG[item.key];
        inp.addEventListener('input', () => {
          let v = parseFloat(inp.value);
          v = RULES.enforce(item.key, v);
          inp.value = v;
          CFG[item.key] = v;
          val.textContent = fmt(v);
          if (rebuildKeys.has(item.key)) needsRebuild = true;
          if (item.key === 'masterVolume' && masterGain)
            masterGain.gain.setTargetAtTime(v, audioCtx.currentTime, 0.05);
          if (item.key === 'blockOpacity' && matBlock) matBlock.opacity = v;
          if (item.key === 'sleeveOpacity' && matSleeve) matSleeve.opacity = v;
          if (item.key === 'chassisOpacity' && matChassis)
            matChassis.opacity = v;
          showWarnings();
        });
        row.appendChild(inp);
        row.appendChild(val);
        const u = document.createElement('span');
        u.className = 'drawer-unit';
        u.textContent = item.unit || '';
        row.appendChild(u);
      }
      body.appendChild(row);
    });

    wrapper.appendChild(header);
    wrapper.appendChild(body);
    content.appendChild(wrapper);
  });

  showWarnings();
}
buildDrawer();

/* ═══════════════════════════════════════════════════════════════
   INPUT
   ═══════════════════════════════════════════════════════════════ */
let needsRebuild = false;

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  if (e.code === 'Space') {
    e.preventDefault();
    if (!audioReady) initAudio();
    if (engineState === 'off') {
      engineState = 'cranking';
      starterHeld = true;
      playStarterClick();
    } else if (engineState === 'running') {
      engineState = 'stopping';
      throttle = 0;
      onEngineShutdown();
    }
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    throttle = Math.min(1, throttle + 0.08);
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    throttle = Math.max(0, throttle - 0.08);
  }
  if (e.key === 'b' || e.key === 'B') {
    braking = true;
  }
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    e.preventDefault();
    steerInput = -1;
  }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    e.preventDefault();
    steerInput = 1;
  }
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    starterHeld = false;
    if (engineState === 'cranking') {
      engineState = 'stopping';
    }
  }
  if (e.key === 'b' || e.key === 'B') {
    braking = false;
  }
  if (
    e.key === 'ArrowLeft' ||
    e.key === 'a' ||
    e.key === 'A' ||
    e.key === 'ArrowRight' ||
    e.key === 'd' ||
    e.key === 'D'
  ) {
    steerInput = 0;
  }
});

// On-screen buttons
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const throttleSlider = document.getElementById('throttle-slider');

btnStart.addEventListener('mousedown', () => {
  if (!audioReady) initAudio();
  if (engineState === 'off') {
    engineState = 'cranking';
    starterHeld = true;
    playStarterClick();
  }
});
btnStart.addEventListener('mouseup', () => {
  starterHeld = false;
  if (engineState === 'cranking') engineState = 'stopping';
});
btnStart.addEventListener('mouseleave', () => {
  starterHeld = false;
  if (engineState === 'cranking') engineState = 'stopping';
});
// Touch support
btnStart.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!audioReady) initAudio();
  if (engineState === 'off') {
    engineState = 'cranking';
    starterHeld = true;
    playStarterClick();
  }
});
btnStart.addEventListener('touchend', () => {
  starterHeld = false;
  if (engineState === 'cranking') engineState = 'stopping';
});
btnStop.addEventListener('click', () => {
  if (engineState === 'running') {
    engineState = 'stopping';
    throttle = 0;
    onEngineShutdown();
  }
});
throttleSlider.addEventListener('input', () => {
  throttle = parseFloat(throttleSlider.value);
});

/* ═══════════════════════════════════════════════════════════════
   KINEMATICS
   ═══════════════════════════════════════════════════════════════ */
function updateKinematics(th) {
  const phaseOffsets = computePhaseOffsets();
  const n = CFG.cylinders;
  const isV = CFG.layout === 'v';
  const cylPerBank = isV ? Math.ceil(n / 2) : n;
  const totalLen = (cylPerBank - 1) * CFG.cylinderSpacing;
  const sZ = -totalLen / 2;

  for (let i = 0; i < n && i < pistonMeshes.length; i++) {
    const bankIdx = isV ? Math.floor(i / 2) : i;
    const z = sZ + bankIdx * CFG.cylinderSpacing;
    const phase = phaseOffsets[i] + th;

    const cpx = CFG.crankRadius * Math.cos(phase);
    const cpy = CFG.crankRadius * Math.sin(phase);
    const sinP = CFG.crankRadius * Math.sin(phase);
    const cosP = CFG.crankRadius * Math.cos(phase);
    const pistonY =
      cosP + Math.sqrt(Math.max(0.01, CFG.rodLength ** 2 - sinP * sinP));

    pistonMeshes[i].position.set(0, pistonY, z);
    pistonPinMeshes[i].position.set(0, pistonY, z);

    // Rod in bank-local space: crank pin is at (cpx, cpy) in world,
    // but bank is rotated, so we need to un-rotate for V layout
    let rpx = cpx,
      rpy = cpy;
    if (isV) {
      const bank = i % 2;
      const angle =
        bank === 0
          ? ((CFG.bankAngle / 2) * Math.PI) / 180
          : (-(CFG.bankAngle / 2) * Math.PI) / 180;
      const c = Math.cos(-angle),
        s = Math.sin(-angle);
      rpx = cpx * c - cpy * s;
      rpy = cpx * s + cpy * c;
    }

    const midX = rpx / 2;
    const midY = (rpy + pistonY) / 2;
    const rodLen = Math.sqrt(rpx * rpx + (pistonY - rpy) ** 2);
    const rodAng = Math.atan2(-rpx, pistonY - rpy);

    rodMeshes[i].position.set(midX, midY, z);
    rodMeshes[i].rotation.z = -rodAng;
    rodMeshes[i].scale.y = rodLen;
  }
}

/* ═══════════════════════════════════════════════════════════════
   RENDER LOOP
   ═══════════════════════════════════════════════════════════════ */
const clock = new THREE.Clock();
let prevShowCar = CFG.showCar;
let prevCarPosX = 0; // track car movement delta for camera follow
let prevCarPosZ = 0;

function switchCameraMode(carMode) {
  followCamActive = carMode;
  if (carMode) {
    // Keep orbit controls enabled — user can still rotate/zoom/pan
    orbitControls.enabled = true;
    groundMesh.visible = true;
    roadGroup.visible = true;
    gridHelper.visible = false;
    // Reset vehicle state
    carPosX = 0;
    carPosZ = 0;
    carHeading = 0;
    carVelX = 0;
    carVelZ = 0;
    carSpeed = 0;
    wheelSpinAngle = 0;
    steerAngle = 0;
    steerInput = 0;
    prevCarPosX = 0;
    prevCarPosZ = 0;
    carRoot.position.set(0, 0, 0);
    carRoot.rotation.y = 0;
    // Move camera to behind-and-above the car
    const WR = CFG.wheelRadius,
      CH = CFG.chassisHeight;
    orbitControls.target.set(0, WR + CH / 2, 0);
    camera.position.set(
      followOffset.x,
      followOffset.y + WR + CH / 2,
      followOffset.z
    );
    orbitControls.update();
  } else {
    orbitControls.enabled = true;
    orbitControls.target.set(0, 3, 0);
    camera.position.set(20, 14, 24);
    orbitControls.update();
    groundMesh.visible = false;
    roadGroup.visible = false;
    gridHelper.visible = true;
    // Reset light position
    dirLight.position.set(10, 25, 15);
    dirLight.target.position.set(0, 0, 0);
    dirLight.target.updateMatrixWorld();
    // Reset car position
    carPosX = 0;
    carPosZ = 0;
    carHeading = 0;
    carVelX = 0;
    carVelZ = 0;
    carSpeed = 0;
    wheelSpinAngle = 0;
    steerAngle = 0;
    steerInput = 0;
    prevCarPosX = 0;
    prevCarPosZ = 0;
    carRoot.position.set(0, 0, 0);
    carRoot.rotation.y = 0;
    engineRoot.rotation.y = 0;
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Detect showCar toggle
  if (CFG.showCar !== prevShowCar) {
    prevShowCar = CFG.showCar;
    switchCameraMode(CFG.showCar);
  }

  // Rebuild engine + car geometry if settings changed
  if (needsRebuild) {
    needsRebuild = false;
    buildEngine();
    buildCar();
    updateKinematics(theta);
    if (CFG.showCar) switchCameraMode(true);
  }

  const frameDt = Math.min(clock.getDelta(), 0.05);
  accumulator += frameDt;
  while (accumulator >= FIXED_DT) {
    if (engineState !== 'off') engineStep(FIXED_DT);
    if (CFG.showCar) vehicleStep(FIXED_DT);
    accumulator -= FIXED_DT;
  }

  crankGroup.rotation.z = theta;
  updateKinematics(theta);

  // Move car + scene elements in the world
  if (CFG.showCar) {
    carRoot.position.set(carPosX, 0, carPosZ);
    carRoot.rotation.y = carHeading;

    // Engine rides with car — transform local offset by car heading
    const cosH = Math.cos(carHeading);
    const sinH = Math.sin(carHeading);
    engineRoot.position.set(
      carPosX + sinH * engineLocalZ,
      engineLocalY,
      carPosZ + cosH * engineLocalZ
    );
    engineRoot.rotation.y = carHeading;

    updateCarWheels();

    // Keep ground plane centered on car (it's huge so edges never visible)
    groundMesh.position.set(carPosX, 0, carPosZ);

    // Follow camera — orbit target tracks the car, camera follows behind
    if (followCamActive) {
      const WR = CFG.wheelRadius;
      const CH = CFG.chassisHeight;
      const carCenterY = WR + CH / 2;

      const dx = carPosX - prevCarPosX;
      const dz = carPosZ - prevCarPosZ;

      // Shift orbit target + camera by the car's movement delta
      orbitControls.target.x += dx;
      orbitControls.target.y = carCenterY;
      orbitControls.target.z += dz;
      camera.position.x += dx;
      camera.position.z += dz;

      prevCarPosX = carPosX;
      prevCarPosZ = carPosZ;

      // Keep light following the car
      dirLight.position.set(carPosX + 10, 25, carPosZ + 15);
      dirLight.target.position.set(carPosX, 0, carPosZ);
      dirLight.target.updateMatrixWorld();
    }
  } else {
    updateCarWheels();
  }

  updateAudio(omegaToRpm(omega), theta);
  updateInfoText();
  throttleSlider.value = throttle;

  // Button state styling
  btnStart.classList.toggle('active', engineState === 'cranking');
  btnStop.classList.toggle('active', engineState === 'stopping');

  orbitControls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
