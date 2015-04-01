var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', itemList: [], parentItem: this.props.parentItem }; 
  },
  handleSubmit: function () {},
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  render: function() { 
    return (
      React.createElement("li", null, 
        React.createElement("form", {onSubmit: this.handleSubmit, onChange: this.onChange}, 
          React.createElement("input", {value: this.state.text})
        )
      )
    );
  }
});

React.render(React.createElement(Item, null), document.getElementById('example'));