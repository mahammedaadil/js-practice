let budget = 99;

const chocolates = [
  { price: 2, qty: 5 },
  { price: 5, qty: 8 },
  { price: 10, qty: 10 },
];

chocolates.sort((a, b) => a.price - b.price);

let totalChocolates = 0;
let arr = [];
for (let i of chocolates) {
  if (budget < 0) {
    return;
  }
  let maximumChocolates = Math.min(i.qty, Math.floor(budget / i.price));
  totalChocolates += maximumChocolates;
  arr.push(maximumChocolates);
  budget -= maximumChocolates * i.price;
}

const [a1, a2, a3] = arr;
console.log(
  `You Have Got ${a1} Two Rupees Chocolates,${a2} Five Rupees Chocolates,${a3} Ten Rupees Chocolates`,
);

console.log("Chocolates You Can Buy:", totalChocolates);
console.log("Remaining Amount After Buying Chocolates:", budget);
