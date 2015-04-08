var I = Immutable; 
var L = I.List; 
var M = I.Map; 

// undo returning arrays later, maybe?
// type Index = Int
// data T a = Empty | Node a (T a)
// operateAtPath :: (T -> Index -> T/IO()) -> T -> [Index] -> T
function operateAtPath(xs, path, flatOperator, level) { 
  level = typeof level !== 'undefined' ? level : 1

  if (path.size == 0) {
    throw new Error("Path must have positive length.")
  }

  if (path.size <= level) {
    if (level > 1)
      return flatOperator(xs, path); 
    else
      return flatOperator(xs, path.get(0)); 
  }

  var i = path.get(0);

  var restOfPath = path.slice(1);
  var tmp = operateAtPath(xs.get(i).get("children"), restOfPath, flatOperator, level); 
  var newChild = tmp[0]; 
  var newPath  = tmp[1]; 
  var newNode = xs.get(i).set("children", newChild); 
  return [xs.splice(i, 1, newNode), L([i]).concat(newPath)]; 
}

// function insertTextAfterPath(xs, path, val) { 
//   return operateAtPath(xs, path, function(l, i) { 
//     var node = M({ text: val, children: L() });
//     return l.splice(i+1, 0, node); 
//   });
// }

function replaceTextAtPath(xs, path, val) { 
  return operateAtPath(xs, path, function(l, i) { 
    var node = l.get(i).set("text", val); 
    return [l.splice(i, 1, node), [i]]; 
  });
}

// function getAtPath(xs, path) { 
//   return operateAtPath(xs, path, function(l, i) { 
//     var node1 = M({ text: updatedVal, children: L() });
//     var node2 = l.get(i).set("text", newVal); 
//     return [l.splice(i, 1, node1, node2), L([i])]; 
//   });
// }

// ::TODO:: poorly named
function updateAndInsertAtPath(xs, path, updatedVal, newVal) { 
  return operateAtPath(xs, path, function(l, i) { 
    var node1 = M({ text: updatedVal, children: L() });
    var node2 = l.get(i).set("text", newVal); 
    return [l.splice(i, 1, node1, node2), L([i+1])]; 
  });
}

function addIndentAtPath(xs, path) { 
  return operateAtPath(xs, path, function(l, i) { 
    if (i == 0)
      return [l, [i]]; 

    var curItem  = l.get(i); 
    var prevItem = l.get(i-1); 
    var prevItemChildren = prevItem.get("children"); 
    prevItem = prevItem.set("children", prevItemChildren.push(curItem)); 
    return [l.splice(i-1, 2, prevItem), L([i-1, prevItem.get("children").size - 1])]; 
  });
}

function mergeWithAboveAtPath(xs, path, text) { 
  return operateAtPath(xs, path, function(l, p) { 
    if (p.size == 1) {
      var i = p.get(0); 
      var l = l.set(i, l.get(i).set("text", text));
      var children = l.get(i).get("children");

      if (i == 0) return [l, L([i])]; 

      var aboveText = l.get(i-1).get("text"); 
      var aboveChildren = l.get(i-1).get("children"); 
      if (aboveChildren.size > 0)
        return [l, L([i])]; 

      var newNode = M({ text: aboveText + text, children: children });
      return [l.splice(i-1, 2, newNode), L([i-1])]; 
    } else { 
      var pInd = p.get(0); 
      var cInd = p.get(1); 

      var parent = l.get(pInd); 
      var child  = parent.get("children").get(cInd);      

      if (cInd > 0) { 
        debugger;
        var tmp = mergeWithAboveAtPath(parent.get("children"), [cInd], text);
        return [ l.splice(pInd, 1, parent.set("children", tmp[0])), L([pInd]).concat(tmp[1]) ];
      }
    }
  }, 2);
}

function removeIndentAtPath(xs, path) { 
  return operateAtPath(xs, path, function(l, p) { 
    if (p.size == 1)
      return [l, p];

    var pInd = p.get(0); 
    var cInd = p.get(1); 

    var parent = l.get(pInd); 
    var child  = parent.get("children").get(cInd);

    var newParent = parent.set("children", parent.get("children").splice(cInd, 1)); //take that child out
    return [l.splice(pInd, 1, newParent, child), L([pInd+1])]; 
  }, 2);
}
