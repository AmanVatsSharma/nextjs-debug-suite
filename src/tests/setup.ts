import '@testing-library/jest-dom';

// Mock window.performance
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => []),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock Response for fetch
global.Response = class Response {
  private body: string;
  public status: number;
  public statusText: string;
  public headers: Headers;

  constructor(body: string | null = null, init: ResponseInit = {}) {
    this.body = body || '';
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Headers(init.headers);
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }

  text() {
    return Promise.resolve(this.body);
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
} as any;

// Mock Headers
global.Headers = class Headers {
  private headers: Record<string, string>;

  constructor(init?: Record<string, string> | Headers | string[][]) {
    this.headers = {};
    if (init) {
      if (init instanceof Headers) {
        this.headers = { ...init['headers'] };
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => {
          this.headers[key.toLowerCase()] = value;
        });
      } else {
        Object.entries(init).forEach(([key, value]) => {
          this.headers[key.toLowerCase()] = value;
        });
      }
    }
  }

  append(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  delete(name: string) {
    delete this.headers[name.toLowerCase()];
  }

  get(name: string) {
    return this.headers[name.toLowerCase()] || null;
  }

  has(name: string) {
    return name.toLowerCase() in this.headers;
  }

  set(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  forEach(callback: (value: string, key: string) => void) {
    Object.entries(this.headers).forEach(([key, value]) => {
      callback(value, key);
    });
  }
} as any;

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

// Mock requestAnimationFrame
window.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(() => callback(Date.now()), 0);
};

// Mock cancelAnimationFrame
window.cancelAnimationFrame = (handle: number) => {
  clearTimeout(handle);
};

// Mock matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})); 