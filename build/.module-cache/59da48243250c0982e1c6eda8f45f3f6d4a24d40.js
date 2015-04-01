var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', itemList: [], parentItem: this.props.parentItem }; 
  },
  textToLi: function(t) { 
    var li = document.createElement('li');
    li.innerHTML = t; 
    li.setAttribute('contenteditable', '');
    return li; 
  }, 
  render: function() { 
    return React.createElement("li", {contenteditable: ""}, "this.state.text")
  }
});

React.render(React.createElement(Item, null), document.getElementById('example'));