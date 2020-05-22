const arr = ['lettuce', 'cucumber', 'tomato', 'pumpkin', 'cabbage'];

const isIncluded = (arr, item) => arr.find((vegetable) => vegetable === item);

console.log(isIncluded(arr, 'lettuce'));
