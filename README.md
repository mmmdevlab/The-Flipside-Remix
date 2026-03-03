### Project Overview

## Timeline

1 week

## Technologies & Tools Used
- HTML
- CSS
- JavaScript
- Git & GitHub

### Introducing

![The Flipside Remix Logo][logo]

[logo]: assets/Game-Lockup-W.svg

## Description

**The Flipside Remix** is a browser-based memory card game that challenges players to match the artists they love with the songs they know.
Inspired by music streaming culture, the game blends classic memory mechanics with a Spotify-style visual theme and fast-paced scoring system.

Players match song titles to their correct artists across three progressively challenging levels. As the game advances, the grid expands, the timer shortens, and disruptive remix mechanics — like shuffle effects increase the difficulty.

Beyond memory and music knowledge, the game measures performance and assigns players a unique music persona based on their final score.

## How to Play
- Enter your name and press Play Game
- **Flip:** Click a card to reveal either a Song or an Artist.
- **Match:** Find the correct Song–Artist pair to keep the cards face-up and earn points.
- **Beat the Clock:** The countdown timer begins on your first move. Clear the board before time runs out.
- **Combo Up:** Match quickly to activate combo scoring and double your points.
- Complete all 3 levels to unlock your Sound Persona

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
- Added shuffle effects to disrupt memorization in Intervals
- Higher scoring potential

**Remix Mechanics**
- Random multiple shuffle events can reposition unrevealed cards
- Pressure increases as each level increase cards and matches
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
- 
**The Silent Mode Starter**
- score -> 0% - 39%

### Approach to Development

## 1 Planning

- MVP - Defined the minimum viable product to keep the build focused
- User stories - Wrote user stories to clarify player interactions
  - link to [add UserStories.md]
- Wireframe - Created wireframes to map layout and information hierarchy
  - Figuring out Artists and songs research (with the help of AI)
    - link [https://chatgpt.com/share/699d46f2-9670-8012-a42a-468f52e06452]
    - link to [add wireframe folder]
- Presudocode - Outlined game logic flow before writing JavaScript
  - link to [add presudocode.js]
- Game state - Defined all state variables upfront: score, timer, moves, level, flipped cards, matched cards

## 2 Developing

- Main build
  - **HTML**
    - Start screen with player name input and match examples
    - Game screen with card grid and live score panel (level, time, score, moves)
    - Overlay system for: level start, win, loss, final victory, and persona results
    - Semantic elements throughout (<header>, <main>, <section>, <dialog>)
  - **CSS**
    - CSS custom properties to match the brand 
    - Flexbox for page layout, header, score panel, overlays, and button groups
    - Grid for the card board (columns/rows set dynamically by JS per level)
    - Mid-game shuffle animation using @keyframes shuffle-jiggle
    - Bootstrap was evaluated and decided against — custom CSS kept full control
  - **Javascript**
    - The JS is split across three files for separation of concerns:
      - Game data layer — levels, match pairs, personas, scoring rules
      - Game engine — state management, DOM manipulation, event handling
      - Audio module — handles all sound playback
    - Key implementation details:
      - State management — All game state held in module-level let variables (score, moves, timeLeft, currentLevel, etc.)
    - DOM manipulation — Cards generated dynamically via JavaScript; board re-renders each level
    - Timer logic — Countdown starts on first card flip, not on page load
    - Reset logic — Full state reset on game over, try again, or manual reset
    - Race condition fix — Card references captured in local variables before setTimeout to prevent null crashes on reset
    - Persona scoring — Normalised against real min/max score range (290–550) so all four tiers are reachable

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
- Level 1: 4×3 grid — 6 pairs, 60s
- Level 2: 6×3 grid — 9 pairs, 90s, mid-game shuffle
- Level 3: 7×4 grid — 14 pairs, 120s, mid-game shuffle
- Cards generated dynamically by JavaScript
- Click to flip logic
- Only 2 cards flippable at a time
- Match logic — correct pairs stay flipped
- Mismatch logic — cards flip back after 600ms
- Score tracking with streak bonus
- Move counter
- Countdown timer (starts on first move)
- Win condition — all pairs matched
- Loss condition — timer hits zero
- Win / Loss / Victory overlays
- Reset button resets everything cleanly
- Sound Persona assigned based on normalised total score across all 3 levels

### Game Rules by Level

| Level    | Grid | Time |Pairs |
|:-------: |:----:|:----:|:----:|
| Level 1  | 4x3  | 60s  |6     |
| Level 2  | 6x3  | 90s  |9     |
| Level 3  | 7x4  | 120s | 14   |

### Sound Personas

| Persona           | Score Range | Tier   |
|:----------------: |:-----------:|:------:|
| Soundwave Sage    | 500–550     | 80–100%|
| Beat Devotee      | 446–499     | 60–79% |
| Rhythm Rover      | 392–445     | 40–59% | 
|Silent Mode Starter| 290–391     | 0–39%  |

### Testing & Debugging
- Accessibility
- Bugs Fixed
- Any function improvements and CSS updates

### Future Updates
- Light / Dark mode toggle (UI wired, logic pending)
- Accessibility improvements — keyboard navigation for cards
- Mobile responsive layout improvements
- Leaderboard using localStorage
- Animated start screen
- Download persona card to share on social

### References
