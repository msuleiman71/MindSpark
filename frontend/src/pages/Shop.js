import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Coins, Lightbulb, Zap, ShoppingCart } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Shop = () => {
  const navigate = useNavigate();
  const { coins, buyPowerUp, setHints, hints } = useGame();

  const shopItems = [
    {
      id: 'hints_5',
      name: '5 Hints',
      icon: '💡',
      description: 'Get 5 extra hints to solve puzzles',
      price: 50,
      type: 'hints',
      amount: 5,
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'hints_10',
      name: '10 Hints',
      icon: '💡',
      description: 'Get 10 extra hints to solve puzzles',
      price: 90,
      type: 'hints',
      amount: 10,
      gradient: 'from-yellow-500 to-orange-600',
      badge: 'BEST VALUE'
    },
    {
      id: 'skip_1',
      name: 'Skip Level',
      icon: '⏭️',
      description: 'Skip any difficult level instantly',
      price: 100,
      type: 'skipLevel',
      amount: 1,
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'skip_3',
      name: '3 Skip Levels',
      icon: '⏭️',
      description: 'Skip 3 difficult levels',
      price: 250,
      type: 'skipLevel',
      amount: 3,
      gradient: 'from-blue-500 to-cyan-600',
      badge: 'POPULAR'
    },
    {
      id: 'freeze_1',
      name: 'Freeze Timer',
      icon: '❄️',
      description: 'Stop the timer for one level',
      price: 80,
      type: 'freezeTimer',
      amount: 1,
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 'freeze_3',
      name: '3 Freeze Timers',
      icon: '❄️',
      description: 'Stop the timer for 3 levels',
      price: 200,
      type: 'freezeTimer',
      amount: 3,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'extra_hints_3',
      name: '3 Extra Hints',
      icon: '🌟',
      description: 'Power-up hints for tough puzzles',
      price: 120,
      type: 'extraHints',
      amount: 3,
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'mega_pack',
      name: 'Mega Pack',
      icon: '🎁',
      description: '10 hints + 2 skips + 2 freeze',
      price: 300,
      type: 'mega',
      gradient: 'from-red-400 to-rose-500',
      badge: 'HOT DEAL'
    }
  ];

  const handlePurchase = (item) => {
    if (coins >= item.price) {
      if (item.type === 'hints') {
        setHints(hints + item.amount);
        buyPowerUp('extraHints', item.price - item.price); // Just spend coins
        toast({
          title: 'Purchase Successful! 🎉',
          description: `You got ${item.amount} hints!`,
        });
      } else if (item.type === 'mega') {
        setHints(hints + 10);
        buyPowerUp('skipLevel', 0);
        buyPowerUp('skipLevel', 0);
        buyPowerUp('freezeTimer', 0);
        buyPowerUp('freezeTimer', 0);
        // Manually adjust
        toast({
          title: 'Mega Pack Purchased! 🎉',
          description: 'You got 10 hints, 2 skips, and 2 freeze timers!',
        });
      } else {
        const success = buyPowerUp(item.type, item.price);
        if (success) {
          toast({
            title: 'Purchase Successful! 🎉',
            description: `You got ${item.amount} ${item.name}!`,
          });
        }
      }
    } else {
      toast({
        title: 'Not Enough Coins 😢',
        description: `You need ${item.price - coins} more coins.`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
            <ShoppingCart className="w-10 h-10" />
            Shop
          </h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-2xl font-black text-white flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-300" />
              {coins}
            </span>
          </div>
        </div>

        {/* Shop Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shopItems.map((item) => (
            <Card key={item.id} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition-transform">
              <div className={`bg-gradient-to-br ${item.gradient} p-6 text-center relative`}>
                {item.badge && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </div>
                )}
                <span className="text-7xl">{item.icon}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-6 h-6 text-yellow-600" />
                    <span className="text-3xl font-black text-gray-800">{item.price}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handlePurchase(item)}
                  className={`w-full h-12 text-lg font-bold bg-gradient-to-r ${item.gradient} hover:opacity-90 text-white rounded-2xl`}
                >
                  Buy Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Premium Banner */}
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-8 rounded-3xl shadow-2xl text-white text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <span className="text-6xl">👑</span>
            </div>
            <h3 className="text-4xl font-black">Go Premium!</h3>
            <p className="text-lg opacity-90">Unlock unlimited hints, exclusive puzzles, and more!</p>
            <Button
              onClick={() => navigate('/premium')}
              className="h-16 px-10 text-xl font-black bg-white text-purple-600 hover:bg-gray-100 rounded-2xl transform hover:scale-105 transition-all"
            >
              View Premium Plans
            </Button>
          </div>
        </Card>

        {/* Earn More Coins */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-black text-gray-800">Earn More Coins 💰</h3>
            <p className="text-lg text-gray-600">Complete puzzles to earn coins! Each star gives you 10 coins.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate('/levels')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-14 px-8 rounded-2xl text-lg"
              >
                Play Levels
              </Button>
              <Button
                onClick={() => navigate('/daily-challenge')}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold h-14 px-8 rounded-2xl text-lg"
              >
                Daily Challenge
              </Button>
              <Button
                onClick={() => navigate('/challenges')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold h-14 px-8 rounded-2xl text-lg"
              >
                Challenge Friends
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Shop;
