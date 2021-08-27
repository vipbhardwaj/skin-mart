import React, { Component } from 'react';
import './App.css';

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
    
    document.getElementById("loading").style.visibility = "hidden";
    
    if(data.success === true) alert("Current lowest price for " + data.market_hash_name + " : " + data.lowest_price + "\nCurrent median price for " + data.market_hash_name + " : " + data.median_price + "\nCurrent volume of " + data.market_hash_name + " on the community : " + data.volume);
    else if(data.statusCode === 500) alert(item + " is non-marketable :(");
    else alert(item + " is non-marketable :(");
  }

  handleSubmit = async e => {
    e.preventDefault();
    document.getElementById("loading").style.visibility = "visible";
    document.getElementById("invTable").style.display = "none";

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
    
    if(!(data.totalItems.isNaN) && data.totalItems) document.getElementById("invTable").style.display = "block";
    
    document.getElementById("loading").style.visibility = "hidden";
  };
  
  render() {
    var inventory = this.state.responseToPost;
    
    return (
      <React.Fragment>
        <div id="form_bg">
          <form className="form-container" onSubmit={ this.handleSubmit }> 
            <input type="text" name="post" required="required" id="steamID" className="form-item" ref={(input)=>this.input = input} placeholder="Enter a 17 digit unique ID"/>
            <div className="form-item">
              <label>Select a Game : </label>    
              <select id = "myList" value={ this.state.gameCode } onChange={ this.onChange }>
                <option defaultValue = "730">Counter-Strike: Global Offensive</option>
                <option value = "440">Team Fortress 2</option>
                <option value = "578080">PUBG</option>
                <option value = "304930">Unturned</option>
                <option value = "570">Dota 2</option>
                <option value = "218620">PAYDAY 2</option>
              </select>
            </div>  
            <button className="form-item" id="submitID" type="submit" title="Clicking or what?"><strong>SHOW INVENOTRY</strong></button>
          </form>
          <hr id="loading"/>
        </div>
        <p className="id_disp">Account ID = { this.state.post },&nbsp;&nbsp;&nbsp;&nbsp;Total Items = { inventory.totalItems }</p>
        <div id="invTable">
          <div className="gridHead">
            <div className="itemHeadings">Item Names</div><div className="itemHeadings">Tradability</div><div className="itemHeadings">Type</div>
          </div>
          {(inventory.items !== undefined) && (inventory.items.map (
            item => {
              return (
                <div className="underline-table" key={item.id}>
                  <div className="moreInfo" key={item.id}>
                    <div><div className="item-name" onClick={ this.showInfo.bind(this, item.name) } title="Click for the item's current price">{ item.name }</div></div>
                    <div>{ JSON.stringify(item.tradable) }</div>
                    <div>{ item.type }</div>
                  </div>
                </div>
              );
            }
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
