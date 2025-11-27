import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, ShoppingCart, Crown, Sparkles, Zap, Check } from 'lucide-react';
import api from '../services/api';

const Shop = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { coins, addCoins, setHints, setLives, hints, lives } = useGame();
  
  const [items, setItems] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      const [itemsRes, subsRes] = await Promise.all([
        api.get('/api/shop/items'),
        api.get('/api/shop/subscriptions')
      ]);
      setItems(itemsRes.items || []);
      setSubscriptions(subsRes.subscriptions || []);
    } catch (error) {
      console.error('Failed to load shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setPurchasing(itemId);
    try {
      const response = await api.post('/api/shop/purchase', { item_id: itemId });
      
      // Update local state
      if (response.new_balance) {
        if (response.new_balance.coins !== undefined) addCoins(response.new_balance.coins - coins);
        if (response.new_balance.hints !== undefined) setHints(response.new_balance.hints);
        if (response.new_balance.lives !== undefined) setLives(response.new_balance.lives);
      }
      
      alert('✅ Purchase successful!');
      loadShopData();
    } catch (error) {
      alert('❌ Purchase failed: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setPurchasing(null);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setPurchasing(plan);
    try {
      await api.post('/api/shop/subscribe', { plan });
      alert('✅ Subscription activated!');
      loadShopData();
    } catch (error) {
      alert('❌ Subscription failed: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setPurchasing(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <Card className="bg-white p-8 rounded-3xl text-center max-w-md">
          <ShoppingCart className="w-20 h-20 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to access the shop</p>
          <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Home</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg flex items-center gap-2 justify-center">
              <ShoppingCart className="w-6 h-6 sm:w-10 sm:h-10" />
              Shop
            </h1>
            <p className="text-xs sm:text-sm text-white/80">Your coins: {coins} 💰</p>
          </div>
          <div className="w-20 sm:w-28"></div>
        </div>

        {/* Premium Subscriptions */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Premium Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map(plan => (
              <Card key={plan.id} className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                {plan.badge && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.badge}
                  </div>
                )}
                
                <div className="text-center text-white space-y-4">
                  <div className="text-5xl mb-2">{plan.icon}</div>
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <p className="text-3xl font-black">${(plan.price / 100).toFixed(2)}<span className="text-lg">/{plan.duration}</span></p>
                  
                  <ul className="text-left space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-5 h-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.duration)}
                    disabled={purchasing === plan.duration}
                    className="w-full h-12 bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg rounded-xl"
                  >
                    {purchasing === plan.duration ? 'Processing...' : 'Subscribe Now'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Shop Items */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Power-Ups
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <Card key={item.id} className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                {item.badge && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {item.badge}
                  </div>
                )}
                
                <div className="text-center space-y-3">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description || `Get ${item.amount} ${item.type}`}</p>
                  <p className="text-2xl font-black text-purple-600">${(item.price / 100).toFixed(2)}</p>
                  
                  <Button
                    onClick={() => handlePurchase(item.id)}
                    disabled={purchasing === item.id}
                    className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl"
                  >
                    {purchasing === item.id ? 'Buying...' : 'Buy Now'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
