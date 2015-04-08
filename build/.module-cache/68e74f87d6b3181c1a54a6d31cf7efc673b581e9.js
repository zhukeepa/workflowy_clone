function getAtPath(todos, path) { 

}

function oneDown(path, todos) { 
  return path.splice(-1, 1, path.get(path.size-1)+1); 
}

function oneUp(path, todos) { 
  if (path.get(path.size-1) > 0)
    return path.splice(-1, 1, path.get(path.size-1)+1); 
}