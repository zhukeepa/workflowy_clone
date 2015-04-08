// mouse clicks
// css prettificaiton
// autofocus
// make the mouse array jump to exactly the right position 
// how does React know to sync the form when you press enter?
// learn inheritance, and make classes for everything
// make the backspace work when you're empty, and first child
// think about how oneDown should really work


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
            children: L([]) 
          }), 
          M({
            text: "Death!", 
            children: L([]) 
          })
        ])
      })
    ])
  }), 
  M({
    text: "Buy eggse", 
    children: L([])
  })
])

// path function. takes in callback, and opt way of accessing child element
// oneListOp 
var EditorComponent = React.createClass({displayName: "EditorComponent",
  getInitialState: function() { 
    return { todos: this.props.todos };
  },
  setFocusFromPath: function(path, jumpto) { 
    var list = this.refs.topTodoList; 
    for (var i = 0; i < path.size - 1; ++i) {
      list = list.refs['list'+path.get(i)];
    }
    var item = list.refs['item'+path.get(i)]; 
    item.setFocus(jumpto);
  },
  keyDownHandler: function(path, e) { 
    switch (e.which) { 
      // enter key
      case 13:
        e.preventDefault(); 
        var form = e.target; 
        var updatedVal = form.value.slice(0, form.selectionStart); 
        var newVal = form.value.slice(form.selectionEnd, form.value.length)

        var tmp = updateAndInsertAtPath(this.state.todos, path, updatedVal, newVal); 
        var newTodos = tmp[0]; 
        var newPath  = tmp[1]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(newPath);
        });
        break; 

      // backspace key
      case 8: 
        var form = e.target; 
        if (form.selectionEnd > 0)
          break; 

        e.preventDefault();

        var tmp = mergeWithAboveAtPath(this.state.todos, path, form.value); 
        var newTodos = tmp[0]; 
        var newPath  = tmp[1]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(newPath);
        });
        break; 

      // tab
      case 9:
        e.preventDefault(); 
        if (!e.shiftKey) {
          var form = e.target; 
          var tmp = addIndentAtPath(this.state.todos, path, form.value); 
          var newTodos = tmp[0]; 
          var newPath  = tmp[1]; 

          this.setState({todos: newTodos}, function () { 
            this.setFocusFromPath(newPath);
          });
        }
        else {
          var form = e.target; 
          var tmp = removeIndentAtPath(this.state.todos, path, form.value); 
          var newTodos = tmp[0]; 
          var newPath  = tmp[1]; 

          this.setState({todos: newTodos}, function () { 
            this.setFocusFromPath(newPath);
          });
        }
        break; 

      //left key
      case 37: 
        var form = e.target; 
        if (form.selectionEnd > 0)
          break; 

        var newTodos = replaceTextAtPath(this.state.todos, path, form.value)[0]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(oneUp(path, newTodos), form.selectionEnd); 
        });

      // up key
      case 38: 
        var form = e.target; 
        var newTodos = replaceTextAtPath(this.state.todos, path, form.value)[0]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(oneUp(path, newTodos), form.selectionEnd); 
        });
        break; 

      //right key
      case 39: 
        var form = e.target; 
        if (form.selectionEnd < form.value.length-1)
          break; 

        var newTodos = replaceTextAtPath(this.state.todos, path, form.value)[0]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(oneDown(path, newTodos), form.selectionEnd); 
        });

      //down key 
      case 40: 
        var form = e.target; 
        var newTodos = replaceTextAtPath(this.state.todos, path, form.value)[0]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(oneDown(path, newTodos),form.selectionEnd); 
        });
        break; 
    }
  },
  render: function () { 
    return React.createElement(TodoListComponent, {items: this.state.todos, 
                              path: L([]), 
                              keyDownHandler: this.keyDownHandler, 
                              ref: "topTodoList"})
  }
})

var TodoListComponent = React.createClass({displayName: "TodoListComponent",
  render: function() { 
    ret = []; 
    for (var i = 0; i < this.props.items.size; i++) {
      var t = this.props.items.get(i); 
      var path = this.props.path.push(i); 
      ret.push(React.createElement(TodoItemComponent, {text: t.get("text"), 
                                  path: path, 
                                  ref: "item"+i.toString(), 
                                  keyDownHandler: this.props.keyDownHandler.bind(null, path)}));
      if (t.get("children").size > 0) {
        ret.push(React.createElement(TodoListComponent, {items: t.get("children"), 
                                    path: path, 
                                    ref: "list"+i.toString(), 
                                    keyDownHandler: this.props.keyDownHandler}));
      }
    }
    return (React.createElement("ul", null, ret));
  } 
});

var TodoItemComponent = React.createClass({displayName: "TodoItemComponent",
  getInitialState: function() { 
    return { focus: false }
  }, 
  setFocus: function(jumpto) { 
    this.setState({ focus: true }, function() {
      this.refs.input.getDOMNode().focus();

      if (typeof jumpto !== 'undefined') { 
        this.refs.input.getDOMNode().setSelectionRange(jumpto, jumpto);
      }
    }); 
  },
  setBlur: function() { 
    this.setState({ focus: false });
  },
  render: function() {
    var cx = React.addons.classSet;
    var spanClasses = cx({
      'hide': this.state.focus
    });
    var inputComponentClasses = cx({
      'hide': !this.state.focus
    });

    return (
      React.createElement("li", {onClick: this.setFocus}, 
        React.createElement("span", {className: spanClasses}, this.props.text), 
        React.createElement(InputComponent, {className: inputComponentClasses, 
                        initValue: this.props.text, 
                        keyDownHandler: this.props.keyDownHandler, 
                        onBlur: this.setBlur, 
                        ref: "input"})
      )
    ); 
  } 
});

var InputComponent = React.createClass({displayName: "InputComponent",
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() { 
    return { text: this.props.initValue }; 
  },
  componentWillReceiveProps: function(props) {
    this.setState({ text: props.initValue });
  },
  render: function() {
    return React.createElement("input", {className: this.props.className, 
                  onKeyDown: this.props.keyDownHandler, 
                  valueLink: this.linkState('text'), 
                  onBlur: this.props.onBlur});
  }
});

React.render(React.createElement(EditorComponent, {todos: todos}), document.getElementById('example'));