function insertAfterPath(xs, val, path) {
    if (path.size == 0) {
        throw new Error("Path must have path with positive length.")
    }

    var index = path.get(0);
    if (path.size == 1) {
        return xs.splice(index + 1, 0, val);
    }

    var restOfPath = path.slice(1);
    var child = xs.get(index);
    child = child.set("children", insertAfterPath(child.get("children"), val, restOfPath));
    return xs.splice(index, 1, child);
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