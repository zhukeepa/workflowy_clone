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

    if (!this.state.down) { 
      this.setState({down: {up: this.state, left: this.state.left}});
    }
    else { 
      alert(JSON.stringify(this));
      alert(JSON.stringify(this.state.down));
      
      prevDown = this.state.down
      this.setState({down: {up: this.state, left: this.state.left, down: prevDown}}); 
      alert(JSON.stringify(this.state));
    }
  },
  render: function() { 
    a= (
      React.createElement("li", null, 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("input", {value: this.state.text, onChange: this.onChange})
        )
      )
    ); 
    b = React.createElement("div", null)
    if (this.state.down) {
      c = this.state.down;
      b = React.createElement(Item, {up: c.up, down: c.down, right: c.right, left: c.left})
    }
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