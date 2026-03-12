let arr = [10, 20, 30, 3, 66, 22, 33, 22, 99, 2, 2, 4, 5, 7];
let evenNumbers = [];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] % 2 == 0) {
    evenNumbers.push(arr[i]);
  }
}

console.log("even numbers are:", evenNumbers);
