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
var EditorComponent = React.createClass({
  getInitialState: function() { 
    return { todos: this.props.todos };
  },
  setFocusFromAbsolutePath: function(path) { 
    var list = this.refs.topTodoList; 
    for (var i = 0; i < path.size - 1; ++i) {
      list = list.refs['list'+path.get(i)];
    }
    var item = list.refs['item'+path.get(i)]; 
    console.log(React.findDOMNode(item));
    item.setFocus();
  },
  keyDownHandler: function(path, e) { 
    switch (e.which) { 
      case 13:
        e.preventDefault(); 
        var form = e.target; 
        var updatedVal = form.value.slice(0, form.selectionStart); 
        var newVal = form.value.slice(form.selectionEnd, form.value.length)
        this.setState({todos: updateAndInsertAtPath(this.state.todos, path, updatedVal, newVal)}, function () { 
          var newPath = path.splice(-1, 1, path.get(path.size-1)+1); //increase last term by 1
          this.setFocusFromAbsolutePath(newPath); 
        });
        break; 

      case 8: 
        var form = e.target; 
        if (form.selectionEnd > 0)
          break; 
        e.preventDefault();
        this.setState({todos: mergeWithAboveAtPath(this.state.todos, path)});
        break; 
    }
  },
  render: function () { 
    return <TodoListComponent items={this.state.todos} 
                              path={L([])}
                              keyDownHandler={this.keyDownHandler} 
                              ref="topTodoList" />
  }
})

var TodoListComponent = React.createClass({
  render: function() { 
    ret = []; 
    for (var i = 0; i < this.props.items.size; i++) {
      var t = this.props.items.get(i); 
      var path = this.props.path.push(i); 
      ret.push(<TodoItemComponent text={t.get("text")} 
                                  path={path}
                                  ref={"item"+i.toString()}
                                  keyDownHandler={this.props.keyDownHandler.bind(null, path)} />);
      if (t.get("children").size > 0) {
        ret.push(<TodoListComponent items={t.get("children")} 
                                    path={path}
                                    ref={"list"+i.toString()}
                                    keyDownHandler={this.props.keyDownHandler} />);
      }
    }
    return (<ul>{ret}</ul>);
  } 
});

var TodoItemComponent = React.createClass({
  getInitialState: function() { 
    return { focus: false }
  }, 
  setFocus: function() { 
    this.setState({ focus: true }, function() {
      this.refs.input.getDOMNode().focus();
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
      <li onClick={this.setFocus}>
        <span className={spanClasses}>{this.props.text}</span>
        <InputComponent className={inputComponentClasses} 
                        initValue={this.props.text}
                        keyDownHandler={this.props.keyDownHandler}
                        onBlur={this.setBlur} 
                        ref="input" />
      </li>
    ); 
  } 
});

var InputComponent = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() { 
    return { text: this.props.initValue }; 
  },
  componentWillReceiveProps: function(props) {
    this.setState({ text: props.initValue });
  },
  render: function() {
    return <input className={this.props.className}
                  onKeyDown={this.props.keyDownHandler} 
                  valueLink={this.linkState('text')}
                  onBlur={this.props.onBlur} />;
  }
});

React.render(<EditorComponent todos={todos}/>, document.getElementById('example'));