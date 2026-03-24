// Keyboard to mahjong tile mapping

// Maps tile notation (e.g., '1m', '2s') to keyboard character for display with MahjongFont
// Suits: m (man/characters), p (pin/dots), s (sou/bamboo)

const TILES = {
  // z tiles (honors - East, South, West, North, White, Green, Red)
  '1z': '1', '2z': '2', '3z': '3', '4z': '4', '5z': '5', '6z': '6', '7z': '7',
  
  // m tiles (characters/man)
  '1m': 'q', '2m': 'w', '3m': 'e', '4m': 'r', '5m': 't',
  '6m': 'y', '7m': 'u', '8m': 'i', '9m': 'o',
  
  // p tiles (dots/pin)
  '1p': 'a', '2p': 's', '3p': 'd', '4p': 'f', '5p': 'g',
  '6p': 'h', '7p': 'j', '8p': 'k', '9p': 'l',
  
  // s tiles (bamboo/sou)
  '1s': 'z', '2s': 'x', '3s': 'c', '4s': 'v', '5s': 'b',
  '6s': 'n', '7s': 'm', '8s': ',', '9s': '.'
};
