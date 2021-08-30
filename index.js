const express = require('./inv_displayer/node_modules/express');
const path = require('./inv_displayer/node_modules/path');
const bodyParser = require('./inv_displayer/node_modules/body-parser');
const market = require('./inv_displayer/node_modules/steam-market-pricing');
const InventoryApi = require('./inv_displayer/node_modules/steam-inventory-api/dist/index.js');
const inventoryLayout = require("./mongoose");
//const { name } = require('D:/COLLEGE CRAP/Y2/WebDev/skinMart/node_modules/body-parser');
//var MongoClient=require('./inv_displayer/node_modules/mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";


const app = express();   ///initiates express
const inventoryApi = Object.create(InventoryApi);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname)));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname, '/'));
});

app.post('/', (req, response) => { // 2 way thingy
    //STEAM API CODE.
    inventoryApi.init           // initialising the STEAM inventory API object using init.
    ({
        id : 'V.1',
        proxyRepeat : 1,
        maxUse : 25,
        requestInterval : 60*1000,
    });

    const contextid = 2;
    const appid = req.body.gameCode;
    const start_assetid = req.body.gameCode;    //game  inventory
    const count = 5000;
    const language = 'english';
    const tradable = false;
    const steamid = req.body.post;      // user inventory
    console.log('\n\n\t\t\t\t' + steamid);

    inventoryApi.get            //sends a get request to steam url, www.steamcommunity.com/user_id/game
    ({
        appid,
        contextid,
        steamid,
        tradable,
        language,
        count,
        start_assetid,
    })
    .then((res) => {        // if promise is resolved
        console.log(res);
        var myInventory = ({
            accountId64: steamid,
            totalItems: res.total, // = 0
            items: []
        });
        res.items.map(      // iterating the inventory
            item => {
                var obj = {
                    id: assetid,
                    name: item.market_hash_name,
                    tradable: item.tradable,
                    type: item.type
                }
                //console.log(obj);
                myInventory.items.push(obj);
            }
        );
        console.log('saving Inventory');
        response.json(myInventory);
        //fs.writeFileSync('./inv_displayer/src/inventories/' + steamid + '.json', JSON.stringify(myInventory));
        
        
                                        //SAVING STUFF INTO DATABASE.
        // MONGO STUFF ////////////////////////////////////////////////////////////////////////////////////////////////
        /*MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
            if (err) throw err;
            var db = client.db("inventories");
            db.collection("customers").insertOne(myInventory, function(err) {
              if (err) throw err;
              console.log("1 document inserted");
              client.close();
            });
        });*/
          ////////////////////////////////////////////////////////////////////////////////////////////////////
    })
    .catch((err) => {       // if response is reject
        if(err.statusCode === 500) {
            //console.log(err + "\nError 500, INVENTORY INACCESSIBLE\tThis was a Steam Server side error, Inventory is public but our request to steam didn't get any response back from steam servers.");
            var myInventory = inventoryLayout({
                totalItems: "Error 500, This was a Steam Server side error, Inventory is public, but our request to steam didn't get any response back from steam servers."
            });
        }
        else if(err.statusCode === 403) {
            //console.log(err + '\nError 403, INVENTORY INACCESSIBLE\tMake Your Inventory Public Please :(');
            var myInventory = inventoryLayout({
                totalItems: "Error "+ err.statusCode +", Make Your Inventory Public Please :("
            });
        }
        else {
            //console.log(err + '\nError, INVENTORY INACCESSIBLE :(');
            var myInventory = inventoryLayout({
                totalItems: "Error "+ err.statusCode +", INVENTORY INACCESSIBLE"
            });
        }
        response.json(myInventory);
    })
});

app.post('/more-info', (req, res) => {      // a post request to steam-market-pricing API for the price oof an item.
    const item = req.body.item;
    market.getItemPrice(730, item).then((price) => {
        console.log(price);
        res.json(price);
    }).catch((err) => {
        console.log(err);
        res.json(err);
    })
})

const PORT = process.env.port || 6969;

app.listen(PORT, () => console.log('Server hosted on port ' + PORT));
