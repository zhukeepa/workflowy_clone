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
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("input", {value: this.state.text, onChange: this.onChange})
        )
      )
    );
  }
});

var I1 = React.createElement(Item); 

React.render(I1, document.getElementById('example'));