import { add, subtract, multiply } from "./utils/math.js";
import capitalize from "./utils/strings.js";

console.log(add(7, 9));
console.log(subtract(8, 3));
console.log(multiply(3, 6));
console.log(capitalize("hello"));

console.log(import.meta.url);
// Since ES Modules don't have __filename, import.meta.url lets us identify the location of the current module.
