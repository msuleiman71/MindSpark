import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';
import { categories } from '../data/puzzleCategories';
import { getPuzzlesByCategory } from '../data/advancedPuzzles';

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">Categories</h1>
          <div className="w-16 sm:w-24"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Object.values(categories).map((category) => {
            const puzzleCount = getPuzzlesByCategory(category.id).length;
            
            return (
              <Card
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden cursor-pointer hover:scale-105 transform transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${category.color} p-8 sm:p-10 md:p-12 text-center`}>
                  <span className="text-5xl sm:text-6xl md:text-8xl">{category.icon}</span>
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 mb-1 sm:mb-2">{category.name}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4">{puzzleCount} Puzzles</p>
                  <Button className={`w-full h-10 sm:h-12 text-base sm:text-lg font-bold bg-gradient-to-r ${category.color} text-white rounded-xl sm:rounded-2xl`}>
                    Play Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats Card */}
        <Card className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
          <div className="text-center space-y-3 sm:space-y-4">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600 mx-auto" />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800">Master All Categories!</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Complete puzzles from each category to become a MindSpark Champion
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Categories;
