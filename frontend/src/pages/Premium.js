import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Crown, Check, Zap, Star, Coins, Trophy } from 'lucide-react';

const Premium = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, text: 'Unlimited Hints', color: 'text-yellow-600' },
    { icon: Star, text: 'Exclusive Puzzles', color: 'text-purple-600' },
    { icon: Coins, text: '2x Coin Rewards', color: 'text-amber-600' },
    { icon: Trophy, text: 'Premium Badge', color: 'text-blue-600' },
    { icon: Crown, text: 'Ad-Free Experience', color: 'text-pink-600' },
    { icon: Check, text: 'Early Access to Features', color: 'text-green-600' },
  ];

  const plans = [
    {
      name: 'Monthly',
      price: '$4.99',
      period: '/month',
      description: 'Perfect for casual players',
      popular: false,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Yearly',
      price: '$39.99',
      period: '/year',
      description: 'Save 33% - Best Value!',
      popular: true,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Lifetime',
      price: '$99.99',
      period: 'one-time',
      description: 'Ultimate brain training',
      popular: false,
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/shop')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
            <Crown className="w-10 h-10 text-yellow-300" />
            Premium
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Hero Section */}
        <Card className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-black text-gray-800 mb-4">Go Premium!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Unlock unlimited potential and become a MindSpark Pro
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <span className="text-left font-semibold text-gray-700">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 ${
                plan.popular ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 font-black">
                  ⭐ MOST POPULAR ⭐
                </div>
              )}
              <div className="p-8 text-center space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                <div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-black text-gray-800">{plan.price}</span>
                    <span className="text-xl text-gray-600">{plan.period}</span>
                  </div>
                  {plan.name === 'Yearly' && (
                    <p className="text-sm font-semibold text-green-600 mt-2">Save $20/year</p>
                  )}
                </div>

                <Button
                  className={`w-full h-14 text-xl font-bold bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white rounded-2xl`}
                >
                  Subscribe Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl text-white text-center">
          <Check className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-black mb-2">30-Day Money Back Guarantee</h3>
          <p className="text-lg opacity-90">
            Try Premium risk-free. If you're not satisfied, get a full refund within 30 days.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Premium;
