let arr = [10, 20, 30, 3, 66, 22, 33, 22, 99, 2, 2, 4, 5, 7];
let result = [];
for (let i = 0; i < arr.length; i++) {
  if (!result.includes(arr[i])) {
    result.push(arr[i]);
  }
}
console.log("unique elements are", result);
