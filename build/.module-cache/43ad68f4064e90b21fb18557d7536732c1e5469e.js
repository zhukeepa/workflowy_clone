var I = Immutable; 
var L = I.List; 
var M = I.Map; 

// undo returning arrays later, maybe?
// type Index = Int
// data T a = Empty | Node a (T a)
// operateOnPath :: (T -> Index -> T/IO()) -> T -> [Index] -> T
function operateOnPath(xs, path, flatOperator) { 
  if (path.size == 0) {
    throw new Error("Path must have positive length.")
  }

  var index = path.get(0);
  if (path.size == 1) {
    return flatOperator(xs, index); 
  }

  var restOfPath = path.slice(1);
  var tmp = operateOnPath(xs.get(index).get("children"), restOfPath, flatOperator); 
  var newChild = tmp[0]; 
  var newPath  = tmp[1]; 
  var newNode = xs.get(index).set("children", newChild); 
  return [xs.splice(index, 1, newNode), L([index]).concat(newPath)]; 
}

// function insertTextAfterPath(xs, path, val) { 
//   return operateOnPath(xs, path, function(l, i) { 
//     var node = M({ text: val, children: L() });
//     return l.splice(i+1, 0, node); 
//   });
// }

function replaceTextAtPath(xs, path, val) { 
  return operateOnPath(xs, path, function(l, i) { 
    var node = l.get(i).set("text", val); 
    return [l.splice(i, 1, node), [i]]; 
  });
}

function getAtPath(xs, path) { 
  return operateOnPath(xs, path, function(l, i) { 
    var node1 = M({ text: updatedVal, children: L() });
    var node2 = l.get(i).set("text", newVal); 
    return [l.splice(i, 1, node1, node2), L([i])]; 
  });
}

// ::TODO:: poorly named
function updateAndInsertAtPath(xs, path, updatedVal, newVal) { 
  return operateOnPath(xs, path, function(l, i) { 
    var node1 = M({ text: updatedVal, children: L()});
    var node2 = l.get(i).set("text", newVal); 
    return [l.splice(i, 1, node1, node2), L([i+1])]; 
  });
}

function mergeWithAboveAtPath(xs, path, text) { 
  return operateOnPath(xs, path, function(l, i) { 
    var l = l.set(i, l.get(i).set("text", text));
    var children = l.get(i).get("children");
    if (i == 0) { 
      if (text != "" || children.size > 0)
        return [l, L([i])]; 
      else
        return [l.splice(1), L([])]; 
    }
    var aboveText = l.get(i-1).get("text"); 
    var aboveChildren = l.get(i-1).get("children"); 
    if (aboveChildren.size > 0)
      return [l, L([i])]; 

    var newNode = M({ text: aboveText + text, children: children });
    return [l.splice(i-1, 2, newNode), L([i-1])]; 
  });
}