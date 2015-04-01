var todos = [ 
  { 
    text: "Buy milk", 
    children: [
      { 
        text: "Kill the chickens", 
        children: [
          {
            text: "Murdr!", 
            children: [] 
          }
        ] 
      }
    ]
  }, 
  {
    text: "Buy eggse", 
    children: [
      { 
        text: "Kill the chickens", 
        children: [
          {
            text: "Murdr!", 
            children: [] 
          }
        ] 
      }
    ]
  }
]

function Tree(text, children) { 
  this.text = text; 
  this.children = children; 
}

Tree.prototype.insertBelowFromAbsolutePath = function(text, path) { 
  //javascript error-handling?? 
  var re = /\/(\d*)(.*)/;
}

function insertIntoTreeFromPath(tree, text, path) { 

}

var EditorComponent = React.createClass({displayName: "EditorComponent",
  getInitialState: function() { 
    return { todos: this.props.todos };
  },
  insertFromAbsolutePath: function() { 
  }, 
  render: function () { 
    return React.createElement(TodoListComponent, {items: this.state.todos, path: "/"})
  }
})

var TodoListComponent = React.createClass({displayName: "TodoListComponent",
  render: function() { 
    ret = []; 
    for (var i = 0; i < this.props.items.length; i++) {
      var t = this.props.items[i]; 
      var path = this.props.path + i; 
      ret.push(React.createElement(TodoItemComponent, {text: t.text, path: path}));
      if (t.children.length > 0)
        ret.push(React.createElement(TodoListComponent, {items: t.children, path: path+"/"}));
    }
    return (React.createElement("ul", null, ret));
  } 
});

var TodoItemComponent = React.createClass({displayName: "TodoItemComponent",
  render: function() {
    return (
      React.createElement("li", null, 
        React.createElement("span", {onClick: this.props.onClick, contentEditable: true}, this.props.path)
      )
    ); 
  } 
});

React.render(React.createElement(EditorComponent, {todos: todos}), document.getElementById('example'));

// function Node(up, down, left, right) { 
//   this.up = up; 
//   this.down = down; 
//   this.left = left; 
//   this.right = right; 
// }

// var Item = React.createClass({
//   getInitialState: function() { 
//     return { up: this.props.up, down: this.props.down, left: this.props.left, right: this.props.right/*, collapsed: this.props.collapsed || false*/ };
//   },
//   handleSubmit: function (e) {
//     e.preventDefault();

//     if (!this.state.down) { 
//       this.setState({down: {up: this.state, left: this.state.left}});
//     }
//     else { 
//       var oldState = jQuery.extend(true, {}, this.state); 
//       var prevDown = jQuery.extend(true, {}, this.state.down);
//       console.log(JSON.stringify(oldState));
//       console.log(JSON.stringify(prevDown));
    
//       this.setState({down: {up: oldState, left: this.state.left, down: prevDown}}); 
//       console.log("\n");
//     }
//   },
//   render: function() { 
//     a= (
//       <li>
//         <form onSubmit={this.handleSubmit}>
//           <input value={this.state.text} onChange={this.onChange} />
//         </form>
//       </li>
//     ); 
//     b = <div />
//     if (this.state.down) {
//       c = this.state.down;
//       b = <Item up={c.up} down={c.down} right={c.right} left={c.left} />
//     }
//     return (
//       <div>
//         {a}
//         {b}
//       </div>);
//   }
// });

// var root = React.createElement(Item, {parentItem: "root"}); 
// var i1 = React.createElement(Item, {parentItem: root});

// React.render(i1, document.getElementById('example'));