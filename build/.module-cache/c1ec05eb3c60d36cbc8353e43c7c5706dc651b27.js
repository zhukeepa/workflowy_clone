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
  child = child.set("children", insertAtPath(child.get("children"), val, restOfPath)); 
  return xs.splice(index, 1, child);
}

var EditorComponent = React.createClass({displayName: "EditorComponent",
  getInitialState: function() { 
    return { todos: this.props.todos };
  },
  insertFromAbsolutePath: function() { 
  }, 
  render: function () { 
    return React.createElement(TodoListComponent, {items: this.state.todos, path: L([])})
  }
})

var TodoListComponent = React.createClass({displayName: "TodoListComponent",
  render: function() { 
    ret = []; 
    for (var i = 0; i < this.props.items.length; i++) {
      var t = this.props.items.get(i); 
      var path = this.props.path.push(i); 
      ret.push(React.createElement(TodoItemComponent, {text: t.get("text"), path: path}));
      if (t.get("children").size > 0)
        ret.push(React.createElement(TodoListComponent, {items: t.get("children"), path: path}));
    }
    return (React.createElement("ul", null, ret));
  } 
});

var TodoItemComponent = React.createClass({displayName: "TodoItemComponent",
  render: function() {
    return (
      React.createElement("li", null, 
        React.createElement("span", {onClick: this.props.onClick}, this.props.path.toString())
      )
    ); 
  } 
});

React.render(React.createElement(EditorComponent, {todos: todos}), document.getElementById('example'));