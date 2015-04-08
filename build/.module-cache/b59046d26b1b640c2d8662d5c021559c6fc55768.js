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

function oneDown(path, todos, skipChildren) {
  skipChildren = skipChildren || false; // eventually set it to the flag for hidden or showing
  var last = path.get(path.size - 1); 
  if (getTodosAtPath(path, todos).size > 0 && !skipChildren) {
    return path.push(0);
  } 
  else if (last + 1 < numChildrenAtPath(path, todos)) { 
    return path.splice(-1, 1, last + 1); 
  } else if (path.size > 1) {
    return oneDown(oneLeft(path), todos, true); 
  } else {
    return path; 
  }
}

function oneUp(path, todos) { 
  var last = path.get(path.size - 1); 
  if (last == 0) { 
      if (path.size > 1)
        return oneLeft(path); 
      else
        return path; 
  }

  return path.splice(-1, 1, last - 1); 
}