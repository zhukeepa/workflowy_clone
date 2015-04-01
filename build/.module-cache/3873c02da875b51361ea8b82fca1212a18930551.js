var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', itemList: [], parentItem: null }; 
  },
  handleSubmit: function () {},
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  render: function() { 
    return (
      React.createElement("li", null, 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("input", {value: this.state.text, onChange: this.onChange}), 
          React.createElement("ul", null, 
            "//", itemList.map(function(i) { i.render(); })
          )
        )
      )
    );
  }
});

var i1 = React.createElement(Item); 
var i2 = React.createElement(Item, {parentItem: i1});
var i3 = React.createElement(Item, {parentItem: i2});

React.render(i1, document.getElementById('example'));