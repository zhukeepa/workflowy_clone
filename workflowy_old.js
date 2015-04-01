function toDoToLi(todo) { 
  var li = document.createElement('li');
  li.innerHTML = todo; 
  li.setAttribute('contenteditable', '')

  li.addEventListener("keydown", function (e) { 
    if (e.which == 13) { 
      e.preventDefault(); 
      var li2 = toDoToLi(""); 
      li.insertAdjacentElement('afterEnd', li2); 
      li2.focus();
    }
    if (e.which == 8 && this.innerHTML == "") {
      e.preventDefault(); 
      li2 = this.previousSibling;
      if (li2 != null) { 
        this.parentNode.removeChild(this); 
        li2.focus(); 
      }
    }
  });
  li.addEventListener("focus", function () { 
    console.log("focusin"); 
  });
  li.addEventListener("focusout", function () { 
  });
  return li; 
}

function toDosToOL(todos) { 
  var lis = todos.map(function(todo) { 
    return toDoToLi(todo);
  })
  var ol = document.createElement('ol');
  lis.forEach(function(li) { 
    ol.appendChild(li);
  })
  return ol;
}

var todos = ['a', 'b']; 
todosUL = toDosToOL(todos);
//outline.appendChild(toDosToUL(todos));