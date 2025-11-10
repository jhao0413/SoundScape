import { create } from 'zustand';
import * as api from '../services/api';
import { addToast } from "@heroui/toast";

export const useMusicStore = create((set, get) => ({
  // 设备相关
  devices: [],
  selectedDevice: '',
  
  // 播放列表相关
  playlists: {},
  selectedPlaylist: '',
  currentPlaylist: [],
  
  // 音乐列表
  musicList: [],
  
  // 播放状态
  currentMusic: null,
  isPlaying: false,
  playProgress: { offset: 0, duration: 0 },
  
  // 播放控制
  volume: 50,
  isShuffleOn: false,
  loopMode: 'off', // 'off', 'one', 'all'
  playMode: 'sequential', // 'all_loop', 'single_loop', 'random', 'single', 'sequential'
  
  // UI 状态
  loading: false,
  error: null,

  // 设置相关
  settings: null,
  version: null,

  // Actions
  
  // 将播放模式索引转换为模式字符串
  playModeIndexToMode: (index) => {
    const modeMap = {
      0: 'single_loop',   // 单曲循环
      1: 'all_loop',      // 全部循环
      2: 'random',        // 随机播放
      3: 'single',        // 单曲播放
      4: 'sequential'    // 顺序播放
    };
    return modeMap[index] || 'sequential';
  },

  // 加载设备列表
  loadDevices: async () => {
    try {
      set({ loading: true });
      const data = await api.getSettings(true);
      
      if (data && data.device_list) {
        // 将对象转换为数组，key 作为 did 字段
        const devicesArray = data.device_list.map(device => ({
          did: device.miotDID,
          ...device
        }));
        
        set({ devices: devicesArray });
        
        const { selectedDevice } = get();
        const currentDevice = selectedDevice 
          ? devicesArray.find(d => d.did === selectedDevice)
          : (devicesArray.length > 0 ? devicesArray[0] : null);
        
        // 设置默认选中第一个设备
        if (devicesArray.length > 0 && !selectedDevice) {
          set({ selectedDevice: devicesArray[0].did });
        }
        
        // 从设备信息中读取播放模式
        if (currentDevice && typeof currentDevice.play_type === 'number') {
          const playMode = get().playModeIndexToMode(currentDevice.play_type);
          set({ playMode });
          console.log('从设备信息加载播放模式:', playMode, '索引:', currentDevice.play_type);
        }
      }
    } catch (err) {
      set({ error: 'Failed to load devices: ' + err.message });
    } finally {
      set({ loading: false });
    }
  },

  // 加载音乐列表
  loadMusicList: async () => {
    try {
      const data = await api.getMusicList();
      if (typeof data === 'object' && data !== null) {
        set({ playlists: data });
        // 默认显示"所有歌曲"或"全部"
        if (data['所有歌曲'] && Array.isArray(data['所有歌曲'])) {
          set({ musicList: data['所有歌曲'] });
        } else if (data['全部'] && Array.isArray(data['全部'])) {
          set({ musicList: data['全部'] });
        } else {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            set({ musicList: data[firstKey] });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load music list:', err);
    }
  },

  // 加载当前播放信息
  loadCurrentMusic: async () => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    
    try {
      const data = await api.getPlayingMusic(selectedDevice);
      if (data && data.ret === 'OK') {
        set({
          currentMusic: {
            name: data.cur_music,
            playlist: data.cur_playlist,
          },
          isPlaying: data.is_playing,
          playProgress: {
            offset: data.offset || 0,
            duration: data.duration || 0,
          },
        });
      }
    } catch (err) {
      console.error('Failed to load current music:', err);
    }
  },

  // 加载音量
  loadVolume: async () => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    
    try {
      const data = await api.getVolume(selectedDevice);
      if (data && data.ret === 'OK' && typeof data.volume === 'number') {
        set({ volume: data.volume });
      }
    } catch (err) {
      console.error('Failed to load volume:', err);
    }
  },

  // 设置设备
  setDevice: async (deviceId) => {
    set({ selectedDevice: deviceId });
    // 切换设备后，重新加载设备信息以获取该设备的播放模式
    await get().loadDevices();
  },

  // 设置播放列表
  setPlaylist: (playlistName) => {
    const { playlists } = get();
    set({ selectedPlaylist: playlistName });
    if (playlistName && playlists[playlistName]) {
      set({ 
        currentPlaylist: playlists[playlistName],
        musicList: playlists[playlistName] 
      });
    }
  },

  // 播放播放列表中的音乐
  playMusicFromPlaylist: async (playlistName, musicName = '') => {
    const { selectedDevice } = get();
    if (!selectedDevice) {
      set({ error: 'Please select a device first' });
      return;
    }
    try {
      await api.playMusicList(selectedDevice, playlistName, musicName);
      await get().loadCurrentMusic();
    } catch (err) {
      set({ error: 'Failed to play music: ' + err.message });
    }
  },

  // 播放/暂停
  togglePlayPause: async () => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    try {
        if (get().isPlaying) {
            await api.togglePlayPause(selectedDevice);
            await get().loadCurrentMusic();
        } else {
            await api.playMusicList(selectedDevice, get().selectedPlaylist, get().currentMusic.name);
            await get().loadCurrentMusic();
        }
      
    } catch (err) {
      set({ error: 'Failed to toggle play/pause: ' + err.message });
    }
  },

  // 下一曲
  playNext: async () => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    try {
      await api.playNext(selectedDevice);
      await get().loadCurrentMusic();
    } catch (err) {
      set({ error: 'Failed to play next: ' + err.message });
    }
  },

  // 上一曲
  playPrevious: async () => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    try {
      await api.playPrevious(selectedDevice);
      await get().loadCurrentMusic();
    } catch (err) {
      set({ error: 'Failed to play previous: ' + err.message });
    }
  },

  // 设置音量
  setVolume: async (volume) => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    try {
      set({ volume });
    } catch (err) {
      set({ error: 'Failed to set volume: ' + err.message });
    }
  },

  setVolumeEnd: async (volume) => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    try {
      await api.setVolume(selectedDevice, volume);
    } catch (err) {
      set({ error: 'Failed to set volume: ' + err.message });
    }
  },

  // 切换随机播放
  toggleShuffle: async () => {
    const { selectedDevice, isShuffleOn } = get();
    if (!selectedDevice) return;
    try {
      const newState = !isShuffleOn;
      set({ isShuffleOn: newState });
      await api.setShuffleMode(selectedDevice, newState);
    } catch (err) {
      set({ error: 'Failed to toggle shuffle: ' + err.message });
    }
  },

  // 切换循环模式
  toggleLoop: async () => {
    const { selectedDevice, loopMode } = get();
    if (!selectedDevice) return;
    try {
      const modes = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(loopMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      set({ loopMode: nextMode });
      await api.setLoopMode(selectedDevice, nextMode);
    } catch (err) {
      set({ error: 'Failed to toggle loop: ' + err.message });
    }
  },

  // 搜索音乐
  searchMusic: async (searchTerm) => {
    try {
      set({ loading: true });
      const data = await api.searchMusic(searchTerm);
      if (Array.isArray(data)) {
        set({ musicList: data });
      }
      return data;
    } catch (err) {
      set({ error: 'Failed to search: ' + err.message });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // 刷新音乐列表
  refreshMusicList: async () => {
    const { selectedDevice } = get();
    if (!selectedDevice) {
      addToast({
        title: '刷新失败',
        description: '请先选择设备',
        color: 'danger',
      });
      return;
    }
    
    try {
      await api.refreshMusicList(selectedDevice);
      await get().loadMusicList();
      addToast({
        title: '刷新成功',
        description: '音乐列表已刷新',
        color: 'success',
      });
    } catch (err) {
      addToast({
        title: '刷新失败',
        description: err.message,
        color: 'danger',
      });
    }
  },

  // 刷新播放列表
  refreshPlaylists: async () => {
    await get().loadMusicList();
  },

  // 设置错误
  setError: (error) => {
    set({ error });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 加载设置
  loadSettings: async () => {
    try {
      set({ loading: true });
      const data = await api.getSettings(false);
      set({ settings: data });
      return data;
    } catch (err) {
      set({ error: 'Failed to load settings: ' + err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // 保存设置
  saveSettings: async (settings) => {
    try {
      set({ loading: true });
      await api.saveSettings(settings);
      set({ settings });
      return { success: true };
    } catch (err) {
      set({ error: 'Failed to save settings: ' + err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // 获取版本信息
  getVersion: async () => {
    try {
      const data = await api.getVersion();
      set({ version: data.version });
      return data.version;
    } catch (err) {
      set({ error: 'Failed to get version: ' + err.message });
      throw err;
    }
  },

  // 设置播放模式
  setPlayMode: async (mode) => {
    const { selectedDevice } = get();
    if (!selectedDevice) return;
    try {
      // 先更新本地状态，提供即时反馈
      set({ playMode: mode });
      // 调用 API 设置播放模式
      await api.setPlayMode(selectedDevice, mode);
      // 切换播放模式后，重新加载设备信息以同步状态
      // 参考原版实现：切换某些播放模式后会 location.reload()
      // 这里我们重新加载设备信息来获取最新的 play_type，确保状态同步
      await get().loadDevices();
    } catch (err) {
      set({ error: 'Failed to set play mode: ' + err.message });
      // 如果失败，尝试从设备信息恢复播放模式
      await get().loadDevices();
    }
  },
}));
