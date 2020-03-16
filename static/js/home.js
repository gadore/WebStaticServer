var configPath = './serverConfig.json'

    function mkSubSiteList(bank){
        bank.forEach(dir => {
            console.log(dir)
            var a = document.createElement('a')
            a.innerText = dir
            a.setAttribute('href',dir)
            document.getElementById('container').appendChild(a)
        });
    }

    function getJsonContentFromServer() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', configPath, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (this.status == 200) {
                var file = new File([this.response], 'temp');
                var fileReader = new FileReader();
                fileReader.addEventListener('load', function () {
                    mkSubSiteList(JSON.parse(fileReader.result).dirBank)
                });
                fileReader.readAsText(file);
            }
        }
        xhr.send();
    }