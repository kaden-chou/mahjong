// Base combinations (7-tile Chinitsu combinations)

// Each combination has an index, pattern string, reversible flag, valid range, and associated wait numbers
// const COMBINATIONS = [
//   { index: 1, pattern: "1234567", reversible: false, range: [1, 9], wait: [1, 4, 7] },
//   { index: 2, pattern: "1234456", reversible: true, range: [1, 8], wait: [1, 4, 7] },
//   { index: 3, pattern: "2223456", reversible: true, range: [2, 8], wait: [1, 3, 4, 6, 7] }
// ];
const COMBINATIONS = [
  { index: 1, pattern: "1234456", reversible: true, range: [1, 8], wait: [1, 4, 7] },
  { index: 2, pattern: "1234567", reversible: false, range: [1, 9], wait: [1, 4, 7] },
  { index: 3, pattern: "1112334", reversible: true, range: [1, 8], wait: [2, 3, 5] },
  { index: 4, pattern: "1113456", reversible: true, range: [1, 9], wait: [2, 3, 6] },
  { index: 5, pattern: "1113345", reversible: true, range: [1, 9], wait: [2, 3, 6] },
  { index: 6, pattern: "1113555", reversible: true, range: [1, 9], wait: [2, 3, 4] },
  { index: 7, pattern: "1122233", reversible: true, range: [1, 9], wait: [1, 2, 3] },
  { index: 8, pattern: "1123333", reversible: true, range: [1, 8], wait: [1, 2, 4] },
  { index: 9, pattern: "2345556", reversible: true, range: [2, 8], wait: [1, 4, 6, 7] },
  { index: 10, pattern: "1112223", reversible: true, range: [1, 8], wait: [1, 2, 3, 4] },
  { index: 11, pattern: "1112233", reversible: true, range: [1, 8], wait: [1, 2, 3, 4] },
  { index: 12, pattern: "2223345", reversible: true, range: [2, 8], wait: [1, 3, 4, 6] },
  { index: 13, pattern: "2233334", reversible: true, range: [2, 8], wait: [1, 2, 4, 5] },
  { index: 14, pattern: "2333345", reversible: true, range: [2, 9], wait: [1, 2, 4, 5] },
  { index: 15, pattern: "2223456", reversible: true, range: [2, 8], wait: [1, 3, 4, 6, 7] },
  { index: 16, pattern: "2223444", reversible: true, range: [2, 8], wait: [1, 2, 3, 4, 5] },
  { index: 17, pattern: "2334445", reversible: true, range: [2, 9], wait: [1, 4] },
  { index: 18, pattern: "1223344", reversible: true, range: [1, 9], wait: [1, 4] },
  { index: 19, pattern: "1112346", reversible: true, range: [1, 9], wait: [5, 6] }
];

/**
 * Reverses a combination by inverting each digit: x -> 10 - x
 */
function reverseCombination(combo) {
  return combo.split('').map(d => {
    const num = parseInt(d, 10);
    return 10 - num;
  }).join('');
}

// Seeded random number generator
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Randomizes a combination by:
 * 1. Shifting all digits to a random position within the specified range
 * 2. Optionally reversing the shifted result
 * 3. Returning result sorted in ascending order
 */
function randomizeCombination(combo, shouldReverse = false, seed = null) {
  let result = combo.pattern;
  
  // Get min and max digits in the base pattern
  const minDigit = Math.min(...result.split('').map(Number));
  const maxDigit = Math.max(...result.split('').map(Number));
  
  // Get the valid range for this combination
  const [rangeMin, rangeMax] = combo.range;
  
  // Calculate the valid shift range to keep digits within [rangeMin, rangeMax]
  const minShift = rangeMin - minDigit;
  const maxShift = rangeMax - maxDigit;
  
  // Random shift within valid range
  let randomVal;
  if (seed !== null) {
    randomVal = seededRandom(seed);
  } else {
    randomVal = Math.random();
  }
  const shift = minShift + Math.floor(randomVal * (maxShift - minShift + 1));
  
  // Apply shift to each digit
  result = result.split('').map(d => {
    const num = parseInt(d, 10);
    return num + shift;
  }).join('');
  
  // Now optionally reverse the shifted result
  if (shouldReverse) {
    result = reverseCombination(result);
  }
  
  // Sort digits in ascending order
  const digits = result.split('').sort((a, b) => a - b);
  
  return digits.join('');
}

/**
 * Gets all 3 combinations randomized (with random reversal for reversible ones).
 * Returns an array of 3 randomized combinations.
 */
function getAllRandomCombinations() {
  return COMBINATIONS.map(combo => {
    // Randomly decide to reverse if the pattern is reversible
    const shouldReverse = combo.reversible && Math.random() < 0.5;
    return randomizeCombination(combo, shouldReverse);
  });
}

/**
 * Shuffles an array using a seed for deterministic randomization.
 */
function shuffleArray(arr, seed = null) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let randVal;
    if (seed !== null) {
      randVal = seededRandom(seed + i);
    } else {
      randVal = Math.random();
    }
    const j = Math.floor(randVal * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gets both the randomized pattern and transformed wait numbers (using same shift/reverse for both).
 * Returns an object with { pattern, waitNumbers }
 */
function getRandomizedComboWithWait(combo, seed = null) {
  // Decide shift and reverse for this combo using seed if provided
  let reverseRand;
  if (seed !== null) {
    reverseRand = seededRandom(seed * 2);
  } else {
    reverseRand = Math.random();
  }
  const shouldReverse = combo.reversible && reverseRand < 0.5;
  
  // Get min and max digits in the base pattern to calculate shift
  const minDigit = Math.min(...combo.pattern.split('').map(Number));
  const maxDigit = Math.max(...combo.pattern.split('').map(Number));
  
  // Get the valid range for this combination
  const [rangeMin, rangeMax] = combo.range;
  
  // Calculate the valid shift range
  const minShift = rangeMin - minDigit;
  const maxShift = rangeMax - maxDigit;
  
  // Random shift within valid range
  let shiftRand;
  if (seed !== null) {
    shiftRand = seededRandom(seed * 3);
  } else {
    shiftRand = Math.random();
  }
  const shift = minShift + Math.floor(shiftRand * (maxShift - minShift + 1));
  
  // Transform pattern
  let pattern = combo.pattern.split('').map(d => {
    const num = parseInt(d, 10);
    return num + shift;
  }).join('');
  
  if (shouldReverse) {
    pattern = reverseCombination(pattern);
  }
  
  const patternDigits = pattern.split('').sort((a, b) => a - b);
  const sortedPattern = patternDigits.join('');
  
  // Transform wait numbers with same shift and reverse
  let waitNums = [...combo.wait];
  waitNums = waitNums.map(num => num + shift);
  
  if (shouldReverse) {
    waitNums = waitNums.map(num => 10 - num);
  }
  
  waitNums.sort((a, b) => a - b);
  
  return { pattern: sortedPattern, waitNumbers: waitNums };
}
