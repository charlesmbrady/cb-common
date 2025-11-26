let currentAnimationFrame = null;
let currentAudioContext = null;
let currentMicStream = null;

// Note names for pitch detection
const noteStrings = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

// Convert frequency to note name
function frequencyToNote(frequency) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const noteIndex = Math.round(noteNum) + 69;
  const noteName = noteStrings[noteIndex % 12];
  const octave = Math.floor(noteIndex / 12) - 1;

  // Calculate cents off from the nearest note
  const nearestNote = Math.round(noteNum) + 69;
  const centsOff = Math.floor((noteNum - Math.round(noteNum)) * 100);

  return {
    note: noteName + octave,
    frequency: frequency.toFixed(2),
    cents: centsOff,
  };
}

// Autocorrelation pitch detection algorithm
function autoCorrelate(buffer, sampleRate) {
  // Perform autocorrelation
  let size = buffer.length;
  let sumOfSquares = 0;
  for (let i = 0; i < size; i++) {
    const val = buffer[i];
    sumOfSquares += val * val;
  }

  // Not enough signal
  if (sumOfSquares < 0.001) return -1;

  let r1 = 0;
  let r2 = size - 1;
  const threshold = 0.2;

  // Trim silence from beginning
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  // Trim silence from end
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buffer[size - i]) < threshold) {
      r2 = size - i;
      break;
    }
  }

  buffer = buffer.slice(r1, r2);
  size = buffer.length;

  const correlations = new Array(size).fill(0);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      correlations[i] += buffer[j] * buffer[j + i];
    }
  }

  let d = 0;
  while (correlations[d] > correlations[d + 1]) d++;

  let maxValue = -1;
  let maxIndex = -1;
  for (let i = d; i < size; i++) {
    if (correlations[i] > maxValue) {
      maxValue = correlations[i];
      maxIndex = i;
    }
  }

  let T0 = maxIndex;

  // Parabolic interpolation for better accuracy
  const x1 = correlations[T0 - 1];
  const x2 = correlations[T0];
  const x3 = correlations[T0 + 1];

  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

function updateNoteDisplay(frequency) {
  const noteInfo = frequencyToNote(frequency);
  document.querySelector('#noteDisplay .note').textContent = noteInfo.note;
  document.querySelector('#noteDisplay .frequency').textContent =
    noteInfo.frequency + ' Hz';

  const centsText = noteInfo.cents > 0 ? '+' + noteInfo.cents : noteInfo.cents;
  document.querySelector('#noteDisplay .cents').textContent =
    centsText + ' cents';
}

function clearNoteDisplay() {
  document.querySelector('#noteDisplay .note').textContent = '-';
  document.querySelector('#noteDisplay .frequency').textContent = '- Hz';
  document.querySelector('#noteDisplay .cents').textContent = '- cents';
}

document.getElementById('audio').addEventListener('change', (event) => {
  stopCurrentVisualization();

  const file = event.target.files[0];

  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    const arrayBuffer = event.target.result;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    currentAudioContext = audioContext;

    audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
      visualize(audioBuffer, audioContext);
    });
  });

  reader.readAsArrayBuffer(file);
});

document.getElementById('micToggle').addEventListener('click', async () => {
  const button = document.getElementById('micToggle');

  if (currentMicStream) {
    // Stop microphone
    stopCurrentVisualization();
    button.textContent = 'Start Microphone';
  } else {
    // Start microphone
    try {
      stopCurrentVisualization();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      currentMicStream = stream;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      currentAudioContext = audioContext;

      visualizeMicrophone(stream, audioContext);
      button.textContent = 'Stop Microphone';
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(
        'Could not access microphone. Please ensure you have granted permission.'
      );
    }
  }
});

function stopCurrentVisualization() {
  if (currentAnimationFrame) {
    cancelAnimationFrame(currentAnimationFrame);
    currentAnimationFrame = null;
  }

  if (currentAudioContext) {
    currentAudioContext.close();
    currentAudioContext = null;
  }

  if (currentMicStream) {
    currentMicStream.getTracks().forEach((track) => track.stop());
    currentMicStream = null;
  }

  clearNoteDisplay();
}

function visualizeMicrophone(stream, audioContext) {
  const canvas = document.getElementById('canvas');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048; // Increased for better pitch detection
  analyser.smoothingTimeConstant = 0.8;

  const frequencyBufferLength = analyser.frequencyBinCount;
  const frequencyData = new Uint8Array(frequencyBufferLength);
  const timeDomainData = new Float32Array(analyser.fftSize);

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  // Note: We don't connect to destination for mic input to avoid feedback

  const canvasContext = canvas.getContext('2d');
  const barWidth = canvas.width / frequencyBufferLength;

  function draw() {
    currentAnimationFrame = requestAnimationFrame(draw);
    canvasContext.fillStyle = 'rgb(173, 216, 230)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    analyser.getByteFrequencyData(frequencyData);

    // Get time domain data for pitch detection
    analyser.getFloatTimeDomainData(timeDomainData);
    const pitch = autoCorrelate(timeDomainData, audioContext.sampleRate);

    if (pitch > 0 && pitch < 4000) {
      // Valid pitch range
      updateNoteDisplay(pitch);
    } else {
      clearNoteDisplay();
    }

    for (let i = 0; i < frequencyBufferLength; i++) {
      canvasContext.fillStyle = 'rgb(' + frequencyData[i] + ',118, 138)';
      canvasContext.fillRect(
        i * barWidth,
        canvas.height - frequencyData[i],
        barWidth - 1,
        frequencyData[i]
      );
    }
  }

  draw();
}

function visualize(audioBuffer, audioContext) {
  const canvas = document.getElementById('canvas');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048; // Increased for better pitch detection
  analyser.smoothingTimeConstant = 0.8;

  const frequencyBufferLength = analyser.frequencyBinCount;
  const frequencyData = new Uint8Array(frequencyBufferLength);
  const timeDomainData = new Float32Array(analyser.fftSize);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start();

  const canvasContext = canvas.getContext('2d');

  const barWidth = canvas.width / frequencyBufferLength;

  function draw() {
    currentAnimationFrame = requestAnimationFrame(draw);
    canvasContext.fillStyle = 'rgb(173, 216, 230)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    analyser.getByteFrequencyData(frequencyData);

    // Get time domain data for pitch detection
    analyser.getFloatTimeDomainData(timeDomainData);
    const pitch = autoCorrelate(timeDomainData, audioContext.sampleRate);

    if (pitch > 0 && pitch < 4000) {
      // Valid pitch range
      updateNoteDisplay(pitch);
    } else {
      clearNoteDisplay();
    }

    for (let i = 0; i < frequencyBufferLength; i++) {
      // The frequency data is composed of integers on a scale from 0 to 255
      canvasContext.fillStyle = 'rgb(' + frequencyData[i] + ',118, 138)';
      canvasContext.fillRect(
        i * barWidth,
        canvas.height - frequencyData[i],
        barWidth - 1,
        frequencyData[i]
      );
    }
  }

  draw();
}
