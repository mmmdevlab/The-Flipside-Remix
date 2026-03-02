### Project Overview (still WIP)

## Timeline

1 week

## Technologies & Tools Used

- HTML
- CSS
- JavaScript
- Git & GitHub

### Introducing The Flipside Remix Game

to be [place] Screenshot here

## Description

**The Flipside Remix** is a browser-based memory card game that challenges players to match the artists they love with the songs they know.
Inspired by music streaming culture, the game blends classic memory mechanics with a Spotify-style visual theme and fast-paced scoring system.

Players match song titles to their correct artists across three progressively challenging levels. As the game advances, the grid expands, the timer shortens, and disruptive remix mechanics — like shuffle effects increase the difficulty.

Beyond memory and music knowledge, the game measures performance and assigns players a unique music persona based on their final score.

## How to Play

- Flip: Click a card to reveal either a Song or an Artist.
- Match: Find the correct Song–Artist pair to keep the cards face-up and earn points.
- Beat the Clock: The countdown timer begins on your first move. Clear the board before time runs out.
- Combo Up: Match quickly to activate combo scoring and double your points.

to be [place] Screenshot/how to play here.

## What it Takes to Win

**Win Condition**

- Match all pairs in a level before the timer reaches zero.
- Complete all 3 levels in sequence to win the full game unlock personas.
- A Win Overlay appears after each level and a final Game Victory screen appears at the end.

**Loss Condition**

- The countdown timer hits zero before all pairs are matched.
- A Loss Overlay appears with your score and the option to retry the level or restart the game.

## Game Structure

**Three Levels**

- Increasing number of cards
- aster countdown timers
- Added shuffle effects to disrupt memorization
- Higher scoring potential

**Remix Mechanics**

- Random shuffle events can reposition unrevealed cards
- Pressure increases as time decreases
- Bonus point when back to back matches wins

**Endgame Outcome**

- Win or loss screen based on performance
- Final score determines your assigned Music Persona

# Persona categories

link: [https://chatgpt.com/share/699d39d6-503c-8012-8576-0a4dbf6d0a6d]

**The Soundwave Sage**

- score -> 80% - 100%

**The Beat Devotee**

- score -> 60% - 79%

**The Rhythm Rover**

- score -> 40% - 59%

**The Silent Mode Starter**

- score -> 0% - 39%

### Approach to Development

## 1 Planning

- MVP - Defined core MVP before adding enhancements
- Wireframe - Created wireframes to map layout and information hierarchy
  - Figuring out artists and songs list
    - link [https://chatgpt.com/share/699d46f2-9670-8012-a42a-468f52e06452]
    - link to [add wireframe folder]
- User stories - Wrote user stories to clarify player interactions
  - link to [add UserStories.md]
- Presudocode - Developed pseudocode to outline game logic flow
  - link to [add presudocode.js]
- Game state - Defined game state variables (score, timer, moves, level, flipped cards, matched cards)

## 2 Developing

- Main build (Html, CSS, JavaScript)
  - html
    - Main screen
    - Game play screen
      - dashboard panel
    - win/loss (overlay)
  - CSS
    - Flexbox
    - bootstrap
  - Javascript
- Features (Flip, shuffle, persona assignment)
- Level up (light and dark mode, audio, Store data using localStorage, confetti on a win.)

**Project Details**

- **Structure** Writing code for html
- **Logic** Writing code for javascript
  - JavaScript data layer, interactions, game engine
  - a structured JavaScript data set
  - State management mention
  - DOM manipulation strategy
  - Reset logic
  - Timer logic
- **Styling** Writing code for CSS
  - animated main page
  - Flexbox for page layout design
  - ensure the colors are contrast approved
  - including flip and click sound effects
- **Testing**
  Accessibility
  - include alt text.
  - Contrast Checker
- **Debugging**

### MVP

- Level 1 is 4x3 grid, Level 2 is 6x3 grid and level 3 is 7x4 grid.
- Cards generated using JavaScript
- Click to flip logic
- Only 2 cards flipped at a time
- Matching logic works
- Matched cards stay flipped
- Mismatched cards flip back

### Game State

- Score tracking
- Move count
- Countdown timer
- Timer starts on first move
- Game ends when:
  - All pairs matched (Win)
  - Timer hits zero (Lose)
- Level 1 - easy mode only to match cards within the given time
- Level 2 - Includes shuffle mode
- Level 3 - Includes shuffle mode and bonus points when back to back matches occur

### End State

- Win screen renders in HTML
- Loss screen renders in HTML
- Restart button resets everything cleanly
- End of all 3 levels reveal persona as results (because we need enough score to identify)

### References
