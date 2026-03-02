const sounds = {
  click: new Audio("./assets/sound/sound-click.mp3"),
  match: new Audio("./assets/sound/sound-winpoint.mp3"),
  loss: new Audio("./assets/sound/sound-loss.mp3"),
  winLevel: new Audio("./assets/sound/sound-victory.mp3"),
  victory: new Audio("./assets/sound/sound-victory.mp3"),
};
/**
 *
 * @param {string} soundKey
 */
export const playSound = (soundKey) => {
  const sound = sounds[soundKey];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch((err) => console.warn("Audio playback blocked:", err));
  }
};
