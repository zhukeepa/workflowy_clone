// mouse clicks work
// autofocus


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

// path function. takes in callback, and opt way of accessing child element
// oneListOp 

// .get() 
var EditorComponent = React.createClass({displayName: "EditorComponent",
  getInitialState: function() { 
    return { todos: this.props.todos };
  },
  setFocusFromAbsolutePath: function(path) { 
    /*var cur = this.refs.topTodoList; 
    for (var i = 0; i < path.size; ++i) { 
      debugger; 
      cur = cur.props.get("children").get(path[i]); 
    }
    debugger;
    return React.findDOMNode(cur).value; */
  },
  keyPressHandler: function(path, e) { 
    switch (e.which) { 
      case 13: 
        var form = e.target; 
        var updatedVal = form.value.slice(0, form.selectionStart); 
        var newVal = form.value.slice(form.selectionEnd, form.value.length)
        this.setState({todos: updateAndInsertAtPath(this.state.todos, path, updatedVal, newVal)});
        this.setFocusFromAbsolutePath(path); 
        break; 

      case 8: 
        alert("Hi");
        var form = e.target; 
        console.log(form.selectionEnd);
        if (form.selectionEnd > 0)
          break; 
        debugger;
        this.setState({todos: mergeWithAboveAtPath(this.state.todos, path)});
        break; 
      default: 
        console.log(e.which);
    }
  },
  render: function () { 
    return React.createElement(TodoListComponent, {items: this.state.todos, 
                              path: L([]), 
                              keyPressHandler: this.keyPressHandler, 
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
                                  keyPressHandler: this.props.keyPressHandler.bind(null, path)}));
      if (t.get("children").size > 0) {
        ret.push(React.createElement(TodoListComponent, {items: t.get("children"), 
                                    path: path, 
                                    keyPressHandler: this.props.keyPressHandler}));
      }
    }
    return (React.createElement("ul", null, ret));
  } 
});

var TodoItemComponent = React.createClass({displayName: "TodoItemComponent",
  getInitialState: function() { 
    return { focus: false }
  }, 
  _onFocus: function() { 
    this.setState({ focus: true }, function() {
      this.refs.input.getDOMNode().focus();
    }); 
  },
  _onBlur: function() { 
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
      React.createElement("li", {onClick: this._onFocus}, 
        React.createElement("span", {className: spanClasses}, this.props.text), 
        React.createElement(InputComponent, {className: inputComponentClasses, 
                        initValue: this.props.text, 
                        keyPressHandler: this.props.keyPressHandler, 
                        onBlur: this._onBlur, 
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
                  onKeyPress: this.props.keyPressHandler, 
                  valueLink: this.linkState('text'), 
                  onBlur: this.props.onBlur});
  }
});

React.render(React.createElement(EditorComponent, {todos: todos}), document.getElementById('example'));