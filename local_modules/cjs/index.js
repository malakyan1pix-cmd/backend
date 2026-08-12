const math = require("./utils/math");
const capitalize = require("./utils/strings");

console.log(math.add(2, 3));
console.log(math.multiply(4, 5));
console.log(math.subtract(7, 4));
console.log(capitalize("hello"));

console.log(require.cache);
// require.cache shows the modules loaded by require(), which Node.js keeps in memory so they don't have to be loaded again.
