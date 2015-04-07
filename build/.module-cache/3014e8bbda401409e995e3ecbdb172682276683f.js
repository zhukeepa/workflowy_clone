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



function insertAfterPath(xs, val, path) { 
  if (path.size == 0) { 
    throw new Error("Path must have path with positive length.")
  }

  var index = path.get(0); 
  if (path.size == 1) { 
    return xs.splice(index + 1, 0, val);
  }
  
  var restOfPath = path.slice(1); 
  var child = xs.get(index); 
  child = child.set("children", insertAfterPath(child.get("children"), val, restOfPath)); 
  return xs.splice(index, 1, child);
}

var EditorComponent = React.createClass({displayName: "EditorComponent",
  getInitialState: function() { 
    return { todos: this.props.todos };
  },
  insertFromAbsolutePath: function(path) {
    console.log(path.toString());
    var blank = M({ text: "", children: L()});
    var todos = insertAfterPath(this.state.todos, blank, path);
    console.log(this.state.todos.toString());
    console.log(todos.toString());
    this.setState({ todos: todos }); 
  }, 
  render: function () { 
    return React.createElement(TodoListComponent, {items: this.state.todos, 
                              path: L([]), 
                              keypressHandler: this.insertFromAbsolutePath})
  }
})

var TodoListComponent = React.createClass({displayName: "TodoListComponent",
  render: function() { 
    ret = []; 
    for (var i = 0; i < this.props.items.length; i++) {
      var t = this.props.items.get(i); 
      var path = this.props.path.push(i); 
      ret.push(React.createElement(TodoItemComponent, {text: t.get("text"), 
                                  path: path, 
                                  keypressHandler: this.props.keypressHandler.bind(null, path)}));
      if (t.get("children").size > 0) {
        ret.push(React.createElement(TodoListComponent, {items: t.get("children"), 
                                    path: path, 
                                    keypressHandler: this.props.keypressHandler}));
      }
    }
    return (React.createElement("ul", null, ret));
  } 
});

var TodoItemComponent = React.createClass({displayName: "TodoItemComponent",
  getInitialState: function() { 
    return { focus: false }
  }, 
  setFocus: function() { 
    this.setState({ focus: !this.state.focus });
  },
  render: function() {
    var cx = React.addons.classSet;
    var spanClasses = cx({
      'hide': this.state.focus
    });
    var inputComponentClasses = cx({
      'hide': !this.state.focus
    });
    console.log(spanClasses, inputComponentClasses);
    return (
      React.createElement("li", {onClick: this.setFocus}, 
        React.createElement("span", {className: spanClasses}, this.props.text), 
        React.createElement(InputComponent, {className: inputComponentClasses, initValue: this.props.text, keypressHandler: this.props.keypressHandler})
      )
    ); 
  } 
});

var InputComponent = React.createClass({displayName: "InputComponent",
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() { 
    return { text: this.props.initValue }; 
  },
  render: function() {
    return React.createElement("input", {className: this.props.className, onKeypress: this.props.keypressHandler, valueLink: this.linkState('text')});
  }
});

React.render(React.createElement(EditorComponent, {todos: todos}), document.getElementById('example'));