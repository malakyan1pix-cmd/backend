1. In the CommonJS version, if you had written exports = { add, subtract,
multiply } instead of individually attaching each function to exports , what
would happen when you require() that ﬁle from index.js ? Why?

If we assign a new object directly to exports, it will not be returned by require(). This happens because exports is initially only a reference to module.exports, and reassigning exports does not change module.exports.

2. Why does utils/strings.js in the CJS folder use module.exports = ... while
utils/math.js uses exports.xxx = ... ? Could you have written math.js
using module.exports instead? What would change on the importing side?

strings.js exports one function, while math.js exports several functions as an object. Yes, math.js could use module.exports = { add, subtract, multiply }, and the import would remain the same.

3. In the ESM version, why is the exact ﬁle extension required on import
'./utils/math.js' , when the CJS version works ﬁne with
require('./utils/math') ?

ES Modules require the exact file extension in Node.js, while CommonJS require() can resolve supported extensions automatically.

4. Name one thing ES Modules can do that CommonJS cannot, and explain brieﬂy
why the difference exists (hint: think about how each system loads ﬁles —
synchronously vs. not)

ES Modules support top-level await, which allows asynchronous operations directly at the top level of a module. CommonJS does not support top-level await because require() uses synchronous module loading.
