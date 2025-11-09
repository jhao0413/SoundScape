import { useState, useRef, useEffect } from 'react';
import { Slider, Select, SelectItem } from "@heroui/react";
import { useMusicStore } from '../store/useMusicStore';
import { PlayingAnimation, PausedIcon } from './PlayingAnimation';

export const PlayerBar = () => {
  const {
    devices,
    selectedDevice,
    currentMusic,
    isPlaying,
    volume,
    isShuffleOn,
    loopMode,
    playMode,
    playProgress,
    setDevice,
    togglePlayPause,
    playNext,
    playPrevious,
    setVolume,
    setVolumeEnd,
    toggleShuffle,
    toggleLoop,
    setPlayMode,
  } = useMusicStore();
  
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlayModePopup, setShowPlayModePopup] = useState(false);
  const volumeRef = useRef(null);
  const playModeRef = useRef(null);
  const progressBarRef = useRef(null);
  
  // 点击外部关闭音量弹窗
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };
    
    if (showVolumeSlider) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showVolumeSlider]);

  // 点击外部关闭播放模式弹窗
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (playModeRef.current && !playModeRef.current.contains(event.target)) {
        setShowPlayModePopup(false);
      }
    };
    
    if (showPlayModePopup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPlayModePopup]);
  const getMusicTitle = () => {
    if (!currentMusic) return '未播放';
    return currentMusic.name || currentMusic.title || currentMusic.musicname || '未知歌曲';
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = playProgress.duration > 0 
    ? (playProgress.offset / playProgress.duration) * 100 
    : 0;

  // 处理进度条点击（移动端）
  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !playProgress.duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * playProgress.duration;
    // 这里需要调用store的方法来设置播放进度
    // 暂时先不做，因为需要后端API支持
  };

  const getLoopIcon = () => {
    switch (loopMode) {
      case 'one':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
            <text x="10" y="14" fontSize="8" textAnchor="middle" fill="currentColor" fontWeight="bold">1</text>
          </svg>
        );
      case 'all':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'all_loop':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
          </svg>
        );
      case 'single_loop':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'random':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        );
      case 'single':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
          </svg>
        );
    }
  };

  const getPlayModeText = () => {
    const modeMap = {
      'all_loop': '全部循环',
      'single_loop': '单曲循环',
      'random': '随机播放',
      'single': '单曲播放',
      'sequential': '顺序播放'
    };
    return modeMap[playMode] || '顺序播放';
  };

  return (
    <div className="flex flex-col bg-white/60 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
      {/* Progress Bar at Top - Enhanced for mobile */}
      <div className="relative py-1 sm:py-0">
        <div 
          ref={progressBarRef}
          className="h-2 sm:h-1 bg-gray-200/80 overflow-visible relative touch-manipulation cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-[#31c27c] transition-all duration-300 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Progress indicator dot on mobile - larger and more visible */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 sm:w-0 sm:h-0 bg-white border-2 border-[#31c27c] rounded-full shadow-lg transition-all"></div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Song Info */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div 
              className={`w-14 h-14 rounded-xl bg-gradient-to-br from-[#31c27c] to-[#28a869] flex items-center justify-center flex-shrink-0 shadow-lg transition-transform active:scale-95 ${isPlaying ? 'animate-pulse' : ''}`}
              onClick={togglePlayPause}
            >
              {isPlaying ? <PlayingAnimation /> : <PausedIcon />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">
                {getMusicTitle()}
              </h3>
              {currentMusic?.artist && (
                <p className="text-xs text-gray-600 truncate mt-1">{currentMusic.artist}</p>
              )}
            </div>
          </div>
        </div>

        {/* Time Display (Mobile) */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-medium tabular-nums">
              {formatTime(playProgress.offset)}
            </span>
            <span className="text-xs text-gray-400 font-medium">/</span>
            <span className="text-xs text-gray-600 font-medium tabular-nums">
              {formatTime(playProgress.duration)}
            </span>
          </div>
        </div>

        {/* Control Buttons (Mobile) */}
        <div className="flex items-center justify-center gap-8 px-4 pb-5 pt-2">
          <button
            onClick={playPrevious}
            className="text-gray-700 active:text-[#31c27c] transition-all p-3 touch-manipulation rounded-full active:bg-gray-100/50 active:scale-90 min-w-[48px] min-h-[48px] flex items-center justify-center"
            title="上一曲"
            aria-label="上一曲"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-[#31c27c] active:bg-[#28a869] text-white flex items-center justify-center transition-all shadow-xl active:shadow-2xl active:scale-90 touch-manipulation ring-4 ring-[#31c27c]/20"
            title={isPlaying ? '暂停' : '播放'}
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={playNext}
            className="text-gray-700 active:text-[#31c27c] transition-all p-3 touch-manipulation rounded-full active:bg-gray-100/50 active:scale-90 min-w-[48px] min-h-[48px] flex items-center justify-center"
            title="下一曲"
            aria-label="下一曲"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden sm:flex h-20 items-center justify-between px-4 md:px-6">
        {/* Current Music Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#31c27c] to-[#28a869] flex items-center justify-center flex-shrink-0 shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}>
            {isPlaying ? <PlayingAnimation /> : <PausedIcon />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {getMusicTitle()}
            </h3>
            {currentMusic?.artist && (
              <p className="text-xs text-gray-600 truncate">{currentMusic.artist}</p>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 justify-center">
          {/* Play Mode Button - Hidden on mobile */}
          <div className="relative flex items-center hidden md:block" ref={playModeRef}>
            <button
              onClick={() => setShowPlayModePopup(!showPlayModePopup)}
              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center p-1"
              title={`播放模式: ${getPlayModeText()}`}
            >
              {getPlayModeIcon()}
            </button>
            
            {/* Play Mode Popup */}
            {showPlayModePopup && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4 animate-in fade-in slide-in-from-bottom-2 min-w-[140px]">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setPlayMode('all_loop');
                      setShowPlayModePopup(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      playMode === 'all_loop' 
                        ? 'bg-[#31c27c] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    全部循环
                  </button>
                  <button
                    onClick={() => {
                      setPlayMode('single_loop');
                      setShowPlayModePopup(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      playMode === 'single_loop' 
                        ? 'bg-[#31c27c] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    单曲循环
                  </button>
                  <button
                    onClick={() => {
                      setPlayMode('random');
                      setShowPlayModePopup(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      playMode === 'random' 
                        ? 'bg-[#31c27c] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    随机播放
                  </button>
                  <button
                    onClick={() => {
                      setPlayMode('single');
                      setShowPlayModePopup(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      playMode === 'single' 
                        ? 'bg-[#31c27c] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    单曲播放
                  </button>
                  <button
                    onClick={() => {
                      setPlayMode('sequential');
                      setShowPlayModePopup(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      playMode === 'sequential' 
                        ? 'bg-[#31c27c] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    顺序播放
                  </button>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="w-3 h-3 bg-white/95 border-r border-b border-gray-200/50 rotate-45"></div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={playPrevious}
            className="text-gray-600 hover:text-gray-800 active:text-gray-900 transition-colors p-2 touch-manipulation"
            title="上一曲"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#31c27c] hover:bg-[#28a869] active:bg-[#28a869] text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl touch-manipulation"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={playNext}
            className="text-gray-600 hover:text-gray-800 active:text-gray-900 transition-colors p-2 touch-manipulation"
            title="下一曲"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>

          {/* Volume Control with Popup - Hidden on small mobile */}
          <div className="relative flex items-center hidden sm:block" ref={volumeRef}>
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-gray-600 hover:text-gray-800 active:text-gray-900 transition-colors flex items-center justify-center p-1 touch-manipulation"
              title="音量控制"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Volume Slider Popup */}
            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-5 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-xs font-semibold text-gray-700">音量</span>
                  <Slider
                    size="sm"
                    step={1}
                    maxValue={100}
                    minValue={0}
                    value={volume}
                    onChange={setVolume}
                    onChangeEnd={setVolumeEnd}
                    orientation="vertical"
                    className="h-32"
                    classNames={{
                      track: "bg-gray-200",
                      filler: "bg-[#31c27c]",
                      thumb: "bg-[#31c27c] shadow-md"
                    }}
                  />
                  <span className="text-lg font-bold text-[#31c27c]">{volume}%</span>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="w-3 h-3 bg-white/95 border-r border-b border-gray-200/50 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Time Progress & Device */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <span className="text-xs text-gray-600 font-medium whitespace-nowrap hidden lg:block">
            {formatTime(playProgress.offset)}/{formatTime(playProgress.duration)}
          </span>

          {/* Device Selector - Hidden on mobile, shown on tablet and up */}
          <div className="hidden md:block">
            <Select
              selectedKeys={selectedDevice ? [selectedDevice] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) setDevice(selected);
              }}
              className="w-40 lg:w-48"
              aria-label="选择设备"
              size="sm"
            >
              {devices.map((device) => (
                <SelectItem key={device.did} value={device.did}>
                  {device.name || device.did}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
