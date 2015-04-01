var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { up: this.props.up, left: this.props.left, right: this.props.right, down: this.props.down, 
             collapsed: this.props.collapsed };
  },
  handleSubmit: function (e) {
    e.preventDefault();

    if (e.which == 13) {
      if (this.state.down == null) { 
        this.state.down = React.createElement(Item, {up: self, left: this.state.left})
      }
      else { 
        prevDown = this.state.down
        this.state.down = React.createElement(Item, {up: self, left: this.state.left, down: prevDown})
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