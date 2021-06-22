const steamid = "76561198982458696";
const assetid = '19448456492';
const fs = require('fs');
const fetch = require('node-fetch');

var url = "https://steamcommunity.com/profiles/" + steamid + "/inventory/#730_2_"+ assetid;

fetch(url)
.then((res)=> res.text())
.then((res) => {
    fs.writeFile('./inv_desc_right/' + assetid + '.html', res, function(err){
        if(err) throw err;
        console.log("DONE");
    })
});