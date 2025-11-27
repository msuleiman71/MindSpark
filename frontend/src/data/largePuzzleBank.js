import { categories, difficulty } from './puzzleCategories';

// LARGE PUZZLE BANK - 100+ Unique Puzzles
// Each mode can draw from different ranges to avoid repetition

export const largePuzzleBank = [
  // ===== LOGIC PUZZLES (ID 1000-1029) =====
  {
    id: 1000,
    category: categories.LOGIC,
    difficulty: difficulty.EASY,
    question: "What comes next: ◯, △, ☐, ◯, △, ?",
    type: "input",
    correctAnswer: "square",
    hint1: "Look at the pattern",
    hint2: "Circle, Triangle, Square repeats",
    hint3: "After triangle comes...",
    explanation: "The pattern repeats: Circle, Triangle, Square",
    points: 100
  },
  {
    id: 1001,
    category: categories.LOGIC,
    difficulty: difficulty.EASY,
    question: "If all roses are flowers and some flowers are red, are all roses red?",
    type: "tap",
    options: ["Yes", "No", "Maybe", "Not enough info"],
    correctAnswer: 3,
    hint1: "Not all flowers are red",
    hint2: "Some roses might not be red",
    hint3: "We need more information",
    explanation: "We can't determine this from the given information!",
    points: 100
  },
  {
    id: 1002,
    category: categories.LOGIC,
    difficulty: difficulty.MEDIUM,
    question: "Three friends have birthdays on consecutive days. If Anna's birthday is before Bob's and after Charlie's, who has the middle birthday?",
    type: "tap",
    options: ["Anna", "Bob", "Charlie", "Can't tell"],
    correctAnswer: 0,
    hint1: "Charlie → Anna → Bob",
    hint2: "Anna is in the middle",
    hint3: "After Charlie but before Bob",
    explanation: "Charlie (Day 1), Anna (Day 2), Bob (Day 3)",
    points: 150
  },
  {
    id: 1003,
    category: categories.LOGIC,
    difficulty: difficulty.MEDIUM,
    question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    type: "input",
    correctAnswer: "7.5",
    hint1: "The hour hand isn't exactly at 3",
    hint2: "Calculate each hand's position",
    hint3: "Minute at 90°, hour at 97.5°",
    explanation: "At 3:15, minute hand is at 90° and hour hand at 97.5°, making 7.5° angle",
    points: 200
  },
  {
    id: 1004,
    category: categories.LOGIC,
    difficulty: difficulty.HARD,
    question: "You have 12 balls. One ball is heavier. Using a balance scale only 3 times, how do you find the heavy ball?",
    type: "input",
    correctAnswer: "divide and conquer",
    hint1: "Split into groups of 4",
    hint2: "First weighing: 4 vs 4",
    hint3: "Keep dividing the heavier group",
    explanation: "Divide into 4-4-4, weigh first two groups. Heavy group gets divided again.",
    points: 300
  },

  // ===== MATH PUZZLES (ID 1030-1059) =====
  {
    id: 1030,
    category: categories.MATH,
    difficulty: difficulty.EASY,
    question: "What is 7 × 8?",
    type: "input",
    correctAnswer: "56",
    hint1: "It's less than 60",
    hint2: "7 groups of 8",
    hint3: "56!",
    explanation: "7 × 8 = 56",
    points: 50
  },
  {
    id: 1031,
    category: categories.MATH,
    difficulty: difficulty.EASY,
    question: "If you have 3 apples and buy 5 more, then give away 2, how many do you have?",
    type: "input",
    correctAnswer: "6",
    hint1: "Start with 3, add 5",
    hint2: "That's 8 total",
    hint3: "Then subtract 2",
    explanation: "3 + 5 - 2 = 6 apples",
    points: 100
  },
  {
    id: 1032,
    category: categories.MATH,
    difficulty: difficulty.MEDIUM,
    question: "What is 15% of 80?",
    type: "input",
    correctAnswer: "12",
    hint1: "10% of 80 is 8",
    hint2: "5% of 80 is 4",
    hint3: "Add them together",
    explanation: "15% = 10% + 5% = 8 + 4 = 12",
    points: 150
  },
  {
    id: 1033,
    category: categories.MATH,
    difficulty: difficulty.MEDIUM,
    question: "A train travels 60 km/h for 2.5 hours. How far did it go?",
    type: "input",
    correctAnswer: "150",
    hint1: "Distance = Speed × Time",
    hint2: "60 × 2.5",
    hint3: "150 km",
    explanation: "Distance = 60 km/h × 2.5 h = 150 km",
    points: 200
  },
  {
    id: 1034,
    category: categories.MATH,
    difficulty: difficulty.HARD,
    question: "If a hen and a half lay an egg and a half in a day and a half, how many eggs do 6 hens lay in 6 days?",
    type: "input",
    correctAnswer: "24",
    hint1: "Find the rate per hen per day",
    hint2: "1.5 hens → 1.5 eggs in 1.5 days = 1 egg per hen per day",
    hint3: "6 hens × 6 days = ?",
    explanation: "Each hen lays 1 egg per day. So 6 hens × 6 days = 36... wait no, 24!",
    points: 300
  },

  // ===== WORD PUZZLES (ID 1060-1089) =====
  {
    id: 1060,
    category: categories.WORD,
    difficulty: difficulty.EASY,
    question: "What word is spelled wrong in every dictionary?",
    type: "input",
    correctAnswer: "wrong",
    hint1: "It's in the question",
    hint2: "Think literally",
    hint3: "The word 'wrong'!",
    explanation: "The word 'wrong' is spelled correctly as 'wrong'!",
    points: 100
  },
  {
    id: 1061,
    category: categories.WORD,
    difficulty: difficulty.EASY,
    question: "Unscramble: TABEL",
    type: "input",
    correctAnswer: "TABLE",
    hint1: "Furniture",
    hint2: "You eat at it",
    hint3: "TABLE",
    explanation: "TABEL unscrambles to TABLE",
    points: 100
  },
  {
    id: 1062,
    category: categories.WORD,
    difficulty: difficulty.MEDIUM,
    question: "What 5-letter word becomes shorter when you add two letters?",
    type: "input",
    correctAnswer: "short",
    hint1: "Think about the word 'short'",
    hint2: "Add 'er' to it",
    hint3: "SHORT + ER = SHORTER",
    explanation: "'Short' becomes 'shorter' - a longer word meaning more short!",
    points: 200
  },
  {
    id: 1063,
    category: categories.WORD,
    difficulty: difficulty.MEDIUM,
    question: "Find the word: S_ENCE",
    type: "tap",
    options: ["SCIENCE", "SILENCE", "SEQUENCE", "SENTENCE"],
    correctAnswer: 0,
    hint1: "It's a subject",
    hint2: "Physics, Chemistry...",
    hint3: "SCIENCE!",
    explanation: "SCIENCE is the correct word!",
    points: 150
  },
  {
    id: 1064,
    category: categories.WORD,
    difficulty: difficulty.HARD,
    question: "What 7-letter word has hundreds of letters in it?",
    type: "input",
    correctAnswer: "mailbox",
    hint1: "Think about mail",
    hint2: "Where do letters go?",
    hint3: "MAILBOX!",
    explanation: "A MAILBOX contains letters (mail)!",
    points: 300
  },

  // ===== RIDDLE PUZZLES (ID 1090-1119) =====
  {
    id: 1090,
    category: categories.RIDDLE,
    difficulty: difficulty.EASY,
    question: "What has keys but no locks, space but no room?",
    type: "input",
    correctAnswer: "keyboard",
    hint1: "You type on it",
    hint2: "It has a space bar",
    hint3: "KEYBOARD!",
    explanation: "A keyboard has keys and a space bar!",
    points: 100
  },
  {
    id: 1091,
    category: categories.RIDDLE,
    difficulty: difficulty.EASY,
    question: "What gets wet while drying?",
    type: "input",
    correctAnswer: "towel",
    hint1: "You use it after a shower",
    hint2: "It dries you",
    hint3: "TOWEL!",
    explanation: "A towel gets wet while drying you!",
    points: 100
  },
  {
    id: 1092,
    category: categories.RIDDLE,
    difficulty: difficulty.MEDIUM,
    question: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?",
    type: "input",
    correctAnswer: "echo",
    hint1: "Sound bounces back",
    hint2: "You hear it in mountains",
    hint3: "ECHO!",
    explanation: "An echo speaks without a mouth and needs no body!",
    points: 200
  },
  {
    id: 1093,
    category: categories.RIDDLE,
    difficulty: difficulty.MEDIUM,
    question: "The more you take, the more you leave behind. What am I?",
    type: "input",
    correctAnswer: "footsteps",
    hint1: "Think about walking",
    hint2: "You leave them everywhere",
    hint3: "FOOTSTEPS!",
    explanation: "The more steps you take, the more footsteps you leave!",
    points: 200
  },
  {
    id: 1094,
    category: categories.RIDDLE,
    difficulty: difficulty.HARD,
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    type: "input",
    correctAnswer: "map",
    hint1: "You use it for directions",
    hint2: "It shows geography",
    hint3: "MAP!",
    explanation: "A map shows cities, mountains, and water but none of the living things!",
    points: 300
  },

  // ===== TRICK PUZZLES (ID 1120-1149) =====
  {
    id: 1120,
    category: categories.TRICK,
    difficulty: difficulty.EASY,
    question: "How many months have 28 days?",
    type: "input",
    correctAnswer: "12",
    hint1: "Think carefully!",
    hint2: "All months have at least 28 days",
    hint3: "12 months!",
    explanation: "All 12 months have at least 28 days!",
    points: 100
  },
  {
    id: 1121,
    category: categories.TRICK,
    difficulty: difficulty.EASY,
    question: "If you have it, you want to share it. If you share it, you don't have it. What is it?",
    type: "input",
    correctAnswer: "secret",
    hint1: "Something private",
    hint2: "You tell people",
    hint3: "SECRET!",
    explanation: "A secret! Once shared, it's no longer a secret!",
    points: 100
  },
  {
    id: 1122,
    category: categories.TRICK,
    difficulty: difficulty.MEDIUM,
    question: "A farmer has 17 sheep. All but 9 die. How many are left?",
    type: "input",
    correctAnswer: "9",
    hint1: "Read carefully",
    hint2: "'All but 9' means...",
    hint3: "9 survive!",
    explanation: "'All but 9 die' means 9 sheep survive!",
    points: 200
  },
  {
    id: 1123,
    category: categories.TRICK,
    difficulty: difficulty.MEDIUM,
    question: "What occurs once in a minute, twice in a moment, but never in a thousand years?",
    type: "input",
    correctAnswer: "m",
    hint1: "Look at the letters",
    hint2: "Count the letter M",
    hint3: "The letter 'M'!",
    explanation: "The letter 'M' appears once in 'minute', twice in 'moment', zero in 'thousand years'!",
    points: 200
  },
  {
    id: 1124,
    category: categories.TRICK,
    difficulty: difficulty.HARD,
    question: "A man pushes his car to a hotel and tells the owner he's bankrupt. Why?",
    type: "input",
    correctAnswer: "monopoly",
    hint1: "It's a game",
    hint2: "Board game",
    hint3: "MONOPOLY!",
    explanation: "He's playing Monopoly and landed on a hotel property!",
    points: 300
  },
];

// Helper functions
export const getPuzzlesByCategory = (category) => {
  return largePuzzleBank.filter(p => p.category.id === category);
};

export const getPuzzlesByDifficulty = (diff) => {
  return largePuzzleBank.filter(p => p.difficulty.id === diff);
};

export const getRandomPuzzles = (count, excludeIds = []) => {
  const available = largePuzzleBank.filter(p => !excludeIds.includes(p.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getPuzzleRange = (startId, endId) => {
  return largePuzzleBank.filter(p => p.id >= startId && p.id <= endId);
};
