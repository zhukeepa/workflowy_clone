var todos = [ 
  { 
    text: "Buy milk", 
    children: []
  }, 
  {
    text: "Buy eggs", 
    children: []
  }
]

var Todos = React.createClass({displayName: "Todos",
  getInitialState: function() { 
    return { todos: todos }; 
  },
  render: function() { 
    return self.state.todos; 
  }
});

React.render(React.createElement(Todos, null), document.getElementById('example'));


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