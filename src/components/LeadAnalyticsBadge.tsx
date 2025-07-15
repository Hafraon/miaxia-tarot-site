import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, MousePointer, TrendingUp, Users, Flame, Eye, EyeOff } from 'lucide-react';
import useLeadTracker from '../hooks/useLeadTracker';

interface LeadAnalyticsBadgeProps {
  isVisible?: boolean;
}

const LeadAnalyticsBadge: React.FC<LeadAnalyticsBadgeProps> = ({ isVisible = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBadge, setShowBadge] = useState(isVisible);
  const [activeUsers, setActiveUsers] = useState(1);
  const [hotLeads, setHotLeads] = useState(0);
  
  const {
    getCurrentScore,
    getCurrentDuration,
    getCurrentScrollPercent,
    getCurrentInteractions,
    exportLeadData
  } = useLeadTracker();

  // Показ/приховування badge по клавіші L
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
        event.preventDefault();
        setShowBadge(prev => !prev);
      }
    };

    // Перевірка URL параметра
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('analytics') === 'true') {
      setShowBadge(true);
    }

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Симуляція активних користувачів (в реальному проекті це буде з сервера)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 5) + 1);
      setHotLeads(Math.floor(Math.random() * 3));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getScoreLevel = (score: number): string => {
    if (score >= 80) return 'HOT 🔥';
    if (score >= 60) return 'WARM ⚡';
    if (score >= 40) return 'COOL ❄️';
    return 'COLD 🧊';
  };

  const handleExportData = () => {
    const data = exportLeadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lead-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!showBadge) return null;

  const currentScore = getCurrentScore();
  const currentDuration = getCurrentDuration();
  const currentScroll = getCurrentScrollPercent();
  const currentInteractions = getCurrentInteractions();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div 
        className={`bg-purple-900/95 backdrop-blur-sm border border-gold/30 rounded-lg shadow-xl transition-all duration-300 ${
          isExpanded ? 'w-80 p-4' : 'w-16 h-16 p-2 cursor-pointer hover:scale-105'
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded ? (
          // Collapsed view
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <BarChart3 className="h-8 w-8 text-gold animate-pulse" />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {Math.min(currentScore, 99)}
              </div>
            </div>
          </div>
        ) : (
          // Expanded view
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gold" />
                <h3 className="text-gold font-semibold text-sm">Lead Analytics</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportData}
                  className="text-gold hover:text-white text-xs px-2 py-1 bg-gold/20 rounded"
                  title="Export Data"
                >
                  📊
                </button>
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
            </div>

            {/* Current User Score */}
            <div className="bg-darkblue/50 rounded-lg p-3 mb-3">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(currentScore)} mb-1`}>
                  {currentScore}
                </div>
                <div className="text-xs text-gray-300 mb-2">
                  {getScoreLevel(currentScore)}
                </div>
                <div className="w-full bg-darkblue/60 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentScore >= 80 ? 'bg-red-400' :
                      currentScore >= 60 ? 'bg-orange-400' :
                      currentScore >= 40 ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}
                    style={{ width: `${Math.min(currentScore, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2 text-xs mb-3">
              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gold" />
                  <span>Time on Site</span>
                </div>
                <span className="text-white font-semibold">{formatTime(currentDuration)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-gold" />
                  <span>Scroll Depth</span>
                </div>
                <span className="text-white font-semibold">{currentScroll}%</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <MousePointer className="h-3 w-3 text-gold" />
                  <span>Interactions</span>
                </div>
                <span className="text-white font-semibold">{currentInteractions}</span>
              </div>
            </div>

            {/* Global Stats */}
            <div className="border-t border-gold/20 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-green-400" />
                  <span>Active Users</span>
                </div>
                <span className="text-green-400 font-semibold">{activeUsers}</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <Flame className="h-3 w-3 text-red-400" />
                  <span>Hot Leads (60+)</span>
                </div>
                <span className="text-red-400 font-semibold">{hotLeads}</span>
              </div>
            </div>

            {/* Toggle visibility button */}
            <div className="border-t border-gold/20 pt-3 mt-3">
              <button
                onClick={() => setShowBadge(false)}
                className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <EyeOff className="h-3 w-3" />
                Hide Analytics
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!showBadge && (
        <div className="fixed bottom-2 left-2 text-xs text-gray-500 bg-black/50 px-2 py-1 rounded opacity-50">
          Press Ctrl+L for analytics
        </div>
      )}
    </div>
  );
};

export default LeadAnalyticsBadge;