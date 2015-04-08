function getTodosAtPath(path, todos) { 
  var cur = todos; 
  for (var i = 0; i < path.size; ++i)
    cur = cur.get(path.get(i)).get("children"); 
  return cur; 
}

function oneLeft(path) {
  return path.splice(-1, 1);
}

function numChildrenAtPath(path, todos) { 
  return getTodosAtPath(oneLeft(path), todos).size; 
}

function oneDown(path, todos) { 
  var last = path.get(path.size - 1); 
  if (getTodosAtPath(path, todos).size > 0) {
    alert("darn");
    return path.push(0);
  } 
  else if (last + 1 < numChildrenAtPath(path, todos)) { 
    return path.splice(-1, 1, last + 1); 
  } else if (path.size > 0) {
    return oneDown(oneLeft(path), todos); 
  } else {
    return path; 
  }
}

function oneUp(path, todos) { 
  if (path.get(path.size-1) > 0)
    return path.splice(-1, 1, path.get(path.size-1)+1); 
}