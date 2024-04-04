import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import '@testing-library/jest-dom';

expect.extend(matchers);

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: any) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    })
  });