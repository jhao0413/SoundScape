import { useState, useEffect } from 'react';
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { useMusicStore } from '../store/useMusicStore';

export const Settings = ({ onClose }) => {
  const [selectedMenu, setSelectedMenu] = useState('basic');
  const { settings, version, loadSettings, saveSettings: saveSettingsStore, getVersion } = useMusicStore();
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const menuItems = [
    { id: 'basic', label: '账号设置', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'preference', label: '目录配置', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { id: 'users', label: '服务配置', icon: 'M5 12h14M12 5l7 7-7 7' },
    { id: 'schedule', label: '语音控制配置', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: 'storage', label: '对话提示音配置', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'about', label: '关于', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  // 加载设置数据
  useEffect(() => {
    if (!settings) {
      loadSettings();
    } else {
      setFormData(settings);
    }
  }, [settings, loadSettings]);

  // 当settings更新时，同步到formData
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // 加载版本信息
  useEffect(() => {
    if (!version) {
      getVersion();
    }
  }, [version, getVersion]);

  // 更新表单字段
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 保存设置
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveSettingsStore(formData);
      addToast({
        title: '保存成功',
        description: '设置已成功保存',
        color: 'success',
        placement: 'top-center',
      });
    } catch (error) {
      addToast({
        title: '保存失败',
        description: error.message,
        color: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full h-full max-w-6xl max-h-[90vh] m-6 flex bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <div className="w-64 border-r border-gray-300 flex flex-col">

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    selectedMenu === item.id
                      ? 'bg-[#31c27c] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-300 ">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">
                {menuItems.find(item => item.id === selectedMenu)?.label || '基本信息'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="关闭"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
            {selectedMenu === 'basic' && (
              <div className="max-w-2xl space-y-8">
                <Input
                  label="小米账号"
                  labelPlacement="outside"
                  placeholder="请输入小米账号"
                  value={formData.account || ''}
                  onChange={(e) => updateField('account', e.target.value)}
                  
                />

                <Input
                  label="密码"
                  labelPlacement="outside"
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password || ''}
                  onChange={(e) => updateField('password', e.target.value)}
                  
                />

                <div className="border-gray-200">
                  <Button 
                    color="success"
                    className="text-white"
                    onPress={handleSave}
                    isLoading={isSaving}
                  >
                    保存更改
                  </Button>
                </div>
              </div>
            )}

            {selectedMenu === 'preference' && (
              <div className="max-w-2xl space-y-8">
                <Input
                  label="音乐目录"
                  labelPlacement="outside"
                  placeholder="请输入音乐目录路径"
                  value={formData.music_path || ''}
                  onChange={(e) => updateField('music_path', e.target.value)}
                  
                />

                <Input
                  label="音乐下载目录"
                  labelPlacement="outside"
                  placeholder="请输入下载目录路径"
                  value={formData.download_path || ''}
                  onChange={(e) => updateField('download_path', e.target.value)}
                  
                />

                <Input
                  label="临时文件目录"
                  labelPlacement="outside"
                  placeholder="请输入临时文件目录路径"
                  value={formData.temp_path || ''}
                  onChange={(e) => updateField('temp_path', e.target.value)}
                  
                />

                <Input
                  label="配置文件目录"
                  labelPlacement="outside"
                  placeholder="请输入配置文件目录路径"
                  value={formData.conf_path || ''}
                  onChange={(e) => updateField('conf_path', e.target.value)}
                  
                />

                <Input
                  label="缓存文件目录"
                  labelPlacement="outside"
                  placeholder="请输入缓存目录路径"
                  value={formData.cache_dir || ''}
                  onChange={(e) => updateField('cache_dir', e.target.value)}
                  
                />

                <Input
                  label="日志文件"
                  labelPlacement="outside"
                  placeholder="请输入日志文件路径"
                  value={formData.log_file || ''}
                  onChange={(e) => updateField('log_file', e.target.value)}
                  
                />

                <Input
                  label="FFmpeg路径"
                  labelPlacement="outside"
                  placeholder="请输入FFmpeg路径"
                  value={formData.ffmpeg_location || ''}
                  onChange={(e) => updateField('ffmpeg_location', e.target.value)}
                  
                />

                <div className="border-gray-200">
                  <Button 
                    color="success"
                    className="text-white"
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    保存更改
                  </Button>
                </div>
              </div>
            )}

            {selectedMenu === 'users' && (
              <div className="max-w-2xl space-y-8">
                <Input
                  label="主机名/IP"
                  labelPlacement="outside"
                  placeholder="请输入主机名或IP地址"
                  value={formData.hostname || ''}
                  onChange={(e) => updateField('hostname', e.target.value)}
                  
                />

                <Input
                  label="本地端口"
                  labelPlacement="outside"
                  type="number"
                  placeholder="请输入端口号"
                  value={formData.port || ''}
                  onChange={(e) => updateField('port', e.target.value)}
                  
                />

                <Input
                  label="公共端口"
                  labelPlacement="outside"
                  type="number"
                  placeholder="请输入公共端口号"
                  value={formData.public_port || ''}
                  onChange={(e) => updateField('public_port', e.target.value)}
                  
                />

                <Input
                  label="代理地址"
                  labelPlacement="outside"
                  placeholder="请输入代理地址"
                  value={formData.proxy || ''}
                  onChange={(e) => updateField('proxy', e.target.value)}
                  
                />

                <div className="flex items-center gap-2">
                  <Switch
                    color="success"
                    isSelected={formData.disable_httpauth || false}
                    onValueChange={(value) => updateField('disable_httpauth', value)}
                  >
                    禁用HTTP认证
                  </Switch>
                </div>

                {!formData.disable_httpauth && (
                  <>
                    <Input
                      label="HTTP认证用户名"
                      labelPlacement="outside"
                      placeholder="请输入用户名"
                      value={formData.httpauth_username || ''}
                      onChange={(e) => updateField('httpauth_username', e.target.value)}
                      
                    />

                    <Input
                      label="HTTP认证密码"
                      labelPlacement="outside"
                      type="password"
                      placeholder="请输入密码"
                      value={formData.httpauth_password || ''}
                      onChange={(e) => updateField('httpauth_password', e.target.value)}
                      
                    />
                  </>
                )}

                <div className="border-gray-200">
                  <Button 
                    color="success"
                    className="text-white"
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    保存更改
                  </Button>
                </div>
              </div>
            )}

            {selectedMenu === 'schedule' && (
              <div className="max-w-2xl space-y-8">
                <Input
                  label="允许唤醒的命令"
                  labelPlacement="outside"
                  placeholder="请输入允许的命令，用逗号分隔"
                  value={formData.active_cmd || ''}
                  onChange={(e) => updateField('active_cmd', e.target.value)}
                  
                />

                <Input
                  label="播放本地歌曲口令"
                  labelPlacement="outside"
                  placeholder="请输入口令，用逗号分隔"
                  value={formData.keywords_playlocal || ''}
                  onChange={(e) => updateField('keywords_playlocal', e.target.value)}
                  
                />

                <Input
                  label="播放歌曲口令"
                  labelPlacement="outside"
                  placeholder="请输入口令，用逗号分隔"
                  value={formData.keywords_play || ''}
                  onChange={(e) => updateField('keywords_play', e.target.value)}
                  
                />

                <Input
                  label="播放列表口令"
                  labelPlacement="outside"
                  placeholder="请输入口令，用逗号分隔"
                  value={formData.keywords_playlist || ''}
                  onChange={(e) => updateField('keywords_playlist', e.target.value)}
                  
                />

                <Input
                  label="停止口令"
                  labelPlacement="outside"
                  placeholder="请输入口令，用逗号分隔"
                  value={formData.keywords_stop || ''}
                  onChange={(e) => updateField('keywords_stop', e.target.value)}
                  
                />

                <Input
                  label="本地搜索播放口令"
                  labelPlacement="outside"
                  placeholder="请输入口令，用逗号分隔"
                  value={formData.keywords_search_playlocal || ''}
                  onChange={(e) => updateField('keywords_search_playlocal', e.target.value)}
                  
                />

                <Input
                  label="搜索播放口令"
                  labelPlacement="outside"
                  placeholder="请输入口令，用逗号分隔"
                  value={formData.keywords_search_play || ''}
                  onChange={(e) => updateField('keywords_search_play', e.target.value)}
                  
                />

                <div className="flex items-center gap-2">
                  <Switch
                  color="success"
                    isSelected={formData.enable_cmd_del_music || false}
                    onValueChange={(value) => updateField('enable_cmd_del_music', value)}
                  >
                    开启语音删除歌曲
                  </Switch>
                </div>

                <div className="border-gray-200">
                  <Button 
                    color="success"
                    className="text-white"
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    保存更改
                  </Button>
                </div>
              </div>
            )}

            {selectedMenu === 'storage' && (
              <div className="max-w-2xl space-y-8">
                <div className="flex items-center gap-2">
                  <Switch
                    color="success"
                    isSelected={formData.enable_pull_ask || false}
                    onValueChange={(value) => updateField('enable_pull_ask', value)}
                  >
                    获取对话记录
                  </Switch>
                </div>

                <Input
                  label="获取对话间隔（秒）"
                  labelPlacement="outside"
                  type="number"
                  placeholder="请输入间隔秒数"
                  value={formData.pull_ask_sec || ''}
                  onChange={(e) => updateField('pull_ask_sec', e.target.value)}
                  
                />

                <div className="flex items-center gap-2 mb-10">
                  <Switch
                    color="success"
                    isSelected={formData.get_ask_by_mina || false}
                    onValueChange={(value) => updateField('get_ask_by_mina', value)}
                  >
                    特殊型号获取对话记录
                  </Switch>
                </div>

                <Input
                  label="停止提示音"
                  labelPlacement="outside"
                  placeholder="请输入停止提示音内容"
                  value={formData.stop_tts_msg || ''}
                  onChange={(e) => updateField('stop_tts_msg', e.target.value)}
                  
                />

                <Input
                  label="单曲循环提示音"
                  labelPlacement="outside"
                  placeholder="请输入单曲循环提示音内容"
                  value={formData.play_type_one_tts_msg || ''}
                  onChange={(e) => updateField('play_type_one_tts_msg', e.target.value)}
                  
                />

                <Input
                  label="全部循环提示音"
                  labelPlacement="outside"
                  placeholder="请输入全部循环提示音内容"
                  value={formData.play_type_all_tts_msg || ''}
                  onChange={(e) => updateField('play_type_all_tts_msg', e.target.value)}
                  
                />

                <Input
                  label="随机播放提示音"
                  labelPlacement="outside"
                  placeholder="请输入随机播放提示音内容"
                  value={formData.play_type_rnd_tts_msg || ''}
                  onChange={(e) => updateField('play_type_rnd_tts_msg', e.target.value)}
                  
                />

                <Input
                  label="单曲播放提示音"
                  labelPlacement="outside"
                  placeholder="请输入单曲播放提示音内容"
                  value={formData.play_type_sin_tts_msg || ''}
                  onChange={(e) => updateField('play_type_sin_tts_msg', e.target.value)}
                  
                />

                <Input
                  label="顺序播放提示音"
                  labelPlacement="outside"
                  placeholder="请输入顺序播放提示音内容"
                  value={formData.play_type_seq_tts_msg || ''}
                  onChange={(e) => updateField('play_type_seq_tts_msg', e.target.value)}
                  
                />

                <div className="border-gray-200">
                  <Button 
                    color="success"
                    className="text-white"
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    保存更改
                  </Button>
                </div>
              </div>
            )}

            {selectedMenu === 'about' && (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-lg w-full space-y-8">
                  <div className="text-center space-y-8">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#31c27c] to-[#28a869] rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="">
                      <h3 className="text-2xl font-bold text-gray-800">SoundScape</h3>
                      <p className="text-gray-600 leading-relaxed">
                        本项目是为 <a href="https://github.com/hanxi/xiaomusic" target="_blank" rel="noopener noreferrer" className="text-[#31c27c] hover:text-[#28a869] underline">xiaomusic</a> 使用的前端项目
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 space-y-4 text-left mx-auto max-w-sm">
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">版本</span>
                        <span className="font-medium text-gray-800">{version}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">前端项目地址</span>
                        <span className="text-gray-400 text-sm"><a href="https://github.com/jhao0413/SoundScape" target="_blank" rel="noopener noreferrer" className="text-[#31c27c] hover:text-[#28a869] text-sm underline">
                          SoundScape
                        </a></span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">文档地址</span>
                        <a href="https://xdocs.hanxi.cc/" target="_blank" rel="noopener noreferrer" className="text-[#31c27c] hover:text-[#28a869] text-sm underline">
                          xdocs.hanxi.cc
                        </a>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        color="success"
                        className="text-white"
                        onClick={() => window.open('https://github.com/hanxi/xiaomusic', '_blank')}
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        访问后端项目
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
