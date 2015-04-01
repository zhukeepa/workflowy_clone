var Item = React.createClass({displayName: "Item",
  getInitialState: function() { 
    return { text: 'moo', prev: null, next: null, parent: null, collapsed: false }; 
  },
  handleSubmit: function (e) {
    e.preventDefault();

    if (e.which == 13) {
      parentItem.itemList.insert_right_of(e)
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