let currentMusicIndex = 0
let currentMusicCount = 0

let LyricBank = {
    startPosition: 0,
    startTime: 999,
    data: []
}
let currentLyric = []

let musicBank = []

let musicPlayer = document.getElementById('musicPlayer')

let lyricBox = document.getElementById('lyric')

let cloudApi = 'http://server.gadore.me:2333/'
let customUrl = 'http://music.163.com/playlist/72210253/68328243/?userid=68328243'

function getMusicList() {
    var data = {
        url: customUrl
    }
    $.post(cloudApi+'music', JSON.stringify(data), function (result) {
        musicBank = JSON.parse(result).data
        currentMusicCount = musicBank.length
        initCurrentMusicLists()
        setCurrentPlayMusic()
    });
}

function initCurrentMusicLists() {
    musicBank.forEach((song, index) => {
        var newSong = document.createElement('li')
        newSong.innerText = song.name
        newSong.id = 'song_' + index
        newSong.onclick = function () {
            document.getElementById('song_' + currentMusicIndex).style.color = 'black'
            currentMusicIndex = parseInt(newSong.id.split('_')[1])
            setCurrentPlayMusic()
        }
        document.getElementById('songLists').appendChild(newSong)
    })
}

function initKeyEvent(){
    document.onkeydown = function(e){
        switch(e.code){
            case 'Escape':
                if(document.getElementById('songListBox').classList.value.search('hide')== -1){
                    document.getElementById('songListBox').classList.add('hide')
                }else{
                    document.getElementById('songListBox').classList.remove('hide')
                }
                break;
            case 'Space':
                if(musicPlayer.paused){
                    musicPlayer.play()
                    document.getElementById('coverBox').classList.add('rotate')
                }else{
                    musicPlayer.pause()
                    document.getElementById('coverBox').classList.remove('rotate')
                }
                break;
        }
    }
}

function refreshScreen() {
    if(currentLyric[0] == 'no lyric'){
        return
    }
    setInterval(() => {
        if (LyricBank.data[LyricBank.startPosition + 1] != undefined) {
            var pri = parseFloat(musicPlayer.currentTime - LyricBank.data[LyricBank.startPosition].timePosition)
            var nxt = parseFloat(LyricBank.data[LyricBank.startPosition + 1].timePosition - musicPlayer.currentTime)
            if (pri >= nxt && (LyricBank.data[LyricBank.startPosition + 1].timePosition - musicPlayer.currentTime) < 0) {
                document.getElementById('lyric_' + LyricBank.startPosition).style.color = 'gray'
                LyricBank.startPosition++
                document.getElementById('lyric_' + LyricBank.startPosition).style.color = 'red'
                document.getElementById('lyric_' + LyricBank.startPosition).scrollIntoView()
            }
        }
    }, 1000)
}

function fetchCoverImage(){
    var data = {
        url: 'https://music.163.com/song?id=' + getMusicIdByIndex(currentMusicIndex)
    }
    $.post(cloudApi+'cover', JSON.stringify(data), function (result) {
        result = JSON.parse(result)
        document.getElementById('cover').setAttribute('src',result.data)
    });
}

function fetchMusicLyrics(id) {
    $.ajax({
        type: "get",
        url: 'http://music.163.com/api/song/media?id=' + id,
        dataType: "jsonp",
        jsonp: "callback",
        success: function (data) {
            currentLyric.length = 0
            var currentLyricStr = data.lyric
            if(currentLyricStr != undefined){
                currentLyric = currentLyricStr.split(/[\r\n]/g)
            }else{
                currentLyric.push('no lyric')
            }
            computeLyric()
        }
    });
}

function computeLyric() {
    LyricBank.startPosition = 0
    LyricBank.startTime = 999
    LyricBank.data.length = 0
    lyricBox.innerHTML = ""
    if(currentLyric[0] == 'no lyric'){
        return
    }
    currentLyric.forEach((item, index) => {
        var tempLine = item.substr(1, 8).replace(':', '')
        var lyric = new Object()
        var li = document.createElement('li')
        li.id = 'lyric_' + index
        if (!isNaN(tempLine)) {
            var timeStr = item.substr(1, 8)
            var m = parseInt(timeStr.split(':')[0])
            var s = parseFloat(timeStr.split(':')[1])
            lyric.timePosition = m * 60 + s
            if (lyric.timePosition < LyricBank.startTime) {
                LyricBank.startTime = lyric.timePosition
                LyricBank.startPosition = index
            }
            lyric.text = item.split(']')[1] == undefined ? ' ': item.split(']')[1]
            li.innerText = lyric.text
            LyricBank.data.push(lyric)
        } else {
            lyric.timePosition = NaN
            lyric.text = item == undefined ? ' ' : item
            li.innerText = lyric.text
            LyricBank.data.push(lyric)
        }
        lyricBox.appendChild(li)
    })
    document.getElementById('lyric_' + LyricBank.startPosition).style.color = 'red'
    document.getElementById('lyric_' + LyricBank.startPosition).scrollIntoView()
}

function getMusicIdByIndex(index) {
    return musicBank[index].id.split('=')[1]
}

function setCurrentPlayMusic() {
    var musicUrl = 'http://music.163.com/song/media/outer/url?id=' + getMusicIdByIndex(currentMusicIndex) + '.mp3'
    document.getElementById('currentMusicName').innerText = musicBank[currentMusicIndex].name
    musicPlayer.setAttribute('src', musicUrl)
    document.getElementById('song_' + currentMusicIndex).style.color = 'blue'
    fetchMusicLyrics(getMusicIdByIndex(currentMusicIndex))
    fetchCoverImage()
    if(!musicPlayer.paused){
        if(document.getElementById('coverBox').classList.value.search('rotate') == -1)
            document.getElementById('coverBox').classList.add('rotate')
    }
}

function playNextOne() {
    currentMusicIndex++
    currentMusicIndex = parseInt(currentMusicIndex % currentMusicCount)
    setCurrentPlayMusic()
}

initKeyEvent()