// API Service for SoundScape backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.110.56:8090';

// Basic Auth credentials (should be configured via env variables)
const getAuthHeader = () => {
  const username = import.meta.env.VITE_API_USERNAME || '';
  const password = import.meta.env.VITE_API_PASSWORD || '';
  if (username && password) {
    return 'Basic ' + btoa(`${username}:${password}`);
  }
  return null;
};

const fetchWithAuth = async (url, options = {}) => {
  const authHeader = getAuthHeader();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Device APIs
export const getSettings = async (needDeviceList = true) => {
  return fetchWithAuth(`${API_BASE_URL}/getsetting?need_device_list=${needDeviceList}`);
};

export const saveSettings = async (settings) => {
  return fetchWithAuth(`${API_BASE_URL}/savesetting`, {
    method: 'POST',
    body: JSON.stringify(settings),
  });
};

export const getVersion = async () => {
  return fetchWithAuth(`${API_BASE_URL}/getversion`);
};

// Volume APIs
export const getVolume = async (did = '') => {
  const data = await fetchWithAuth(`${API_BASE_URL}/getvolume?did=${did}`);
  return data; // Returns { ret: "OK", volume: 28 }
};

export const setVolume = async (did, volume) => {
  const data = await fetchWithAuth(`${API_BASE_URL}/setvolume`, {
    method: 'POST',
    body: JSON.stringify({ did, volume }),
  });
  return data; // Returns { ret: "OK", volume: 28 }
};

// Music List APIs
export const getMusicList = async () => {
  return fetchWithAuth(`${API_BASE_URL}/musiclist`);
};

export const searchMusic = async (name = '') => {
  return fetchWithAuth(`${API_BASE_URL}/searchmusic?name=${encodeURIComponent(name)}`);
};

// Playlist APIs
export const getCurrentPlaylist = async (did = '') => {
  return fetchWithAuth(`${API_BASE_URL}/curplaylist?did=${did}`);
};

// Playback Control APIs
export const playMusicList = async (did, listname = '', musicname = '') => {
  return fetchWithAuth(`${API_BASE_URL}/playmusiclist`, {
    method: 'POST',
    body: JSON.stringify({ did, listname, musicname }),
  });
};

export const getPlayingMusic = async (did = '') => {
  const data = await fetchWithAuth(`${API_BASE_URL}/playingmusic?did=${did}`);
  // Returns: { ret: "OK", is_playing: false, cur_music: "song", cur_playlist: "playlist", offset: 0, duration: 196 }
  return data;
};

// Music Info API
export const getMusicInfo = async (name, musictag = true) => {
  const data = await fetchWithAuth(`${API_BASE_URL}/musicinfo?musictag=${musictag}&name=${encodeURIComponent(name)}`);
  // Returns: { ret: "OK", name: "song", url: "http://...", tags: { title, artist, album, ... } }
  return data;
};

// Command APIs for playback control
export const sendCommand = async (did, cmd) => {
  return fetchWithAuth(`${API_BASE_URL}/cmd`, {
    method: 'POST',
    body: JSON.stringify({ did, cmd }),
  });
};

// Playback control commands
export const togglePlayPause = (did) => sendCommand(did, '关机');
export const playNext = (did) => sendCommand(did, '下一首');
export const playPrevious = (did) => sendCommand(did, '上一首');
export const refreshMusicList = (did) => sendCommand(did, '刷新列表');
export const setShuffleMode = (did, enabled) => sendCommand(did, enabled ? 'shuffle_on' : 'shuffle_off');
export const setLoopMode = (did, mode) => sendCommand(did, `loop_${mode}`); // mode: 'off', 'one', 'all'

// Play mode commands
export const setPlayMode = (did, mode) => {
  const modeMap = {
    'all_loop': '全部循环',
    'single_loop': '单曲循环', 
    'random': '随机播放',
    'single': '单曲播放',
    'sequential': '顺序播放'
  };
  return sendCommand(did, modeMap[mode]);
};
