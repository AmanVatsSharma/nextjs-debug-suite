import { NetworkMonitor } from '../core/networkMonitor';
import { debug } from '../core/debug';

jest.mock('../core/debug', () => ({
  debug: {
    info: jest.fn()
  }
}));

describe('NetworkMonitor', () => {
  let monitor: NetworkMonitor;

  beforeEach(() => {
    jest.clearAllMocks();
    monitor = new NetworkMonitor();
  });

  afterEach(() => {
    monitor.destroy();
  });

  describe('fetch monitoring', () => {
    it('should track successful fetch requests', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
        text: jest.fn().mockResolvedValue('test'),
        clone: jest.fn().mockReturnThis()
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      await fetch('https://api.example.com/data');
      const requests = monitor.getRequests();

      expect(requests).toHaveLength(1);
      expect(requests[0].url).toBe('https://api.example.com/data');
      expect(requests[0].status).toBe(200);
      expect(requests[0].responseBody).toEqual({ data: 'test' });
    });
  });

  describe('request management', () => {
    it('should store and retrieve requests', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
        text: jest.fn().mockResolvedValue('test'),
        clone: jest.fn().mockReturnThis()
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      await fetch('https://api.example.com/data');
      const requests = monitor.getRequests();

      expect(requests).toHaveLength(1);
      expect(requests[0].url).toBe('https://api.example.com/data');
    });

    it('should limit the number of stored requests', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
        text: jest.fn().mockResolvedValue('test'),
        clone: jest.fn().mockReturnThis()
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      // Make maxRequests + 1 requests
      const maxRequests = 1000;
      for (let i = 0; i < maxRequests + 1; i++) {
        await fetch(`https://api.example.com/data/${i}`);
      }

      const requests = monitor.getRequests();
      expect(requests).toHaveLength(maxRequests);
      expect(requests[0].url).toBe(`https://api.example.com/data/${maxRequests}`);
    });

    it('should clear requests', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
        text: jest.fn().mockResolvedValue('test'),
        clone: jest.fn().mockReturnThis()
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      await fetch('https://api.example.com/data');
      expect(monitor.getRequests()).toHaveLength(1);

      monitor.clearRequests();
      expect(monitor.getRequests()).toHaveLength(0);
    });
  });

  describe('request callbacks', () => {
    it('should manage request callbacks', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
        text: jest.fn().mockResolvedValue('test'),
        clone: jest.fn().mockReturnThis()
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const callback = jest.fn();
      const unsubscribe = monitor.onRequest(callback);

      await fetch('https://api.example.com/data');
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        url: 'https://api.example.com/data',
        status: 200
      }));

      unsubscribe();
      await fetch('https://api.example.com/data');
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
}); 