import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { CanvasStage, type CanvasStageHandle } from '@cb-common/ui-react-mui';
import {
  SDCSimulation,
  NetworkVisualizer,
  loadSettings,
  saveSettings,
  hasSeenInstructions,
  markInstructionsSeen,
  type SDCSettings,
  SDC_DEFAULT_SETTINGS,
} from '@cb-common/ui-processing-ctx-core';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CAR_CANVAS_WIDTH = 300;
const NETWORK_CANVAS_WIDTH = 600;
const CAR_IMAGE_PATH =
  '/subapps/SelfDrivingCar/assets/self-driving-car-blue.png';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SelfDrivingCarApp() {
  /* ---------- Refs for canvases ---------------------------------- */
  const carStageRef = useRef<CanvasStageHandle>(null);
  const netStageRef = useRef<CanvasStageHandle>(null);

  /* ---------- Simulation ref (stable across renders) ------------- */
  const simRef = useRef<SDCSimulation | null>(null);

  /* ---------- UI state ------------------------------------------- */
  const [paused, setPaused] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [trainingActive, setTrainingActive] = useState(false);
  const [showNetwork, setShowNetwork] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SDCSettings>(() => loadSettings());

  /* ---------- Draft settings for the dialog ---------------------- */
  const [draft, setDraft] = useState<SDCSettings>({ ...settings });

  /* ---------- Initialise simulation ------------------------------ */
  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    setShowNetwork(s.showNetwork);

    const sim = new SDCSimulation(CAR_CANVAS_WIDTH, s, (active) =>
      setTrainingActive(active)
    );
    simRef.current = sim;

    sim.loadCarImage(CAR_IMAGE_PATH);

    if (!hasSeenInstructions()) {
      setInfoOpen(true);
      markInstructionsSeen();
    }

    return () => {
      sim.stopTraining();
      for (const car of sim.cars) car.dispose();
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Canvas draw callbacks ------------------------------ */
  const onDrawCar = useCallback(
    (
      _ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      _time: number
    ) => {
      const sim = simRef.current;
      if (!sim) return;

      // Always tick (the sim checks its own pause flag).
      sim.tick();

      // Clear and resize
      canvas.height = window.innerHeight;
      canvas.width = CAR_CANVAS_WIDTH;

      sim.renderCarCanvas(_ctx, canvas.height);
    },
    []
  );

  const onDrawNet = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      time: number
    ) => {
      const sim = simRef.current;
      if (!sim || !sim.bestCar?.brain) return;
      canvas.height = window.innerHeight;
      canvas.width = NETWORK_CANVAS_WIDTH;
      ctx.lineDashOffset = -time / 50;
      NetworkVisualizer.drawNetwork(ctx, sim.bestCar.brain);
    },
    []
  );

  /* ---------- Sync paused flag into sim -------------------------- */
  useEffect(() => {
    if (simRef.current) simRef.current.paused = paused;
  }, [paused]);

  /* ---------- Handlers ------------------------------------------- */
  const handleTogglePause = useCallback(() => setPaused((p) => !p), []);

  const handleToggleManual = useCallback(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.toggleManual();
    setManualMode(sim.manualMode);
  }, []);

  const handleRestart = useCallback(() => {
    simRef.current?.reset();
    setManualMode(false);
  }, []);

  const handleSaveBrain = useCallback(() => simRef.current?.saveBrain(), []);

  const handleDiscardBrain = useCallback(
    () => simRef.current?.discardBrain(),
    []
  );

  const handleToggleTraining = useCallback(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.toggleTraining();
    setTrainingActive(sim.trainingActive);
    if (sim.trainingActive) {
      setPaused(false);
      setManualMode(false);
    }
  }, []);

  /* ---------- Settings dialog ------------------------------------ */
  const openSettings = useCallback(() => {
    setDraft({ ...settings });
    setSettingsOpen(true);
  }, [settings]);

  const handleSaveSettings = useCallback(() => {
    const next = { ...draft };
    saveSettings(next);
    setSettings(next);
    setShowNetwork(next.showNetwork);
    if (simRef.current) {
      simRef.current.settings = { ...next };
      simRef.current.reset();
    }
    setSettingsOpen(false);
  }, [draft]);

  /* ---------- Space-bar toggle ----------------------------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        handleToggleManual();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleToggleManual]);

  /* ---------- Render --------------------------------------------- */
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'grey.800',
      }}
    >
      {/* ---- Car canvas ---- */}
      <CanvasStage
        ref={carStageRef}
        onDraw={onDrawCar}
        width={CAR_CANVAS_WIDTH}
        autoResize={false}
        background="#9e9e9e"
        sx={{ flexShrink: 0 }}
      />

      {/* ---- Toolbar ---- */}
      <Stack
        spacing={0.5}
        sx={{
          py: 1,
          px: 0.5,
          bgcolor: 'background.paper',
          alignItems: 'center',
          borderLeft: 1,
          borderRight: 1,
          borderColor: 'divider',
        }}
      >
        <Tooltip title="Info" placement="right">
          <IconButton size="small" onClick={() => setInfoOpen(true)}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings" placement="right">
          <IconButton size="small" onClick={openSettings}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={paused ? 'Resume' : 'Pause'} placement="right">
          <IconButton size="small" onClick={handleTogglePause}>
            {paused ? (
              <PlayArrowIcon fontSize="small" />
            ) : (
              <PauseIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Restart" placement="right">
          <IconButton size="small" onClick={handleRestart}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={trainingActive ? 'Stop training' : 'Start training'}
          placement="right"
        >
          <IconButton size="small" onClick={handleToggleTraining}>
            {trainingActive ? (
              <StopIcon fontSize="small" color="error" />
            ) : (
              <FitnessCenterIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={manualMode ? 'Switch to AI' : 'Switch to manual'}
          placement="right"
        >
          <IconButton size="small" onClick={handleToggleManual}>
            {manualMode ? (
              <SmartToyIcon fontSize="small" />
            ) : (
              <KeyboardIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Save best brain" placement="right">
          <IconButton size="small" onClick={handleSaveBrain}>
            <SaveIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Discard saved brain" placement="right">
          <IconButton size="small" onClick={handleDiscardBrain}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* ---- Network canvas ---- */}
      {showNetwork && (
        <CanvasStage
          ref={netStageRef}
          onDraw={onDrawNet}
          width={NETWORK_CANVAS_WIDTH}
          autoResize={false}
          background="#000"
          sx={{ flexShrink: 0 }}
        />
      )}

      {/* ---- Info Dialog ---- */}
      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />

      {/* ---- Settings Dialog ---- */}
      <SettingsDialog
        open={settingsOpen}
        draft={draft}
        onChange={setDraft}
        onSave={handleSaveSettings}
        onCancel={() => setSettingsOpen(false)}
      />
    </Box>
  );
}

/* ================================================================== */
/*  Info Dialog                                                        */
/* ================================================================== */

function InfoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Self-Driving Car Simulation</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" gutterBottom>
          A fleet of AI cars spawns with a simple neural-network brain. They
          start clumsy, but you can improve them by saving good runs or letting
          the trainer loop pick the best and mutate it.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Manual training
        </Typography>
        <Typography variant="body2" gutterBottom>
          Watch or drive, then hit <strong>Save</strong> when the focused car
          looks best (farthest distance or most cars passed). Restart to spawn
          variants using the current mutation rate.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Automated training
        </Typography>
        <Typography variant="body2" gutterBottom>
          Press the training button to auto-train. After each window (default 10
          s, configurable) the best car is kept, mutated, and used for the next
          generation. Adjust iterations, window, and mutation in settings; press
          again to stop.
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Controls
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 0.5 }}
        >
          {[
            'Arrow keys → steer (manual)',
            'Space → toggle AI / manual',
            'Pause / Resume',
            'Restart',
            'Train',
            'Save / Discard brain',
            'Settings',
          ].map((label) => (
            <Chip key={label} label={label} size="small" variant="outlined" />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

/* ================================================================== */
/*  Settings Dialog                                                    */
/* ================================================================== */

function SettingsDialog({
  open,
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  open: boolean;
  draft: SDCSettings;
  onChange: React.Dispatch<React.SetStateAction<SDCSettings>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  const set = <K extends keyof SDCSettings>(key: K, value: SDCSettings[K]) =>
    onChange((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Cars to spawn"
            type="number"
            size="small"
            inputProps={{ min: 10, max: 1000, step: 10 }}
            value={draft.carCount}
            onChange={(e) => set('carCount', Number(e.target.value))}
          />
          <TextField
            label="Follow ratio (0.3 – 0.95)"
            type="number"
            size="small"
            inputProps={{ min: 0.3, max: 0.95, step: 0.05 }}
            value={draft.followRatio}
            onChange={(e) => set('followRatio', Number(e.target.value))}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={draft.showNetwork}
                onChange={(e) => set('showNetwork', e.target.checked)}
              />
            }
            label="Show network canvas"
          />
          <TextField
            label="Mutation rate (0 – 1)"
            type="number"
            size="small"
            inputProps={{ min: 0, max: 1, step: 0.01 }}
            value={draft.mutationRate}
            onChange={(e) => set('mutationRate', Number(e.target.value))}
          />
          <TextField
            label="Training iterations"
            type="number"
            size="small"
            inputProps={{ min: 1, max: 500, step: 1 }}
            value={draft.trainingIterations}
            onChange={(e) => set('trainingIterations', Number(e.target.value))}
          />
          <TextField
            label="Training window (seconds)"
            type="number"
            size="small"
            inputProps={{ min: 1, max: 120, step: 1 }}
            value={draft.trainingDurationSeconds}
            onChange={(e) =>
              set('trainingDurationSeconds', Number(e.target.value))
            }
          />
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.5, display: 'block' }}
        >
          Changes apply when you restart (♻️).
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
