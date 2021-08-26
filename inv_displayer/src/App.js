import React, { Component } from 'react';
import './App.css';


//const market = require('D:/COLLEGE CRAP/Y2/WebDev/node-v14.13.0-win-x64/node_modules/npm/node_modules/steam-market-pricing');

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post: '', // steamid
      gameCode: 730, // gameCode
      responseToPost: '',
      item: ''
    }
  }


  onChange = (e) => {
    this.setState({ gameCode: e.target.value });
  }

  async showInfo(item) {
    document.getElementById("loading").style.visibility = "visible";
    this.setState({item: item});
    var response = await fetch('https://skinMart.vipulbhardwaj.repl.co/more-info', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': 'https://skinMart.vipulbhardwaj.repl.co',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: item })
    });
    var data = await response.json();
    if(data.success === true) {
      alert("Current lowest price for " + data.market_hash_name + " : " + data.lowest_price + "\nCurrent median price for " + data.market_hash_name + " : " + data.median_price + "\nCurrent volume of " + data.market_hash_name + " on the community : " + data.volume);
    }
    else if(data.statusCode === 500) {
      alert(item + " is non-marketable :(");
    }
    else {
      alert(item + " is non-marketable :(");
    }
    document.getElementById("loading").style.visibility = "hidden";
  }

  handleSubmit = async e => {
    //this.setState({gameCode: this.input.gameCodeValue});
    e.preventDefault();
    document.getElementById("loading").style.visibility = "visible";
    this.setState({post: this.input.value});
    this.state.post = this.input.value;

    var response = await fetch('https://skinMart.vipulbhardwaj.repl.co/', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': 'https://skinMart.vipulbhardwaj.repl.co',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post, gameCode: this.state.gameCode })
    });
    var data = await response.json();
    this.setState({ responseToPost: data });
    //console.log(this.state.responseToPost);
    document.getElementById("invTable").style.display = "block";
    document.getElementById("loading").style.visibility = "hidden";
  };
  
  render() {
    var inventory = this.state.responseToPost;
    //console.log(inventory);
    //console.log(inventory.totalItems);
    return (
      <React.Fragment>
        <div id="form_bg">
          <form class="form-container" onSubmit={ this.handleSubmit }> 
            <input type="text" name="post" required="required" id="steamID" class="form-item" ref={(input)=>this.input = input} placeholder="Enter a 17 digit unique ID"/>
            <div class="form-item">
              <label>Select a Game : </label>    
              <select id = "myList" value={ this.state.gameCode } onChange={ this.onChange }>
                <option selected value = "730">Counter-Strike: Global Offensive</option>
                <option value = "440">Team Fortress 2</option>
                <option value = "578080">PUBG</option>
                <option value = "304930">Unturned</option>
                <option value = "570">Dota 2</option>
                <option value = "218620">PAYDAY 2</option>
              </select>
            </div>  
            <button class="form-item" id="submitID" type="submit" title="Clicking or what?"><strong>SHOW INVENOTRY</strong></button>
          </form>
          <hr id="loading"/>
        </div>
        <p className="id_disp">Account ID = { this.state.post },&nbsp;&nbsp;&nbsp;&nbsp;Total Items = { inventory.totalItems }</p>
        <table id="invTable">
          <tbody>
            <tr>
              <th className="itemHeadings">Item Names</th><th className="itemHeadings">Tradability</th><th className="itemHeadings">Type</th>
            </tr>
            { (inventory.items !== undefined) && (inventory.items.map (
                item => {
                  return (
                    <tr key = {item._id}>
                      <td onClick={ this.showInfo.bind(this, item.name) } className="moreInfo" title="Click for the item's current price" style={{height: '40px', border: '1px solid red', color: 'white', width: '50%'}}><div class="underline">{ item.name }</div></td>
                      <td style={{height: '40px', border: '1px solid red', color: 'white', width: '20%'}}>{ JSON.stringify(item.tradable) }</td>
                      <td style={{height: '40px', border: '1px solid red', color: 'white', width: '30%'}}>{ item.type }</td>
                    </tr>
                  )
                }
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
