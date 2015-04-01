var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', itemList: [], parentItem: this.props.parentItem }; 
  }, 
  render: function() { 
    return(React.createElement("li", null, "self.state.text"));
  }
});

React.render(React.createElement(Item, null), document.getElementById('example'));