export function sum(a: number, b: number) {
  return a + b;
}

export function subtract(a: number, b: number) {
  return a - b;
}

export function increment(num: number) {
  return num + 1;
}

export function dbConnection() {
  return 'Connected to the database';
}

export function getRandomNumber() {
  return Math.floor(Math.random() * 100);
}

export function getRandomString() {
  return Math.random().toString(36).substring(2, 15);
}

export function getRandomBoolean() {
  return Math.random() < 0.5;
}