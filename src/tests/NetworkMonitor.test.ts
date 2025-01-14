import { NetworkMonitor } from '../core/networkMonitor';

describe('NetworkMonitor', () => {
  let monitor: NetworkMonitor;
  let originalFetch: typeof window.fetch;
  let originalXHR: typeof window.XMLHttpRequest;

  beforeEach(() => {
    originalFetch = window.fetch;
    originalXHR = window.XMLHttpRequest;
    monitor = new NetworkMonitor();
  });

  afterEach(() => {
    monitor.destroy();
    window.fetch = originalFetch;
    window.XMLHttpRequest = originalXHR;
  });

  describe('fetch monitoring', () => {
    it('should track successful fetch requests', async () => {
      const mockResponse = { data: 'test' };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse),
        headers: new Headers({ 'content-type': 'application/json' })
      });
      window.fetch = mockFetch;

      monitor = new NetworkMonitor();
      const callback = jest.fn();
      monitor.onRequest(callback);

      await fetch('https://api.example.com/data', {
        method: 'POST',
        body: JSON.stringify({ test: true })
      });

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        url: 'https://api.example.com/data',
        method: 'POST',
        status: 200,
        statusText: 'OK',
        requestBody: { test: true },
        responseBody: mockResponse,
        headers: expect.any(Object)
      }));
    });

    it('should track failed fetch requests', async () => {
      const mockError = new Error('Network error');
      const mockFetch = jest.fn().mockRejectedValue(mockError);
      window.fetch = mockFetch;

      monitor = new NetworkMonitor();
      const callback = jest.fn();
      monitor.onRequest(callback);

      try {
        await fetch('https://api.example.com/data');
      } catch (error) {
        // Expected error
      }

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        url: 'https://api.example.com/data',
        method: 'GET',
        error: mockError
      }));
    });
  });

  describe('XMLHttpRequest monitoring', () => {
    it('should track successful XHR requests', (done) => {
      monitor = new NetworkMonitor();
      const callback = jest.fn();
      monitor.onRequest(callback);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.example.com/data');
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = () => {
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
          url: 'https://api.example.com/data',
          method: 'POST',
          status: 200,
          statusText: 'OK',
          requestBody: { test: true },
          responseBody: { data: 'test' },
          headers: expect.any(Object)
        }));
        done();
      };

      xhr.send(JSON.stringify({ test: true }));

      // Simulate XHR response
      Object.defineProperty(xhr, 'status', { value: 200 });
      Object.defineProperty(xhr, 'statusText', { value: 'OK' });
      Object.defineProperty(xhr, 'responseText', { value: JSON.stringify({ data: 'test' }) });
      xhr.dispatchEvent(new Event('load'));
    });

    it('should track failed XHR requests', (done) => {
      monitor = new NetworkMonitor();
      const callback = jest.fn();
      monitor.onRequest(callback);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.example.com/data');
      
      xhr.onerror = () => {
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
          url: 'https://api.example.com/data',
          method: 'GET',
          error: expect.any(Error)
        }));
        done();
      };

      xhr.send();
      xhr.dispatchEvent(new Event('error'));
    });
  });

  describe('request management', () => {
    it('should store and retrieve requests', async () => {
      const mockResponse = { data: 'test' };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse),
        headers: new Headers()
      });
      window.fetch = mockFetch;

      monitor = new NetworkMonitor();
      await fetch('https://api.example.com/data');

      const requests = monitor.getRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0]).toMatchObject({
        url: 'https://api.example.com/data',
        method: 'GET',
        status: 200
      });
    });

    it('should limit the number of stored requests', async () => {
      const mockResponse = { data: 'test' };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse),
        headers: new Headers()
      });
      window.fetch = mockFetch;

      monitor = new NetworkMonitor();
      const maxRequests = 1000;

      for (let i = 0; i < maxRequests + 10; i++) {
        await fetch(`https://api.example.com/data/${i}`);
      }

      const requests = monitor.getRequests();
      expect(requests).toHaveLength(maxRequests);
      expect(requests[0].url).toBe('https://api.example.com/data/1009');
    });

    it('should clear requests', async () => {
      const mockResponse = { data: 'test' };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse),
        headers: new Headers()
      });
      window.fetch = mockFetch;

      monitor = new NetworkMonitor();
      await fetch('https://api.example.com/data');
      
      expect(monitor.getRequests()).toHaveLength(1);
      monitor.clearRequests();
      expect(monitor.getRequests()).toHaveLength(0);
    });
  });

  describe('request callbacks', () => {
    it('should manage request callbacks', async () => {
      const mockResponse = { data: 'test' };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse),
        headers: new Headers()
      });
      window.fetch = mockFetch;

      monitor = new NetworkMonitor();
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const unsubscribe1 = monitor.onRequest(callback1);
      const unsubscribe2 = monitor.onRequest(callback2);

      await fetch('https://api.example.com/data');
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();

      unsubscribe1();
      await fetch('https://api.example.com/data');
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(2);

      unsubscribe2();
      await fetch('https://api.example.com/data');
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(2);
    });
  });

  describe('header parsing', () => {
    it('should parse Headers object', () => {
      const headers = new Headers({
        'content-type': 'application/json',
        'x-custom': 'test'
      });

      monitor = new NetworkMonitor();
      const parsed = monitor['parseHeaders'](headers);

      expect(parsed).toEqual({
        'content-type': 'application/json',
        'x-custom': 'test'
      });
    });

    it('should parse header string', () => {
      const headerString = 'content-type: application/json\r\nx-custom: test';

      monitor = new NetworkMonitor();
      const parsed = monitor['parseHeaders'](headerString);

      expect(parsed).toEqual({
        'content-type': 'application/json',
        'x-custom': 'test'
      });
    });

    it('should handle empty headers', () => {
      monitor = new NetworkMonitor();
      expect(monitor['parseHeaders']('')).toEqual({});
      expect(monitor['parseHeaders'](new Headers())).toEqual({});
    });
  });
}); 