### 获取音乐列表
> /musiclist

请求方式：GET

返回数据

```json
{
    "所有歌曲": ["歌曲1", "歌曲2", ...],
    "收藏": ["歌曲A", "歌曲B", ...],
    "全部": ["歌曲1", "歌曲2", ...],
    "下载": [],
    "其他": [],
    "最近新增": [...],
    "QQ音乐": [...]
}
```

### 获取音乐信息

> /musicinfo

请求方式：GET

```http
/musicinfo?musictag=true&name=Every%20Time%20We%20Touch
```

返回数据

```json
{
  "ret": "OK",
  "name": "Every Time We Touch", //音乐名称
  "url": "http://192.168.110.56:8090/music/download/QQ%E9%9F%B3%E4%B9%90/Every%20Time%20We%20Touch.mp3", //音乐URL
  "tags": {
    "title": "Every Time We Touch", //音乐名称
    "artist": "Dream Tunes", //音乐艺术家
    "album": "Every Time We Touch", //音乐专辑
    "year": "",
    "genre": "Blues",
    "picture": "",
    "lyrics": ""
  }
}

```

### 搜索音乐
> searchmusic

请求方式：GET

```http
searchmusic?name=Every%20Time%20We%20Touch
```

返回数据

```json
["歌曲1", "歌曲2", ...]
```

### 设置音量
> setvolume

请求方式：POST

请求参数
```json
{
  "did": "795858788",
  "volume": 28
}
```

返回数据

```json
{
  "ret": "OK",
  "volume": 28
}
```

### 获取音量
> getvolume

请求方式：GET

```http
getvolume?did=795858788
```

返回数据

```json
{
  "ret": "OK",
  "volume": 28
}
```

### 发送命令
> cmd

active_cmd： "play,search_play,set_play_type_rnd,playlocal,search_playlocal,play_music_list,play_music_list_index,stop_after_minute,stop"

### 播放音乐
> playmusiclist

请求方式：POST

请求参数
```json
{
  "did": "795858788",
  "listname": "所有歌曲",
  "musicname": "Bones"
}
```

返回数据

```json
{
  "ret": "OK"
}
```

### 获取当前播放音乐进度
> playingmusic

请求方式：GET

返回数据

```json
{
  "ret": "OK",
  "is_playing": false, // 播放状态
  "cur_music": "Better Broken (Explicit)", // 当前播放音乐
  "cur_playlist": "所有歌曲", // 当前播放列表
  "offset": 0, // 当前播放进度
  "duration": 196 // 音乐总时长
}
```