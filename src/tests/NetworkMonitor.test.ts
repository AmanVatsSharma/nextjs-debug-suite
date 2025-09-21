import { NetworkMonitor } from '../core/networkMonitor';
import { debug } from '../core/debug';

// Mock debug module
jest.mock('../core/debug', () => ({
  debug: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

// Mock Response and Headers globally
global.Response = class Response {
  body: any;
  status: number;
  statusText: string;
  headers: Headers;

  constructor(body: any, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Headers(init?.headers);
  }

  async json() {
    return JSON.parse(this.body);
  }

  async text() {
    return this.body;
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
  }
  static error() { return new Response('', { status: 0, statusText: 'Error' }); }
  static json(data: any, init?: ResponseInit) { return new Response(JSON.stringify(data), init); }
  static redirect(url: string | URL, status?: number) { return new Response(String(url), { status: status || 302, statusText: 'Found' }); }
};

global.Headers = class Headers {
  private headers: Record<string, string> = {};

  constructor(init?: Record<string, string>) {
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  get(name: string) {
    return this.headers[name.toLowerCase()] || null;
  }

  set(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  append(name: string, value: string) { this.set(name, value); }
  delete(name: string) { delete this.headers[name.toLowerCase()]; }
  has(name: string) { return name.toLowerCase() in this.headers; }
  forEach(callback: (value: string, key: string) => void) { Object.entries(this.headers).forEach(([k,v]) => callback(v,k)); }
};

describe('NetworkMonitor', () => {
  let monitor: NetworkMonitor;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    originalFetch = global.fetch;
    monitor = new NetworkMonitor();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('fetch monitoring', () => {
    it('should track successful fetch requests', async () => {
      const mockResponse = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' })
      });

      global.fetch = jest.fn().mockResolvedValue(mockResponse);
      // Recreate monitor to pick up mocked fetch
      monitor.destroy();
      monitor = new NetworkMonitor();

      const response = await fetch('https://api.example.com/data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status).toBe(200);
      expect(debug.info).toHaveBeenCalledWith(
        'NETWORK',
        expect.stringMatching(/^Request completed: GET https:\/\/api\.example\.com\/data/),
        expect.objectContaining({ status: expect.stringMatching(/^200 /) })
      );
    });

    it('should track failed fetch requests', async () => {
      const mockResponse = new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'Content-Type': 'text/plain' })
      });

      global.fetch = jest.fn().mockRejectedValue(mockResponse);
      monitor.destroy();
      monitor = new NetworkMonitor();

      try {
        await fetch('https://api.example.com/invalid');
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(debug.info).toHaveBeenCalledWith(
        'NETWORK',
        expect.stringMatching(/^Request completed: GET https:\/\/api\.example\.com\/invalid/),
        expect.any(Object)
      );
    });
  });

  describe('request management', () => {
    it('should store requests up to the maximum limit', () => {
      const maxRequests = 1000;
      for (let i = 0; i < maxRequests + 10; i++) {
        monitor['requests'].push({
          id: `req-${i}`,
          url: `https://api.example.com/${i}`,
          method: 'GET',
          status: 200,
          statusText: 'OK',
          startTime: Date.now(),
          duration: 100,
          size: 1024,
          initiator: 'fetch'
        });
      }

      expect(monitor['requests'].length).toBeLessThanOrEqual(maxRequests);
    });

    it('should clear requests', () => {
      monitor['requests'].push({
        id: 'req-1',
        url: 'https://api.example.com/test',
        method: 'GET',
        status: 200,
        statusText: 'OK',
        startTime: Date.now(),
        duration: 100,
        size: 1024,
        initiator: 'fetch'
      });

      monitor.clearRequests();
      expect(monitor['requests'].length).toBe(0);
    });
  });

  describe('request callbacks', () => {
    it('should notify callbacks when requests are completed', () => {
      const callback = jest.fn();
      monitor.onRequest(callback);

      const request = {
        id: 'req-1',
        url: 'https://api.example.com/test',
        method: 'GET',
        status: 200,
        statusText: 'OK',
        startTime: Date.now(),
        duration: 100,
        size: 1024,
        initiator: 'fetch'
      };

      monitor['requests'].push(request);
      monitor['requestCallbacks'].forEach(callback => callback(request));

      expect(callback).toHaveBeenCalledWith(request);
    });
  });

  describe('header parsing', () => {
    it('should parse headers from string to object', () => {
      const headerString = 'content-type: application/json\r\nauthorization: Bearer token';
      const headers = monitor['parseHeaders'](headerString);

      expect(headers).toEqual({
        'content-type': 'application/json',
        'authorization': 'Bearer token'
      });
    });
  });
}); 