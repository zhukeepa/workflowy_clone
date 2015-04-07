var I = Immutable; 
var L = I.List; 
var M = I.Map; 

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
  var child = xs.get(index);

  child = child.set("children", operateOnPath(child.get("children"), restOfPath, flatOperator));
  return xs.splice(index, 1, child);
}

function insertTextAfterPath(xs, path, val) { 
  return operateOnPath(xs, path, function(l, i) { 
    var node = M({ text: val, children: L()});
    return l.splice(i+1, 0, node); 
  });
}

function replaceTextAtPath(xs, path, val) { 
  return operateOnPath(xs, path, function(l, i) { 
    var node = l.get(i).set("text", val); 
    return l.splice(i, 1, node); 
  });
}

function updateAndInsertAtPath(xs, path, updatedVal, newVal) { 
  var xsPrime = insertTextAfterPath(xs, path, newVal); 
  xsPrime = replaceTextAtPath(xsPrime, path, updatedVal); 
  return xsPrime; 
}

function mergeOrDeleteAtPath(xs, path) { 
  return operateOnPath(xs, path, function(l, i) { 
    var node = l.get(i).set("text", val); 
    return l.splice(i, 1, node); 
  });
}