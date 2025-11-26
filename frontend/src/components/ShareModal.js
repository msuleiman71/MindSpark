import React from 'react';
import { Button } from './ui/button';
import { Share2, Twitter, Facebook, Copy, CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ShareModal = ({ isOpen, onClose, score, level, stars }) => {
  if (!isOpen) return null;

  const shareText = `I just scored ${score} points and earned ${stars} stars on Level ${level} in MindSpark! Can you beat my score? 🧠⚡`;
  const shareUrl = window.location.origin;

  const handleShare = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    toast({
      title: 'Copied to clipboard! 📋',
      description: 'Share with your friends!',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
            <Share2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Share Your Score!</h2>
          <p className="text-gray-600">Let your friends know about your achievement!</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handleShare('twitter')}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-2xl"
          >
            <Twitter className="w-6 h-6 mr-3" />
            Share on Twitter
          </Button>

          <Button
            onClick={() => handleShare('facebook')}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl"
          >
            <Facebook className="w-6 h-6 mr-3" />
            Share on Facebook
          </Button>

          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full h-14 text-lg font-bold border-2 border-gray-300 hover:bg-gray-100 rounded-2xl"
          >
            <Copy className="w-6 h-6 mr-3" />
            Copy Link
          </Button>
        </div>

        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full text-gray-600 hover:text-gray-800"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ShareModal;
