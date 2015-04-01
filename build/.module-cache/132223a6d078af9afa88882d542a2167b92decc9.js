var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { up: self.props.up, left: self.props.left, right: self.props.right, down: self.props.down, 
             collapsed: self.props.collapsed };
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

    this.state.left.setState(this.state.left.state)
  },
  getPreviousSibling: function () { 

  }, 
  getNextSibling: function() { 
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  render: function() { 
    a= (
      React.createElement("li", null, 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("input", {value: this.state.text, onChange: this.onChange})
        )
      )
    ); 
    var b = (this.state.down) ? this.state.down : React.createElement("div", null); 
    return 
    React.createElement("div", null, 
      a, 
      b
    )
  }
});

var root = React.createElement(Item, {parentItem: "root"}); 
var i1 = React.createElement(Item, {parentItem: root});

React.render(i1, document.getElementById('example'));