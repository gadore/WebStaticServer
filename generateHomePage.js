const path = require('path')
const fs = require('fs')

console.log(process.argv)

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
            let fullPath = homeDir + '/' + f
            let fileStatus = fs.statSync(fullPath)
            if (fileStatus.isDirectory()) {
                f = currentHref + f
                console.log(f)
                config.dirBank.push(f)
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
