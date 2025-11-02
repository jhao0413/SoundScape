import React from 'react';

export const PlayingAnimation = () => {
  return (
    <div className="relative w-8 h-8">
      {/* 音符图标 */}
      <svg 
        className="w-8 h-8 text-white animate-pulse" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
      
      {/* 音波动画效果 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms', animationDuration: '800ms' }}></div>
          <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms', animationDuration: '800ms' }}></div>
          <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '400ms', animationDuration: '800ms' }}></div>
          <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '600ms', animationDuration: '800ms' }}></div>
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '800ms', animationDuration: '800ms' }}></div>
        </div>
      </div>
      
      {/* 光晕效果 */}
      <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
    </div>
  );
};

export const PausedIcon = () => {
  return (
    <div className="relative w-8 h-8">
      {/* 暂停图标 */}
      <svg 
        className="w-8 h-8 text-white" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>
      
      {/* 睡觉效果 - 可爱的小Z符号 */}
      <div className="absolute -top-1 -right-1 text-white text-xs font-bold animate-bounce" style={{ animationDuration: '3s' }}>
        Z
      </div>
    </div>
  );
};
