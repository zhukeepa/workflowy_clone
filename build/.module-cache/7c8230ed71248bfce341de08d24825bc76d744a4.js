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

  child = child.set("children", insertAfterPath(child.get("children"), val, restOfPath));
  return xs.splice(index, 1, child);
}

function insertAfterPath(xs, val, path) { 
  var valPrime = val; 
  operateOnPath(xs, path, function(l, i) { 
    return l.splice(i + 1, 0, valPrime); 
  });
}

function replaceValAtPath(xs, val, path) {
  if (path.size == 0) {
    throw new Error("Path must have path with positive length.")
  }

  var index = path.get(0);
  if (path.size == 1) {
    return xs.splice(index, 1, val);
  }

  var restOfPath = path.slice(1);
  var child = xs.get(index);
  child = child.set("children", replaceValAtPath(child.get("children"), val, restOfPath));
  return xs.splice(index, 1, child);
}