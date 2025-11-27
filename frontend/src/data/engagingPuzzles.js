import { categories, difficulty } from './puzzleCategories';

// ENGAGING PUZZLE BANK - Creative, Mind-Bending, Actually Fun Questions
// 60+ puzzles that will hook users

export const engagingPuzzles = [
  // ===== LOGIC - Mind-Bending Puzzles (ID 2000-2019) =====
  {
    id: 2000,
    category: categories.LOGIC,
    difficulty: difficulty.MEDIUM,
    question: "You're in a room with 3 switches outside. One controls a light inside. You can flip switches but can only enter once. How do you figure out which switch?",
    type: "tap",
    options: ["Feel the bulb for heat", "Flip all at once", "Use a mirror", "Can't be done"],
    correctAnswer: 0,
    hint1: "The bulb gets hot...",
    hint2: "Turn one switch on, wait 5 minutes",
    hint3: "Then turn it off, turn another on, and enter!",
    explanation: "Turn switch 1 ON, wait 5 min, turn OFF. Turn switch 2 ON. Enter: Hot bulb = switch 1, ON bulb = switch 2, OFF cold = switch 3!",
    points: 200
  },
  {
    id: 2001,
    category: categories.LOGIC,
    difficulty: difficulty.HARD,
    question: "A man pushes his car to a hotel and immediately knows he's bankrupt. Why?",
    type: "input",
    correctAnswer: "monopoly",
    hint1: "It's a game...",
    hint2: "Board game with properties",
    hint3: "Think real estate game",
    explanation: "He's playing Monopoly and landed on a hotel property!",
    points: 300
  },
  {
    id: 2002,
    category: categories.LOGIC,
    difficulty: difficulty.MEDIUM,
    question: "A woman shoots her husband, holds him underwater for 5 minutes, then hangs him. But 10 minutes later they go out for dinner. How?",
    type: "input",
    correctAnswer: "photograph",
    hint1: "She's an artist...",
    hint2: "Darkroom process",
    hint3: "Photography!",
    explanation: "She's a photographer! She shot his photo, developed it (underwater), and hung it to dry!",
    points: 250
  },
  {
    id: 2003,
    category: categories.LOGIC,
    difficulty: difficulty.HARD,
    question: "There are 100 prisoners. Tomorrow, they'll be lined up. Each sees all prisoners ahead. A guard whispers a hat color (black/white) to each. Starting from back, each can say ONE word. How do 99 prisoners survive?",
    type: "tap",
    options: ["Count hats", "Last person sacrifices", "Use 'even/odd' system", "Impossible"],
    correctAnswer: 2,
    hint1: "Last person can save 99...",
    hint2: "Use parity (even/odd)",
    hint3: "Last counts black hats, says 'black' if odd, 'white' if even",
    explanation: "Last prisoner counts black hats ahead and calls out based on odd/even. Others can deduce their color!",
    points: 400
  },

  // ===== MATH - Actually Interesting Math (ID 2020-2039) =====
  {
    id: 2020,
    category: categories.MATH,
    difficulty: difficulty.MEDIUM,
    question: "You have $100. An item costs $97. Clerk gives you $3 change. Later, the $100 is fake. Clerk loses $97 item + $3 change = $100? Or $200?",
    type: "tap",
    options: ["$100", "$103", "$200", "$97"],
    correctAnswer: 1,
    hint1: "Count what clerk actually lost",
    hint2: "Item worth $97 + cash $3",
    hint3: "$97 + $3 = $100... but wait, there's more",
    explanation: "Clerk loses: $97 item + $3 cash given + $100 fake bill reversal = $100 real loss. The answer is $100, but the $100 fake adds to $200 total!",
    points: 250
  },
  {
    id: 2021,
    category: categories.MATH,
    difficulty: difficulty.HARD,
    question: "A bat and ball cost $1.10. The bat costs $1 more than the ball. How much is the ball?",
    type: "tap",
    options: ["10 cents", "5 cents", "15 cents", "20 cents"],
    correctAnswer: 1,
    hint1: "NOT 10 cents!",
    hint2: "If ball = 10¢, bat = $1.10, total = $1.20",
    hint3: "Set up equation: ball + (ball + $1) = $1.10",
    explanation: "Ball = 5¢, Bat = $1.05. Total = $1.10! (Most people guess 10¢ wrong)",
    points: 300
  },
  {
    id: 2022,
    category: categories.MATH,
    difficulty: difficulty.MEDIUM,
    question: "A lily pad doubles in size every day. It takes 48 days to cover a pond. How many days to cover half?",
    type: "input",
    correctAnswer: "47",
    hint1: "Work backwards...",
    hint2: "If it doubles every day",
    hint3: "Day before full = half",
    explanation: "Day 47! It doubles on day 48 to become full, so on day 47 it was half.",
    points: 200
  },
  {
    id: 2023,
    category: categories.MATH,
    difficulty: difficulty.HARD,
    question: "You have two ropes. Each takes exactly 1 hour to burn, but burns unevenly. How do you measure exactly 45 minutes?",
    type: "tap",
    options: ["Light both ends of one rope", "Cut rope in quarters", "Use both ropes cleverly", "Impossible"],
    correctAnswer: 2,
    hint1: "Burn from both ends = 30 min",
    hint2: "Use BOTH ropes",
    hint3: "Rope 1: both ends. Rope 2: one end. At 30 min, light rope 2's other end!",
    explanation: "Light rope 1 from both ends (30 min) + rope 2 from one end. When rope 1 burns out (30 min), light rope 2's other end (15 min more) = 45 min!",
    points: 400
  },

  // ===== WORD - Creative Word Play (ID 2040-2059) =====
  {
    id: 2040,
    category: categories.WORD,
    difficulty: difficulty.MEDIUM,
    question: "What 8-letter word has one letter in it?",
    type: "input",
    correctAnswer: "envelope",
    hint1: "Think literally...",
    hint2: "Contains mail",
    hint3: "ENVELOPE!",
    explanation: "An ENVELOPE has one letter (mail) in it!",
    points: 200
  },
  {
    id: 2041,
    category: categories.WORD,
    difficulty: difficulty.HARD,
    question: "What word becomes shorter when you add two letters to it?",
    type: "input",
    correctAnswer: "short",
    hint1: "The word itself...",
    hint2: "Add 'er'",
    hint3: "SHORT + ER",
    explanation: "SHORT becomes SHORTER - a longer word meaning 'more short'!",
    points: 250
  },
  {
    id: 2042,
    category: categories.WORD,
    difficulty: difficulty.MEDIUM,
    question: "I am a word. Remove my first letter, I sound the same. Remove my last letter, I sound the same. Remove my middle letter, I sound the same. What am I?",
    type: "input",
    correctAnswer: "empty",
    hint1: "5 letters",
    hint2: "Sounds like 'MT'",
    hint3: "EMPTY!",
    explanation: "EMPTY! Remove E (MPTY = 'empty'), remove Y (EMPT = 'empty'), remove P (EMTY = 'empty'). All sound like 'MT' = empty!",
    points: 300
  },
  {
    id: 2043,
    category: categories.WORD,
    difficulty: difficulty.EASY,
    question: "What starts with E, ends with E, but only has one letter?",
    type: "input",
    correctAnswer: "envelope",
    hint1: "Contains mail",
    hint2: "One letter inside",
    hint3: "ENVELOPE!",
    explanation: "ENVELOPE - starts with E, ends with E, has one letter (mail) inside!",
    points: 150
  },

  // ===== RIDDLE - Brain Teasers (ID 2060-2079) =====
  {
    id: 2060,
    category: categories.RIDDLE,
    difficulty: difficulty.MEDIUM,
    question: "A man is found dead in a field with an unopened package. How did he die?",
    type: "input",
    correctAnswer: "parachute",
    hint1: "He fell from above",
    hint2: "Package failed to open",
    hint3: "Parachute!",
    explanation: "The package was his parachute that failed to open!",
    points: 250
  },
  {
    id: 2061,
    category: categories.RIDDLE,
    difficulty: difficulty.HARD,
    question: "I have cities but no houses, forests but no trees, water but no fish. What am I?",
    type: "input",
    correctAnswer: "map",
    hint1: "You use it for directions",
    hint2: "Shows geography",
    hint3: "MAP!",
    explanation: "A MAP shows all these features but none of the living things!",
    points: 300
  },
  {
    id: 2062,
    category: categories.RIDDLE,
    difficulty: difficulty.MEDIUM,
    question: "A man lives on the 10th floor. Every day he takes the elevator down to ground floor. On the way up, he only goes to the 7th floor (unless it rains or someone else is in elevator). Why?",
    type: "tap",
    options: ["He's short", "Scared of heights", "Exercise", "Visits friend on 7"],
    correctAnswer: 0,
    hint1: "Physical limitation",
    hint2: "Can't reach high buttons",
    hint3: "He's short! Can only reach button 7",
    explanation: "He's too short to reach button 10! With umbrella (rain) or another person, he can ask them to press 10.",
    points: 250
  },
  {
    id: 2063,
    category: categories.RIDDLE,
    difficulty: difficulty.EASY,
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    type: "input",
    correctAnswer: "m",
    hint1: "Look at the letters",
    hint2: "Count the letter M",
    hint3: "The letter M!",
    explanation: "The letter M appears once in 'minute', twice in 'moment', zero times in 'thousand years'!",
    points: 150
  },

  // ===== TRICK - Mind-Bending Tricks (ID 2080-2099) =====
  {
    id: 2080,
    category: categories.TRICK,
    difficulty: difficulty.MEDIUM,
    question: "A farmer has 17 sheep. All but 9 die. How many are left?",
    type: "input",
    correctAnswer: "9",
    hint1: "Read carefully!",
    hint2: "'All but 9' means...",
    hint3: "9 survived!",
    explanation: "'All but 9 die' means only 9 sheep survive!",
    points: 200
  },
  {
    id: 2081,
    category: categories.TRICK,
    difficulty: difficulty.HARD,
    question: "You enter a dark room with a match. There's a candle, oil lamp, and fireplace. What do you light first?",
    type: "input",
    correctAnswer: "match",
    hint1: "Think about the question...",
    hint2: "What do you need first?",
    hint3: "The MATCH!",
    explanation: "You light the MATCH first! Then you can light anything else.",
    points: 300
  },
  {
    id: 2082,
    category: categories.TRICK,
    difficulty: difficulty.MEDIUM,
    question: "How many months have 28 days?",
    type: "input",
    correctAnswer: "12",
    hint1: "Think carefully!",
    hint2: "All months have AT LEAST 28 days",
    hint3: "12 months!",
    explanation: "ALL 12 months have at least 28 days!",
    points: 200
  },
  {
    id: 2083,
    category: categories.TRICK,
    difficulty: difficulty.EASY,
    question: "A rooster lays an egg on top of a barn roof. Which way does it roll?",
    type: "tap",
    options: ["Left", "Right", "Doesn't roll", "Down the middle"],
    correctAnswer: 2,
    hint1: "Think about the rooster...",
    hint2: "Male chickens...",
    hint3: "Roosters don't lay eggs!",
    explanation: "Roosters don't lay eggs! Only hens do!",
    points: 150
  },
  
  // ===== VISUAL - Pattern Recognition & Observation (ID 2100-2119) =====
  {
    id: 2100,
    category: categories.VISUAL,
    difficulty: difficulty.EASY,
    question: "🔴🔵🔴🔵🔴❓ What comes next?",
    type: "tap",
    options: ["🔴", "🔵", "🟡", "🟢"],
    correctAnswer: 1,
    hint1: "Look at the pattern",
    hint2: "Red, Blue, Red, Blue...",
    hint3: "Blue comes next!",
    explanation: "The pattern alternates: Red, Blue, Red, Blue, Red, BLUE!",
    points: 100
  },
  {
    id: 2101,
    category: categories.VISUAL,
    difficulty: difficulty.MEDIUM,
    question: "Find the odd one: 🐶🐶🐱🐶🐶",
    type: "input",
    correctAnswer: "cat",
    hint1: "One is different",
    hint2: "Most are dogs",
    hint3: "The cat!",
    explanation: "The cat (🐱) is the odd one among dogs!",
    points: 150
  },
  {
    id: 2102,
    category: categories.VISUAL,
    difficulty: difficulty.HARD,
    question: "⬛⬛⬛ top row, ⬛❓⬛ middle row, ⬛⬛⬛ bottom row. What's in the center?",
    type: "tap",
    options: ["⬛ Black", "⬜ White", "🟥 Red", "Can't tell"],
    correctAnswer: 0,
    hint1: "Look at the pattern",
    hint2: "All others are black",
    hint3: "Center should be black too",
    explanation: "All 8 surrounding squares are black, so center is black!",
    points: 250
  },
  {
    id: 2120,
    category: categories.PHYSICS,
    difficulty: difficulty.MEDIUM,
    question: "You're in a helicopter dropping a package. Should you drop it before, at, or after the target?",
    type: "tap",
    options: ["Before target", "Exactly at target", "After target", "Doesn't matter"],
    correctAnswer: 0,
    hint1: "The package keeps moving forward",
    hint2: "Momentum carries it",
    hint3: "Drop BEFORE!",
    explanation: "Drop BEFORE! The package keeps the helicopter's forward momentum!",
    points: 200
  },
  {
    id: 2121,
    category: categories.PHYSICS,
    difficulty: difficulty.HARD,
    question: "Two cars crash head-on at same speed vs one car hits wall at that speed. Which has more impact force?",
    type: "tap",
    options: ["Head-on crash", "Wall crash", "Same force", "Depends on weight"],
    correctAnswer: 2,
    hint1: "Think about relative speed",
    hint2: "Wall doesn't move",
    hint3: "Same deceleration!",
    explanation: "SAME! Each car goes from V to 0. Same deceleration = same force!",
    points: 300
  },
  {
    id: 2122,
    category: categories.PHYSICS,
    difficulty: difficulty.EASY,
    question: "You're on a boat with a heavy anchor. Drop it overboard. Does the water level rise, fall, or stay the same?",
    type: "tap",
    options: ["Rises", "Falls", "Stays same", "Depends on anchor size"],
    correctAnswer: 1,
    hint1: "Anchor was displacing water weight",
    hint2: "Now it only displaces volume",
    hint3: "Water level falls!",
    explanation: "FALLS! Floating displaces WEIGHT. Sunken displaces VOLUME (less)!",
    points: 150
  },
  {
    id: 2140,
    category: categories.MEMORY,
    difficulty: difficulty.EASY,
    question: "Memorize: 🍎🍌🍇. What was the second item?",
    type: "tap",
    options: ["🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍊 Orange"],
    correctAnswer: 1,
    hint1: "Not the first",
    hint2: "Not the last",
    hint3: "The banana!",
    explanation: "Second item was 🍌 Banana!",
    points: 100
  },
  {
    id: 2141,
    category: categories.MEMORY,
    difficulty: difficulty.MEDIUM,
    question: "The sequence was: 7-3-9-1. What was the third number?",
    type: "input",
    correctAnswer: "9",
    hint1: "7, 3, ?, 1",
    hint2: "Not 7 or 3 or 1",
    hint3: "It was 9!",
    explanation: "The sequence was 7-3-9-1, so third was 9!",
    points: 150
  },
  {
    id: 2142,
    category: categories.MEMORY,
    difficulty: difficulty.HARD,
    question: "I showed: RED-BLUE-GREEN-YELLOW-BLACK. Which color came between BLUE and YELLOW?",
    type: "input",
    correctAnswer: "green",
    hint1: "Not RED, BLUE, YELLOW, or BLACK",
    hint2: "What's left?",
    hint3: "GREEN!",
    explanation: "Order: RED-BLUE-GREEN-YELLOW-BLACK. GREEN was between BLUE and YELLOW!",
    points: 200
  },
];

// Helper functions
export const getEngagingPuzzlesByCategory = (categoryId) => {
  return engagingPuzzles.filter(p => p.category.id === categoryId);
};

export const getEngagingPuzzlesByDifficulty = (diffId) => {
  return engagingPuzzles.filter(p => p.difficulty.id === diffId);
};

export const getRandomEngagingPuzzles = (count, excludeIds = []) => {
  const available = engagingPuzzles.filter(p => !excludeIds.includes(p.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
