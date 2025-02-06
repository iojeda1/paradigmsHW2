// Isabel Ojeda
// HW2 Q1

// declarative function 1
function findUserById(users, id) {
    let userx = users.find(userx => userx.id === id);
    return userx ? userx.name : null; 
}

// declarative function 2
function computeBMIs(users) {
    let callback = (userx) => (userx.weight/(userx.height*userx.height)); 
    return users.map(callback); // array with new results 
}
