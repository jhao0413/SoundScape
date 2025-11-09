import { useState } from 'react';
import { useMusicStore } from '../store/useMusicStore';
import { PlayerBar } from './PlayerBar';

export const MainContent = () => {
  const {
    selectedPlaylist,
    musicList,
    currentMusic,
    loading,
    playMusicFromPlaylist,
    searchMusic,
    refreshMusicList,
  } = useMusicStore();
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchMusic(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    refreshMusicList();
  };

  // 当搜索内容为空时自动刷新列表
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      refreshMusicList();
    }
  };

  const getCurrentMusicName = () => {
    if (!currentMusic) return null;
    // API returns: { name: "cur_music", playlist: "cur_playlist" }
    return currentMusic.name || currentMusic.musicname || currentMusic.title;
  };

  const currentMusicName = getCurrentMusicName();

  // Determine which list to display
  const displayList = musicList;

  const getTitle = () => {
    if (searchTerm) {
      return `搜索结果: "${searchTerm}"`;
    }
    if (selectedPlaylist) {
      return selectedPlaylist;
    }
    return '所有音乐';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
      {/* Header with blur effect */}
      <div className="bg-white/40 backdrop-blur-md border-b border-gray-200/50">
        <div className="p-3 sm:p-4 md:p-6">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索歌曲..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 bg-white/50 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#31c27c] focus:bg-white/70 transition-all"
              />
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#31c27c] hover:bg-[#28a869] active:bg-[#28a869] text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg touch-manipulation whitespace-nowrap"
            >
              搜索
            </button>
          </div>

          {/* Current View Badge */}
          {selectedPlaylist && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">当前列表:</span>
                <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#31c27c] text-white shadow-md">
                  {selectedPlaylist}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm text-gray-600">共 {displayList.length} 首</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Music List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-3 sm:p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#31c27c]"></div>
              <p className="mt-2 text-xs sm:text-sm">加载中...</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-xs sm:text-sm">暂无歌曲</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white/50 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200/50">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">#</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">歌曲</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayList.map((music, index) => {
                      const musicName = typeof music === 'string' ? music : (music.name || music.musicname || music.title || `Track ${index + 1}`);
                      const isPlaying = currentMusicName === musicName;

                      return (
                        <tr
                          key={index}
                          className={`hover:bg-gray-50/70 transition-colors cursor-pointer group ${
                            isPlaying ? 'bg-[#31c27c]/10' : ''
                          }`}
                          onDoubleClick={() => {
                            playMusicFromPlaylist(selectedPlaylist, musicName);
                          }}
                        >
                          <td className="px-4 sm:px-6 py-4">
                            <span className={`text-sm ${isPlaying ? 'text-[#31c27c] font-semibold' : 'text-gray-500'}`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  isPlaying ? 'text-[#31c27c]' : 'text-gray-800'
                                }`}>
                                  {musicName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playMusicFromPlaylist(selectedPlaylist, musicName);
                              }}
                              className="text-[#31c27c] hover:text-[#28a869] transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-2">
                {displayList.map((music, index) => {
                  const musicName = typeof music === 'string' ? music : (music.name || music.musicname || music.title || `Track ${index + 1}`);
                  const isPlaying = currentMusicName === musicName;

                  return (
                    <div
                      key={index}
                      className={`bg-white/50 backdrop-blur-md rounded-xl p-4 shadow-md border transition-all touch-manipulation ${
                        isPlaying ? 'border-[#31c27c] bg-[#31c27c]/10' : 'border-gray-200/50'
                      }`}
                      onDoubleClick={() => {
                        playMusicFromPlaylist(selectedPlaylist, musicName);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 text-center">
                          <span className={`text-sm font-medium ${isPlaying ? 'text-[#31c27c]' : 'text-gray-500'}`}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isPlaying ? 'text-[#31c27c]' : 'text-gray-800'
                          }`}>
                            {musicName}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playMusicFromPlaylist(selectedPlaylist, musicName);
                          }}
                          className="flex-shrink-0 p-2 text-[#31c27c] hover:text-[#28a869] active:text-[#28a869] transition-colors touch-manipulation"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Player Bar */}
      <PlayerBar />
    </div>
  );
};
