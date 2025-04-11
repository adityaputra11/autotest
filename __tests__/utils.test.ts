import { sum, subtract, increment, dbConnection } from '../src/utils';

describe('sum function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
    expect(sum(-1, 5)).toBe(4);
    expect(sum(0, 0)).toBe(0);
  });
});

describe('subtract function', () => {
  it('should subtract two numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(10, 15)).toBe(-5);
    expect(subtract(0, 0)).toBe(0);
  });
});

describe('increment function', () => {
  it('should increment a number by 1', () => {
    expect(increment(5)).toBe(6);
    expect(increment(-1)).toBe(0);
    expect(increment(0)).toBe(1);
  });
});

describe('dbConnection function', () => {
  it('should return connection message', () => {
    expect(dbConnection()).toBe('Connected to the database');
  });
});