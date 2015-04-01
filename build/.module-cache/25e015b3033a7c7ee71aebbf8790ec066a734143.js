function Node(up, down, left, right) { 
  this.up = up; 
  this.down = down; 
  this.left = left; 
  this.right = right; 
}

var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { up: this.props.up, down: this.props.down, left: this.props.left, right: this.props.right, collapsed: this.props.collapsed || false };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    if (this.state.node.down == null) { 
      Node.new()
      this.setState({down: React.createElement(Item, {up: self, left: this.state.left})});
    }
    else { 
      prevDown = this.state.down
      this.setState({down: React.createElement(Item, {up: self, left: this.state.left, down: prevDown}), 
                     up: prevDown}); 
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
    a= (
      React.createElement("li", null, 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("input", {value: this.state.text, onChange: this.onChange})
        )
      )
    ); 
    var b = (this.state.down) ? this.state.down : React.createElement("div", null); 
    return (
      React.createElement("div", null, 
        a, 
        b
      ));
  }
});

var root = React.createElement(Item, {parentItem: "root"}); 
var i1 = React.createElement(Item, {parentItem: root});

React.render(i1, document.getElementById('example'));