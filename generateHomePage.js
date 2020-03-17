const path = require('path')
const fs = require('fs')

var currentHref = process.argv[2]

var homeDir = __dirname
var listDir = fs.readdirSync('./')
var dirCount = 0
fs.readFile('./serverConfig.json',function(error,data){
    if(error){
        return console.error(error);
    }
    var config = data.toString()
    config = JSON.parse(config)
    config.dirBank = []
    listDir.forEach(f => {
        if (f != '.git' && f != 'static') {
            var newSite = new Object()
            newSite.title = f
            let fullPath = homeDir + '/' + f
            let fileStatus = fs.statSync(fullPath)
            if (fileStatus.isDirectory()) {
                newSite.url = currentHref + f
                console.log(newSite.title)
                config.dirBank.push(newSite)
                dirCount++
            }
        }
    });
    fs.writeFile('./serverConfig.json',JSON.stringify(config),function(error){
        if(error){
            console.log(error)
        }
        console.log('>>>\nGenerate ' + dirCount + ' sub site success !')
    })
})
