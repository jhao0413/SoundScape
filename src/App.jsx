import { useEffect, useState } from 'react';
import { useMusicStore } from './store/useMusicStore';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Settings } from './components/Settings';

function App() {
  const {
    selectedDevice,
    error,
    playlists,
    loadDevices,
    loadMusicList,
    loadCurrentMusic,
    clearError,
    isPlaying,
    setPlaylist,
  } = useMusicStore();

  const [showSettings, setShowSettings] = useState(false);

  // 初始化加载
  useEffect(() => {
    loadDevices();
    loadMusicList();
  }, [loadDevices, loadMusicList]);

  // 加载音乐列表后自动选择最后一个播放列表
  useEffect(() => {
    if (Object.keys(playlists).length > 0) {
      const playlistKeys = Object.keys(playlists);
      const lastPlaylist = playlistKeys[playlistKeys.length - 1];
      setPlaylist(lastPlaylist);
    }
  }, [playlists, setPlaylist]);

  // 定时刷新当前播放状态和音量
  useEffect(() => {
    if (!selectedDevice) return;

    const interval = setInterval(() => {
      if (isPlaying) {
        loadCurrentMusic();
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedDevice, loadCurrentMusic, isPlaying]);

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070)',
          }}
        />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50" />
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-2 right-2 left-2 sm:top-6 sm:right-6 sm:left-auto z-50 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 animate-in slide-in-from-top max-w-sm sm:max-w-md mx-auto sm:mx-0">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-xs sm:text-sm text-gray-800 flex-1">{error}</p>
            <button
              onClick={clearError}
              className="text-gray-400 hover:text-gray-600 ml-2 transition-colors text-lg sm:text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Container - Glass Card */}
      <div className="relative z-10 flex flex-col h-screen p-2 sm:p-4 md:p-6">
        <div className="flex flex-col flex-1 overflow-hidden bg-white/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-white/40">
          {/* Main Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar onOpenSettings={() => setShowSettings(true)} />

            {/* Main Content */}
            <MainContent />
            
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <App />
  );
}
