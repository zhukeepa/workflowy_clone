function getChildrenAtPath(path, todos) { 
  var cur = todos; 
  for (var i = 0; i < path.size; ++i)
    cur = cur.get(path.get(i)).get("children"); 
  return cur; 
}

function getAtPath(path, todos) { 
  var cur = todos; 
  var i; 
  for (i = 0; i < path.size - 1; ++i)
    cur = cur.get(path.get(i)).get("children"); 

  return cur.get(path.get(i)); 
}

function oneLeft(path) {
    return path.splice(-1, 1);
}

function numChildrenAtPath(path, todos) { 
  return getChildrenAtPath(oneLeft(path), todos).size; 
}

function oneDown(path, todos, skipChildren) {
  skipChildren = skipChildren || false; // eventually set it to the flag for hidden or showing
  var last = path.get(path.size - 1); 
  if (getChildrenAtPath(path, todos).size > 0 && !skipChildren) {
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

function getPathOfLastChild(todos) {
  var childNum = todos.get("children").size; 
  if (childNum == 0)
    return L([0]);
  else {
    return L([childNum-1]).concat(getPathOfLastChild(todos.get("children").get(childNum-1)));
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
  var newPath = path.splice(-1, 1, last - 1); 
  var nodeAtNewPath = getAtPath(newPath, todos); 

  if (nodeAtNewPath.get("children").size > 0) //and showChildren is true
  {
    return getPathOfLastChild(nodeAtNewPath);
  } 
  else
    return newPath; 
}