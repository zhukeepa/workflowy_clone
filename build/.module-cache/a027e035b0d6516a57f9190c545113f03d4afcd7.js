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

var i1 = React.createElement(Item, {}); 
var i2 = React.createElement(Item, {});
var i3 = React.createElement(Item, {});
//i1.setState({itemList: [i2, i3]});
i2.setState({parentItem: i1});
i3.setState({parentItem: i1});

React.render(i1, document.getElementById('example'));