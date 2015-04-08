function getListPath(todos, path) { 
  var cur = todos; 
  for (var i = 0; i < path.size; ++i)
    cur = cur.get(path.get(i)).get("children"); 
  return cur; 
}

function oneDown(path, todos) { 
  return path.splice(-1, 1, path.get(path.size-1)+1); 
}

function oneUp(path, todos) { 
  if (path.get(path.size-1) > 0)
    return path.splice(-1, 1, path.get(path.size-1)+1); 
}