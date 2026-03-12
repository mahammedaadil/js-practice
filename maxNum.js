let arr = [10, 20, 30, 3, 66, 22, 33, 22, 99, 2, 2, 4, 5, 7];

//Method 1
let max = arr[0];

for (let i = 1; i < arr.length; i++) {
  if (arr[i] > max) {
    max = arr[i];
  }
}
console.log("max is:", max);

// //Method 2
// arr.sort((a, b) => {
//   return b - a;
// });
// console.log("max is", arr[0]);
