// Brain Test Puzzle Data
export const puzzles = [
  {
    id: 1,
    question: "What is the biggest number?",
    type: "tap",
    options: ["999", "100", "9999", "1"],
    correctAnswer: 2,
    hint: "Look for the number with the most digits!",
    explanation: "9999 is the biggest number!"
  },
  {
    id: 2,
    question: "Help the cat get the fish!",
    type: "drag",
    hint: "Move the cat towards the fish",
    explanation: "Drag the cat to the fish!"
  },
  {
    id: 3,
    question: "How many holes are there in the shirt?",
    type: "input",
    correctAnswer: "8",
    hint: "Don't forget the holes for the head, arms, and bottom!",
    explanation: "2 arm holes + 1 head hole + 1 bottom hole + 4 visible holes = 8 holes"
  },
  {
    id: 4,
    question: "Which one is the biggest?",
    type: "tap",
    options: ["🐘", "🐭", "🦁", "🐻"],
    correctAnswer: 0,
    hint: "Think about real life sizes!",
    explanation: "The elephant is the biggest animal!"
  },
  {
    id: 5,
    question: "Tap the animals from smallest to biggest",
    type: "sequence",
    sequence: ["🐜", "🐭", "🐰", "🐻", "🐘"],
    hint: "Start with the smallest creature",
    explanation: "Ant → Mouse → Rabbit → Bear → Elephant"
  },
  {
    id: 6,
    question: "Find the panda",
    type: "find",
    items: ["🐼", "🐶", "🐱", "🐹", "🐰", "🐨", "🐻", "🦊"],
    correctAnswer: 0,
    hint: "Look for black and white!",
    explanation: "There's the panda!"
  },
  {
    id: 7,
    question: "How many squares are there?",
    type: "input",
    correctAnswer: "5",
    hint: "Count all squares including the overlapping ones!",
    explanation: "There are 5 squares in total!"
  },
  {
    id: 8,
    question: "Make the equation correct: 5+5+5=550",
    type: "trick",
    hint: "Try adding a line to make 545+5=550",
    explanation: "Add a line to one plus sign to make 545+5=550"
  },
  {
    id: 9,
    question: "Which monkey is cuter?",
    type: "tap",
    options: ["🐵", "🙈", "🙉"],
    correctAnswer: -1,
    hint: "All monkeys are cute!",
    explanation: "All of them are cute! Tap any to proceed."
  },
  {
    id: 10,
    question: "Wake up the owl!",
    type: "shake",
    hint: "Try moving the sun away!",
    explanation: "Drag the sun off the screen to make it night!"
  },
  {
    id: 11,
    question: "How many apples are on the tree?",
    type: "interactive",
    hint: "Shake the tree to see all apples!",
    explanation: "Shake the tree first, then count!"
  },
  {
    id: 12,
    question: "Which one is different?",
    type: "tap",
    options: ["🔴", "🔴", "🟠", "🔴"],
    correctAnswer: 2,
    hint: "Look carefully at the colors",
    explanation: "The orange circle is different!"
  },
  {
    id: 13,
    question: "Help the rabbit win the race!",
    type: "trick",
    hint: "Stop the other animals from moving!",
    explanation: "Hold your finger on the other animals!"
  },
  {
    id: 14,
    question: "Put the shapes in the correct holes",
    type: "match",
    shapes: ["⭐", "●", "■", "▲"],
    hint: "Match each shape with its hole",
    explanation: "Drag each shape to its matching hole!"
  },
  {
    id: 15,
    question: "Where is the green apple?",
    type: "trick",
    hint: "Mix the colors!",
    explanation: "Drag the blue and yellow apples together to make green!"
  }
];

export const getTotalLevels = () => puzzles.length;

export const getPuzzle = (id) => puzzles.find(p => p.id === id);
