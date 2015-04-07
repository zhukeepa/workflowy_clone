// TODO: refactor. 
// make path class
// status forms don't rerun getInitialState()

// set new focus
//   - using debugger
//   - how to access children properties

// repeated code ??


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
  updateAndInsertFromAbsolutePath: function(path, updatedVal, newVal) {
    var newVal     = M({ text: newVal, children: L()});
    var updatedVal = M({ text: updatedVal, children: L()});
    var todos = insertAfterPath(this.state.todos, newVal, path);
    todos = replaceValAtPath(todos, updatedVal, path);
    this.setState({ todos: todos }); 
  }, 
  setFocusFromAbsolutePath: function(path, list) { 
    list = typeof list !== 'undefined' ? list : this.refs.topTodoList; 

    if (path.size == 0) { 
      throw new Error("Path must have path with positive length.")
    }

    console.log(path.toString(), list.props.children);//, list);

    var index = path.get(0); 
    if (path.size == 1) { 
      console.log(React.findDOMNode(list.props.children[index]).value);
      return React.findDOMNode(list.props.children[index]).value; 
    }
    
    var restOfPath = path.slice(1); 
    this.setFocusFromAbsolutePath(restOfPath, list.children[index]);
  },
  keyPressHandler: function(path, e) { 
    switch (e.which) { 
      case 13: 
        var form = e.target; 
        var updatedVal = form.value.slice(0, form.selectionStart); 
        var newVal = form.value.slice(form.selectionEnd, form.value.length)
        this.updateAndInsertFromAbsolutePath(path, updatedVal, newVal); 
        this.setFocusFromAbsolutePath(path); 
        break; 
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

// design question -- do keypress handling down here, but call various functions from up top? 
// that would involve a very obnoxious chain of functions to pass down though, wouldn't it? 
// otherwise -- how to cleanly pass up data to top function? 

var InputComponent = React.createClass({displayName: "InputComponent",
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() { 
    return { text: this.props.initValue }; 
  },
  render: function() {
    return React.createElement("input", {className: this.props.className, 
                  onKeyPress: this.props.keyPressHandler, 
                  valueLink: this.linkState('text'), 
                  onBlur: this.props.onBlur});
  }
});

React.render(React.createElement(EditorComponent, {todos: todos}), document.getElementById('example'));