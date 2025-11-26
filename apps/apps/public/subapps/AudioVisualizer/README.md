# Audio Visualizer with Pitch Detection

Key Features:

Autocorrelation Algorithm - Detects the fundamental frequency (pitch) from the audio signal using a robust autocorrelation method with parabolic interpolation for accuracy

Musical Note Display - Shows:

Note name and octave (e.g., "A4", "C#3")
Exact frequency in Hz
Cents deviation from the nearest note (+/- 50 cents, where 100 cents = 1 semitone)
Real-time Detection - Works with both microphone input and audio files, updating continuously as the audio plays

Improved FFT Settings - Increased fftSize to 2048 for better pitch resolution and accuracy

How it works:

The autocorrelation algorithm analyzes the time-domain waveform to find repeating patterns
It converts the detected frequency to the nearest musical note using standard tuning (A4 = 440 Hz)
The "cents" value tells you if you're sharp (+) or flat (-) relative to perfect pitch
Only displays notes when a clear pitch is detected in the valid range (below 4000 Hz)
This is perfect for tuning instruments, practicing singing, or analyzing the pitch content of any audio!
