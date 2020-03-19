var request = require('request');
var fs = require('fs')
var cheerio = require('cheerio')

request('http://music.163.com/playlist/72210253/68328243/?userid=68328243', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body)
        var tags = $('ul.f-hide')
        var songs = []
        tags[0].childNodes.forEach(tag => {
            var music = new Object()
            music.name = tag.childNodes[0].childNodes[0].data
            music.id = tag.childNodes[0].attribs.href
            songs.push(music)
        });
        console.log(songs)
    }
})