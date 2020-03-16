const path = require('path')
const fs = require('fs')

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
        if (f != '.git') {
            let fullPath = homeDir + '/' + f
            let fileStatus = fs.statSync(fullPath)
            if (fileStatus.isDirectory()) {
                f = 'http://server.gadore.me:5050/' + f
                f = config.dirBank.length == 0 ? f : ',' + f
                console.log(f)
                config.dirBank.push(f)
                dirCount++
                console.log(config.dirBank)
            }
        }
    });
    fs.writeFile('./serverConfig.json',JSON.stringify(config),function(error){
        if(error){
            console.log(error)
        }
        console.log('Generate ' + dirCount + ' sub site success!')
    })
})
