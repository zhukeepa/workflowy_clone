function setCursor(node,pos){

    node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;

    if(!node){
        return false;
    }else if(node.createTextRange){
        var textRange = node.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd(pos);
        textRange.moveStart(pos);
        textRange.select();
        return true;
    } else if(node.setSelectionRange){
        node.setSelectionRange(pos,pos);
        return true;
    }

    return false;
}

var I = Immutable; 
var L = I.List; 
var M = I.Map; 

var todos = L([
  M({ 
    text: "Enter", 
    children: L([
      M({ 
        text: "Click between the arrows --><-- and press enter!",
        children: L([])
      })
    ])
  }), 
  M({ 
    text: "Backspace", 
    children: L([
      M({ 
        text: "Hello ", 
        children: L([])
      }), 
      M({ 
        text: "world! Place your cursor at the start of this bullet and press backspace!", 
        children: L([])
      }), 
      M({ 
        text: "Click on the bullet point below and press backspace!", 
        children: L([
          M({
            text: "", 
            children: L([])
          })
        ])
      }), 
    ])
  }),

  M({ 
    text: "Tab", 
    children: L([
      M({ 
        text: "Click here and press shift+tab!", 
        children: L([])
      }), 
      M({ 
        text: "Hi!", 
        children: L([])
      }),
      M({ 
        text: "Click here and press tab!", 
        children: L([
          M({
            text: "Then click here and press shift+tab!", 
            children: L([])
          })
        ])
      })
    ])
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
    var form = e.target; 
    var text = form.value; 
    switch (e.which) { 
      // enter key
      case 13:
        e.preventDefault(); 
        var updatedVal = text.slice(0, form.selectionStart); 
        var newVal = text.slice(form.selectionEnd, text.length)

        var tmp = updateAndInsertAtPath(this.state.todos, path, updatedVal, newVal); 
        var newTodos = tmp[0]; 
        var newPath  = tmp[1]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(newPath, 0);
        });
        break; 

      // backspace key
      case 8: 
        if (form.selectionEnd > 0)
          break; 

        e.preventDefault();

        var tmp = mergeWithAboveAtPath(this.state.todos, path, text); 
        var newTodos = tmp[0]; 
        var newPath  = tmp[1]; 
        this.setState({todos: newTodos}, function () { 
          if (newPath != path)
            this.setFocusFromPath(newPath, -text.length - 1);
        });
        break; 

      // tab
      case 9:
        e.preventDefault(); 
        if (!e.shiftKey) {
          var tmp = addIndentAtPath(this.state.todos, path, text); 
          var newTodos = tmp[0]; 
          var newPath  = tmp[1]; 

          this.setState({todos: newTodos}, function () { 
            this.setFocusFromPath(newPath, form.selectionEnd);
          });
        }
        else {
          var tmp = removeIndentAtPath(this.state.todos, path, text); 
          var newTodos = tmp[0]; 
          var newPath  = tmp[1]; 

          this.setState({todos: newTodos}, function () { 
            this.setFocusFromPath(newPath);
          });
        }
        break; 

      // left key
      case 37: 
        if (form.selectionEnd > 0)
          break; 

        e.preventDefault();

        var newTodos = replaceTextAtPath(this.state.todos, path, text)[0]; 
        this.setState({todos: newTodos}, function () { 
          var pathAbove = oneUp(path, newTodos); 
          if (pathAbove != path)
            this.setFocusFromPath(pathAbove, -1); 
        });
        break; 

      // up key
      case 38: 
        e.preventDefault();
        var newTodos = replaceTextAtPath(this.state.todos, path, text)[0]; 
        this.setState({todos: newTodos}, function () { 
          this.setFocusFromPath(oneUp(path, newTodos), 0); 
        });
        break; 

      // right key
      case 39: 
        if (form.selectionEnd < text.length)
          break; 

        e.preventDefault();

        var newTodos = replaceTextAtPath(this.state.todos, path, text)[0]; 
        this.setState({todos: newTodos}, function () { 
          var pathBelow = oneDown(path, newTodos); 
          if (pathBelow != path)
            this.setFocusFromPath(pathBelow, 0); 
          else
            this.setFocusFromPath(pathBelow, -1); 
        });
        break; 

      // down key 
      case 40: 
        e.preventDefault();
        var newTodos = replaceTextAtPath(this.state.todos, path, text)[0]; 
        this.setState({todos: newTodos}, function () { 
          var pathBelow = oneDown(path, newTodos); 
          if (pathBelow != path)
            this.setFocusFromPath(pathBelow, 0); 
          else {
            this.setFocusFromPath(pathBelow, -1); 
          }
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
      var node = this.refs.input.getDOMNode();
      node.focus();

      if (typeof jumpto == 'number') { 
        if (jumpto < 0) jumpto += node.value.length + 1;
        setCursor(node, jumpto); 
        console.log("selectionStart: ", node.selectionEnd);
        console.log("jumpto: ", jumpto);
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
      'hide': !this.state.focus, 
      'itemform': true
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