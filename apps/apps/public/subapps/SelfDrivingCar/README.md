# Self-Driving Car Simulation

Interactive, browser-based self-driving car demo (no external libs) with manual control, automated training, and live network visualization.

Based on the tutorial: https://www.youtube.com/watch?v=lok3RVBwSqE

## Quick start

- Open the app (served via Nx) and you will see two canvases: the road view and the network view.
- Use the sidebar buttons to control the sim (info, settings, pause, restart, train, manual toggle, save/clear brain).

## Controls

- Arrow keys: steer when in KEYS mode.
- Space or 🔑/🤖 button: toggle manual vs AI control for the focused car.
- ⏸️/▶️: pause or resume.
- ♻️: restart (applies current settings).
- 🏋️: start/stop automated training cycles.
- 💾: save the best brain; 🗑️: clear saved brain.
- ℹ️: reopen instructions. ⚙️: open settings.

## Training options

### Manual training

- Observe runs (or drive) and press 💾 when the focused car looks best (farther distance or most cars passed).
- Restart to spawn variants using the current mutation rate.

### Automated training

- Press 🏋️ to auto-train. After each window (default 10s, configurable) the best car by cars-passed and distance is kept, mutated, and used for the next generation.
- Settings let you adjust iterations, window length, mutation rate, car count, follow ratio, and whether to show the network canvas.

## Fitness tracking

- Each car tracks `carsPassed` (unique traffic cars passed) and distance (via `y`).
- Lead selection prefers highest `carsPassed`, then farthest distance.
- The HUD shows the current best car’s passes and position.

## Architecture highlights

- Entry/UI logic: [apps/apps/public/subapps/SelfDrivingCar/js/main.js](apps/apps/public/subapps/SelfDrivingCar/js/main.js)
  - Simulation loop, training loop, settings persistence, manual toggle, HUD, and fitness selection.
- Car behavior: [apps/apps/public/subapps/SelfDrivingCar/js/core/car/index.js](apps/apps/public/subapps/SelfDrivingCar/js/core/car/index.js)
  - Physics, sensors, brain wiring, control mode switching, per-car `carsPassed` tracking.
- Road rendering: [apps/apps/public/subapps/SelfDrivingCar/js/core/road.js](apps/apps/public/subapps/SelfDrivingCar/js/core/road.js)
- Config: [apps/apps/public/subapps/SelfDrivingCar/js/config.js](apps/apps/public/subapps/SelfDrivingCar/js/config.js)
- Assets/styles: [apps/apps/public/subapps/SelfDrivingCar/assets/style.css](apps/apps/public/subapps/SelfDrivingCar/assets/style.css)

## Settings reference

- Car count, follow ratio (camera offset), network visibility, mutation rate, training iterations, training window (seconds).
- Saved to `localStorage` under the `sdcSettings` key (see STORAGE_KEYS in config).

## Persistence

- Best brain is saved via 💾 and restored on load; stored in `localStorage` under `bestBrain`.
- Instructions dismissal is stored under `instructionsSeen`.

## TODO

- Implement crossover for retaining the best brain alongside other fitness operators (e.g., mix brains from top performers) and extend fitness functions beyond cars-passed/distance.
