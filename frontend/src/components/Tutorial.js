import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const tutorialSteps = [
  {
    title: 'Welcome to MindSpark! 🧠',
    description: 'Get ready to challenge your brain with 50+ amazing puzzles across 7 categories!',
    image: '🎉'
  },
  {
    title: 'Solve Puzzles 🧩',
    description: 'Each puzzle tests different skills: logic, math, visual perception, and more. Tap, drag, or type your answers!',
    image: '🎯'
  },
  {
    title: 'Earn Stars & Coins ⭐',
    description: 'Complete puzzles quickly for 3 stars! Earn coins to buy power-ups and hints.',
    image: '💰'
  },
  {
    title: 'Daily Challenges 🔥',
    description: 'Complete daily challenges to maintain your streak and earn bonus rewards!',
    image: '🏆'
  },
  {
    title: 'Compete & Share 🎮',
    description: 'Climb the leaderboard, challenge friends, and share your achievements!',
    image: '🚀'
  }
];

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(!localStorage.getItem('tutorialCompleted'));

  if (!show) return null;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setShow(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          <div className="text-9xl">{step.image}</div>
          <h2 className="text-4xl font-black text-gray-800">{step.title}</h2>
          <p className="text-xl text-gray-600">{step.description}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 my-8">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-purple-600 w-8'
                  : index < currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            variant="outline"
            className="h-12 px-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleSkip}
            variant="ghost"
            className="text-gray-600"
          >
            Skip Tutorial
          </Button>

          <Button
            onClick={handleNext}
            className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {currentStep === tutorialSteps.length - 1 ? "Let's Go!" : 'Next'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
