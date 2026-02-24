### The "Why": Thinking & Rationale

**The Cognitive Hook: Music vs. Memory**

I began this project by reflecting on a personal frustration: I have a bad memory for facts, but an ironclad memory for music. There is a scientific basis for this. "Music-Evoked Autobiographical Memories" are among the strongest links in the human brain. We might forget a grocery list, but we never forget the artist behind our favorite song. I wanted to build a game that celebrates this "musical muscle memory."

**The Market Opportunity: Enhancing Spotify Wrapped**
Spotify Wrapped is a cultural phenomenon, but it is currently a passive experience—users simply swipe through slides of data.

**The Strategy:**
By embedding a Memory Match game into this feature, we turn passive data into an active challenge.

**The Goal:**
To move the user from "reading their stats" to "testing their expertise" on their own listening habits.

Gamification: The "Sound Persona"
People have a natural desire for self-discovery (seen in the popularity of personality tests). I decided to use the game as a diagnostic tool.
By winning 3 rounds, the user doesn't just "finish a game"—they unlock a Sound Persona (e.g., The Avid Listener vs. The Blue Moon Listener). This creates a high-stakes incentive to complete all levels.

### The Approach: Engineering the Experience

1. **Complexity by Design (A-to-B Matching)**
   Standard memory games are A-to-A (match a picture to an identical picture). To reflect the sophistication of the Spotify brand, I chose A-to-B matching.

**The Logic:**
Users must match an Artist card to a Song Title card.

**The Impact:**
This forces the brain to retrieve information rather than just recognizing patterns, making the game more rewarding for music fans.

2. **The "Remix" Scaling (Progressive Difficulty)**
   To keep the player in a "flow state," I designed the game to scale in difficulty across three levels:

**Level 1 (Studio):**
A small grid to build confidence.

**Level 2 (Tour):**
A medium grid with a tighter timer and introduction of Shuffle Mechanics where cards reposition themselves (remix energy).

**Level 3 (The Remix):**
A large grid with a tighter timer, shuffle mechanics and bonus points when they correctly match back to back cards.

3. **Visual & Technical Synergy**
   I am adopting Spotify’s design language—Dark Mode, High Contrast (Spotify Green), and clean Typography. Technically, this project allows me to demonstrate:

**State Management:**
Tracking matches moves, level, and scores.

**DOM Manipulation:**
Dynamically rendering different grid sizes for each level.

**Asynchronous Logic:**
Managing countdown timers and shuffle events simultaneously.
