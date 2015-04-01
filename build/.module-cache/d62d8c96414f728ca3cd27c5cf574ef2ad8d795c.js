var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', collapsed: false, left: null, right: null, up: null, down: null }
  },
  handleSubmit: function (e) {
    e.preventDefault();

    if (e.which == 13) {
      if (self.state.down == null) { 
        self.state.down = React.createElement(Item, {up: self, left: self.state.left})
      }
      else { 
        prevDown = self.state.down
        self.state.down = React.createElement(Item, {up: self, left: self.state.left, down: prevDown})
        prevDown.state.up = prevDown
      }
    }
  },
  getPreviousSibling: function () { 

  }, 
  getNextSibling: function() { 
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