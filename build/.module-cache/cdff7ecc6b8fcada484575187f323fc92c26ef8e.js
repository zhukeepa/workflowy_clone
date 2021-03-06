var I = Immutable; 
var L = I.List; 
var M = I.Map; 

var todos = L([
  M({ 
    text: "Buy milk", 
    children: L([
      M({ 
        text: "Kill the chickens", 
        children: L([
          M({
            text: "Murdr!", 
            children: [] 
          })
        ])
      })
    ])
  }), 
  M({
    text: "Buy eggse", 
    children: M([])
  })
])



function insertAtPath(xs, val, path) { 
  if (path.size == 0) { 
    throw new Error("Path must have path with positive length.")
  }

  var index = path.get(0); 
  if (path.size == 1) { 
    return xs.splice(index, 0, val);
  }
  
  var restOfPath = path.slice(1); 
  var child = xs.get(index); 
  var childPrime = insertAtPath(child, val, restOfPath); 
  return xs.splice(index, 1, childPrime)
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
      var t = this.props.get(i); 
      var path = this.props.path + i; 
      ret.push(React.createElement(TodoItemComponent, {text: t.get(text), path: path}));
      if (t.children.length > 0)
        ret.push(React.createElement(TodoListComponent, {items: t.get(children), path: path+"/"}));
    }
    return (React.createElement("ul", null, ret));
  } 
});

var TodoItemComponent = React.createClass({displayName: "TodoItemComponent",
  render: function() {
    return (
      React.createElement("li", null, 
        React.createElement("span", {onClick: this.props.onClick, contentEditable: true}, this.props.text)
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