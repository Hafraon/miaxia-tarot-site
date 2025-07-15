import React, { useState } from 'react';
import { TrendingUp, Clock, MousePointer, Eye } from 'lucide-react';
import { LeadScore } from '../hooks/useLeadScoring';

interface LeadScoreWidgetProps {
  leadScore: LeadScore;
  isVisible?: boolean;
}

const LeadScoreWidget: React.FC<LeadScoreWidgetProps> = ({ leadScore, isVisible = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const getLevelColor = (level: LeadScore['level']) => {
    switch (level) {
      case 'vip': return 'from-gold to-yellow-400';
      case 'hot': return 'from-red-500 to-orange-500';
      case 'warm': return 'from-orange-500 to-yellow-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getLevelEmoji = (level: LeadScore['level']) => {
    switch (level) {
      case 'vip': return '👑';
      case 'hot': return '🔥';
      case 'warm': return '⚡';
      default: return '❄️';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div 
        className={`bg-darkblue/90 backdrop-blur-sm border border-gold/30 rounded-lg shadow-xl transition-all duration-300 ${
          isExpanded ? 'w-80 p-4' : 'w-16 h-16 p-2 cursor-pointer hover:scale-105'
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded ? (
          // Collapsed view
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getLevelColor(leadScore.level)} flex items-center justify-center text-white font-bold text-sm animate-pulse`}>
              {leadScore.totalScore}
            </div>
          </div>
        ) : (
          // Expanded view
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gold font-semibold text-sm">Лід-скор</h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-gray-400 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Main Score */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getLevelColor(leadScore.level)} text-white font-bold`}>
                <span className="text-lg">{getLevelEmoji(leadScore.level)}</span>
                <span className="text-xl">{leadScore.totalScore}</span>
                <span className="text-sm uppercase">{leadScore.level}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gold" />
                  <span>Час на сайті</span>
                </div>
                <span className="text-white font-semibold">{formatTime(leadScore.timeOnSite)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-gold" />
                  <span>Прокрутка</span>
                </div>
                <span className="text-white font-semibold">{leadScore.scrollDepth}%</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <MousePointer className="h-3 w-3 text-gold" />
                  <span>Взаємодії</span>
                </div>
                <span className="text-white font-semibold">{leadScore.interactions}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="bg-darkblue/60 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getLevelColor(leadScore.level)} transition-all duration-500`}
                  style={{ width: `${Math.min((leadScore.totalScore / 200) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>200+ (VIP)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadScoreWidget;