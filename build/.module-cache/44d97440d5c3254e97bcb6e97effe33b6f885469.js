var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', itemList: [], parentItem: this.props.parentItem }; 
  },
  handleSubmit: function () {},
  render: function() { 
    return (
      React.createElement("li", null, 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("input", {onChange: this.onChange, value: this.state.text.toUpperCase()}), 
          React.createElement("button", null, 'Add #' + (this.state.items.length + 1))
        ), "this.state.text"
      )
    );
  }
});

React.render(React.createElement(Item, null), document.getElementById('example'));