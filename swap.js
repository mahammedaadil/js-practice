const a = new WeakMap();
const b = { name: "aadil", age: 48 };

a.set(b, "person");
console.log(a.get(b));
