var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', itemList: [], parentItem: null, collapsed: false }; 
  },
  handleSubmit: function (e) {
    e.preventDefault();
  },
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

var root = React.createElement(Item, {parentItem: "root"}); 
var i1 = React.createElement(Item, {parentItem: root});

React.render(i1, document.getElementById('example'));