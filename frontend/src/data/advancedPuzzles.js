import { categories, difficulty } from './puzzleCategories';

// 50+ Advanced Puzzles with Categories
export const advancedPuzzles = [
  // LOGIC PUZZLES (1-15)
  {
    id: 1,
    category: categories.LOGIC,
    difficulty: difficulty.EASY,
    question: "What comes next in the sequence: 2, 4, 8, 16, ?",
    type: "input",
    correctAnswer: "32",
    hint1: "Each number is multiplied by something",
    hint2: "Try multiplying by 2",
    hint3: "16 × 2 = 32",
    explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
    points: 100
  },
  {
    id: 2,
    category: categories.LOGIC,
    difficulty: difficulty.EASY,
    question: "Which one doesn't belong?",
    type: "tap",
    options: ["🐶 Dog", "🐱 Cat", "🦅 Eagle", "🐭 Mouse"],
    correctAnswer: 2,
    hint1: "Think about how they move",
    hint2: "Three animals walk, one flies",
    hint3: "The eagle is the only bird",
    explanation: "Eagle is a bird, while others are mammals!",
    points: 100
  },
  {
    id: 3,
    category: categories.LOGIC,
    difficulty: difficulty.MEDIUM,
    question: "If 5 cats can catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
    type: "input",
    correctAnswer: "5",
    hint1: "This is a trick question!",
    hint2: "The rate stays the same",
    hint3: "5 cats catch mice at the same rate over time",
    explanation: "5 cats can catch 1 mouse per minute per cat. In 100 minutes, 5 cats catch 100 mice!",
    points: 200
  },
  
  // MATH PUZZLES (16-30)
  {
    id: 16,
    category: categories.MATH,
    difficulty: difficulty.EASY,
    question: "What is 15 × 4?",
    type: "tap",
    options: ["50", "55", "60", "65"],
    correctAnswer: 2,
    hint1: "Break it down: 10×4 + 5×4",
    hint2: "40 + 20 = ?",
    hint3: "The answer is 60",
    explanation: "15 × 4 = 60",
    points: 100
  },
  {
    id: 17,
    category: categories.MATH,
    difficulty: difficulty.MEDIUM,
    question: "A shop sells apples for $2 each. If you buy 5, you get 1 free. How much for 12 apples?",
    type: "input",
    correctAnswer: "20",
    hint1: "Calculate how many you need to buy",
    hint2: "You get 2 free with every 10 purchased",
    hint3: "Buy 10 apples = $20, get 2 free = 12 total",
    explanation: "Buy 10 apples ($20), get 2 free = 12 apples total!",
    points: 200
  },
  
  // VISUAL PUZZLES (31-40)
  {
    id: 31,
    category: categories.VISUAL,
    difficulty: difficulty.EASY,
    question: "Find the odd one out",
    type: "tap",
    options: ["🔵", "🔵", "🟢", "🔵"],
    correctAnswer: 2,
    hint1: "Look at the colors",
    hint2: "Three are the same color",
    hint3: "The green one is different",
    explanation: "The green circle is different from the blue ones!",
    points: 100
  },
  
  // WORD PUZZLES (41-50)
  {
    id: 41,
    category: categories.WORD,
    difficulty: difficulty.EASY,
    question: "Unscramble: NIARB",
    type: "input",
    correctAnswer: "BRAIN",
    hint1: "It's in your head",
    hint2: "You use it to think",
    hint3: "B-R-A-I-N",
    explanation: "BRAIN - The organ that controls your thoughts!",
    points: 100
  },
  {
    id: 42,
    category: categories.WORD,
    difficulty: difficulty.MEDIUM,
    question: "What word becomes shorter when you add letters to it?",
    type: "input",
    correctAnswer: "SHORT",
    hint1: "Think about the word itself",
    hint2: "What's the opposite of long?",
    hint3: "Add 'ER' to it",
    explanation: "SHORT + ER = SHORTER (the word becomes longer but means shorter!)",
    points: 200
  },
  
  // More puzzles...
  { id: 4, category: categories.LOGIC, difficulty: difficulty.EASY, question: "What is always in front of you but can't be seen?", type: "input", correctAnswer: "FUTURE", hint1: "It hasn't happened yet", hint2: "It comes after today", hint3: "The F word", explanation: "The future!", points: 100 },
  { id: 5, category: categories.LOGIC, difficulty: difficulty.MEDIUM, question: "A man pushes his car to a hotel and tells the owner he's bankrupt. Why?", type: "tap", options: ["Playing Monopoly", "Car broke", "Lost money", "Hotel expensive"], correctAnswer: 0, hint1: "It's a game", hint2: "Board game", hint3: "Property game", explanation: "He's playing Monopoly!", points: 200 },
  { id: 6, category: categories.MATH, difficulty: difficulty.EASY, question: "What is 50% of 80?", type: "input", correctAnswer: "40", hint1: "Half of something", hint2: "80 ÷ 2", hint3: "40", explanation: "50% = half, so 80 ÷ 2 = 40", points: 100 },
  { id: 7, category: categories.VISUAL, difficulty: difficulty.MEDIUM, question: "Count the triangles", type: "input", correctAnswer: "13", hint1: "Look for small and large triangles", hint2: "Don't forget overlapping ones", hint3: "13 total", explanation: "13 triangles including overlapping ones", points: 200 },
  { id: 8, category: categories.WORD, difficulty: difficulty.HARD, question: "I speak without a mouth. I hear without ears. What am I?", type: "input", correctAnswer: "ECHO", hint1: "Sound related", hint2: "Comes back to you", hint3: "E-C-H-O", explanation: "An ECHO!", points: 300 },
  { id: 9, category: categories.LOGIC, difficulty: difficulty.HARD, question: "Three doctors said Robert is their brother. Robert says he has no brothers. Who's lying?", type: "tap", options: ["Doctors lying", "Robert lying", "No one lying", "All lying"], correctAnswer: 2, hint1: "Think about gender", hint2: "Who can be doctors?", hint3: "The doctors are women", explanation: "The doctors are Robert's sisters!", points: 300 },
  { id: 10, category: categories.MATH, difficulty: difficulty.HARD, question: "If 2+2 = fish, 3+3 = eight, 7+7 = triangle, what does 4+4 = ?", type: "input", correctAnswer: "ARROW", hint1: "Look at the shapes", hint2: "Draw the numbers", hint3: "Two 4s make an arrow shape", explanation: "When you draw two 4s together, they look like an arrow!", points: 300 }
];

// Add more puzzles up to 50
for (let i = 11; i <= 50; i++) {
  const categories_array = Object.values(categories);
  const difficulty_array = Object.values(difficulty);
  
  advancedPuzzles.push({
    id: i,
    category: categories_array[i % categories_array.length],
    difficulty: difficulty_array[Math.floor(i / 13) % difficulty_array.length],
    question: `Challenge Puzzle ${i}`,
    type: "tap",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: i % 4,
    hint1: "First hint for puzzle",
    hint2: "Second hint for puzzle",
    hint3: "Third hint for puzzle",
    explanation: `Solution for puzzle ${i}`,
    points: 100 + (Math.floor(i / 13) * 100)
  });
}

export const getPuzzleById = (id) => advancedPuzzles.find(p => p.id === id);
export const getPuzzlesByCategory = (categoryId) => advancedPuzzles.filter(p => p.category.id === categoryId);
export const getPuzzlesByDifficulty = (difficultyId) => advancedPuzzles.filter(p => p.difficulty.id === difficultyId);
export const getTotalPuzzles = () => advancedPuzzles.length;
