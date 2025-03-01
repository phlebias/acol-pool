// Sound effect for button clicks
const buttonClickSound = new Audio('/sounds/card-shuffle.mp3');

export const playButtonSound = () => {
  buttonClickSound.currentTime = 0; // Reset the sound to start
  buttonClickSound.play().catch(error => {
    // Silently handle any autoplay restrictions
    console.log('Sound playback was prevented:', error);
  });
}; 