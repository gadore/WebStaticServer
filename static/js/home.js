var configPath = './serverConfig.json'

    function mkSubSiteList(bank){
        bank.forEach(site => {
            // console.log(site)
            var a = document.createElement('a')
            a.innerText = site.title
            a.setAttribute('href',site.url)
            document.getElementById('linkBox').appendChild(a)
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