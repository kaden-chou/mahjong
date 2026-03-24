# Chinitsu Trainer

A web-based training application for learning mahjong winning waits in chinitsu (flush) hands. This app helps players develop the ability to quickly recognize which tiles complete winning combinations in pure suit hands.

## Purpose

Chinitsu Trainer is designed to improve mahjong players' pattern recognition skills specifically for flush hands (all tiles of the same suit). The app presents randomized 7-tile patterns and challenges players to identify which numbers (1-9) would complete a winning wait. This is essential for:

- **Wait Recognition**: Quickly identifying winning tiles in flush combinations
- **Pattern Memory**: Building muscle memory for common chinitsu patterns
- **Decision Making**: Improving speed and accuracy in live games
- **Strategy Development**: Understanding optimal tile discards in flush development

## Features

- **Interactive Training**: Click or keyboard input (1-9) to select wait numbers
- **Suit Selection**: Practice with characters (萬), dots (筒), bamboo (索), or random suits
- **Real-time Feedback**: Immediate visual feedback on correct/incorrect answers
- **Session Tracking**: Score tracking and timing for each training session
- **Review Mode**: Review all patterns from a session with correct answers
- **Theme Support**: Light/dark theme toggle with system preference detection
- **Responsive Design**: Works on desktop and mobile devices
- **Seeded Randomization**: Consistent pattern generation for reproducible practice

## Quick Start

Serve the application locally:

```bash
# Using Python 3
python -m http.server 8000

# Or with Node.js
npx http-server -c-1 . 8000
```

Open http://localhost:8000 in your browser and click "Start Training" to begin.

## File Structure

### HTML Files

- **`index.html`** - Landing page with app title, settings modal, and navigation to training
  - Contains suit selection buttons (characters, dots, bamboo, random)
  - Settings modal for configuring training preferences
  - Theme toggle and navigation to wait trainer

- **`wait-trainer.html`** - Main training interface
  - Displays randomized 7-tile chinitsu patterns using custom mahjong font
  - Interactive 3x3 number grid for selecting wait numbers
  - Real-time timer, question counter, and feedback display
  - Review mode for post-session analysis

### JavaScript Files (`js/`)

- **`combinations.js`** - Core pattern definitions and randomization logic
  - Defines `COMBINATIONS` array with chinitsu patterns and their wait numbers
  - Contains `reverseCombination()` for pattern inversion
  - Implements seeded random shuffling for reproducible sessions
  - Provides `getRandomizedComboWithWait()` for pattern generation

- **`tiles.js`** - Tile notation to font character mapping
  - Maps mahjong tile notation (e.g., '1m', '2s') to keyboard characters
  - Supports all three suits: man (m), pin (p), sou (s), and honors (z)
  - Used by the custom MahjongFont for proper tile display

- **`main.js`** - Settings and landing page functionality
  - Handles suit selection persistence in localStorage
  - Manages settings modal interactions
  - Initializes UI state based on saved preferences

- **`wait-trainer.js`** - Main game logic and user interaction
  - Manages training session state and scoring
  - Handles user input (clicks and keyboard)
  - Implements timer, feedback system, and review functionality
  - Processes pattern transformation with selected suit

- **`theme-toggle.js`** - Theme switching functionality
  - Toggles between light and dark themes
  - Persists theme preference in localStorage
  - Respects system color scheme preferences

### CSS Files (`css/`)

- **`styles.css`** - Complete application styling
  - Custom MahjongFont integration with @font-face
  - CSS custom properties for theming (light/dark modes)
  - Responsive layout and mobile-friendly design
  - Modal, button, and interactive element styling

### Resources (`Resources/`)

- **`MahjongPlain-aa59.ttf`** - Custom TrueType font for mahjong tile display
  - Maps keyboard characters to mahjong tile symbols
  - Enables proper visual representation of tiles in the browser

## How It Works

1. **Pattern Generation**: The app uses predefined chinitsu combinations and applies seeded randomization to create practice patterns
2. **Suit Transformation**: Selected suit preference transforms numeric patterns into tile notation (e.g., "123" becomes "一二三" for characters)
3. **Font Rendering**: Custom MahjongFont renders tile symbols using mapped keyboard characters
4. **Wait Calculation**: Each pattern has predefined winning wait numbers that complete the combination
5. **User Interaction**: Players select numbers 1-9, and the app provides immediate feedback
6. **Session Management**: Tracks performance across multiple patterns with timing and scoring

## Browser Support

- Modern browsers with ES6+ support
- Custom font loading requires CORS-compatible serving
- localStorage support for settings persistence
- CSS custom properties for theming

## Development

This is a static web application with no build process required. All files are served directly by any static web server.

### Adding New Patterns

To add new chinitsu combinations, edit `js/combinations.js`:

```javascript
const COMBINATIONS = [
  // Existing patterns...
  {
    index: 4,
    pattern: "1122334",
    reversible: true,
    range: [1, 8],
    wait: [1, 2, 3, 4]
  }
];
```

### Customization

- Modify `css/styles.css` for visual changes
- Update `js/tiles.js` for additional tile mappings
- Adjust timing and scoring in `js/wait-trainer.js`

## Deployment

Deploy to any static hosting service:

- **GitHub Pages**: Push to repository and enable Pages
- **Netlify/Vercel**: Connect repository for automatic deployment
- **Any web server**: No build step required

## License

This project is open source. See individual files for licensing information.
