/* global describe, beforeEach, test, expect */

import { calculateCartTotal } from '../js/ShoppingCart.mjs';
import { getCartItems } from '../js/utils.mjs';

describe('cart helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns an empty array when no cart items are stored', () => {
    expect(getCartItems()).toEqual([]);
  });

  test('calculates the total from cart items', () => {
    const items = [
      { FinalPrice: 10.5 },
      { FinalPrice: 5.25 },
    ];

    expect(calculateCartTotal(items)).toBe(15.75);
  });
});
