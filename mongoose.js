const mongoose = require("../node-v14.13.0-win-x64/node_modules/npm/node_modules/mongoose");
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/27017', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

var db = mongoose.connection.once('open', () => {
    console.log("YAY");
}).on('error', () => {
    console.log("NOT YAY");
});

const itemsSchema = new Schema({
    name: String,
    tradable: Boolean,
    type: String
});

const inventorySchema = new Schema({
    accountId64: String,
    totalItems: String,
    items: [itemsSchema]
});

const InventoryItems = mongoose.model('inventoryItems', inventorySchema);

module.exports = InventoryItems;