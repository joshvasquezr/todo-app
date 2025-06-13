export function generateRandomId(ids) {
    let newId = Math.floor(Math.random() * 1000);
    while (ids.has(newId)) {
        newId = Math.floor(Math.random() * 1000);
    }
    ids.add(newId);
    return newId;
}
