import { useMusicStore } from '../store/useMusicStore';

export const Sidebar = ({ onOpenSettings }) => {
  const {
    playlists,
    selectedPlaylist,
    setPlaylist,
    refreshMusicList,
  } = useMusicStore();
  return (
    <div className="w-64 bg-white/40 backdrop-blur-md border-r border-gray-200/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-800">SoundScape</h1>
            <p className="text-xs text-gray-600">xiaomusic音乐播放器</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">播放列表</h2>
            <button
              onClick={refreshMusicList}
              className="text-gray-400 hover:text-[#31c27c] transition-colors"
              title="刷新列表"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1">
            {Object.keys(playlists).map((playlist) => (
              <button
                key={playlist}
                onClick={() => setPlaylist(playlist)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedPlaylist === playlist
                    ? 'bg-[#31c27c] text-white shadow-md shadow-[#31c27c]/20'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  <span className="truncate">{playlist}</span>
                  {playlists[playlist] && (
                    <span className="ml-auto text-xs opacity-60">
                      {playlists[playlist].length}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <div className="p-4 border-t border-gray-200/50">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-white/50 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">设置</span>
        </button>
      </div>
    </div>
  );
};
