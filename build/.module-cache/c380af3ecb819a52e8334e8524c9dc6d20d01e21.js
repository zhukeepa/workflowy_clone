function oneDown(path) { 
  return path.splice(-1, 1, path.get(path.size-1)+1); 
}