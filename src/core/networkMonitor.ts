import { debug } from './debug';

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  size?: number;
  headers?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  initiator?: string;
  error?: Error;
}

export class NetworkMonitor {
  private debug = debug;
  private requests: NetworkRequest[] = [];
  private maxRequests = 1000;
  private requestCallbacks: ((request: NetworkRequest) => void)[] = [];
  private originalFetch: typeof fetch = typeof window !== 'undefined' && (window as any).fetch ? (window as any).fetch : (globalThis.fetch as any);
  private originalXHR: typeof XMLHttpRequest = typeof window !== 'undefined' ? window.XMLHttpRequest : (globalThis.XMLHttpRequest as any);

  constructor() {
    // Wrap requests array to enforce max length even when directly mutated
    const target: NetworkRequest[] = [];
    this.requests = new Proxy(target, {
      get: (t, prop, receiver) => {
        if (prop === 'push') {
          return (...args: any[]) => {
            // @ts-ignore
            const result = Array.prototype.push.apply(t, args);
            if (t.length > this.maxRequests) {
              t.splice(this.maxRequests);
            }
            return result;
          };
        }
        // @ts-ignore
        return Reflect.get(t, prop, receiver);
      },
    }) as unknown as NetworkRequest[];

    if (typeof window !== 'undefined') {
      this.monitorFetch();
      this.monitorXHR();
    }
  }

  private monitorFetch() {
    const wrappedFetch = async (...args: any[]) => {
      const request = this.createRequest(
        args[0] instanceof URL ? args[0].toString() : args[0],
        args[1]?.method || 'GET'
      );
      
      try {
        const response = await this.originalFetch.apply(typeof window !== 'undefined' ? window : globalThis, args);
        const clonedResponse = response.clone();
        
        request.status = response.status;
        request.statusText = response.statusText;
        request.headers = this.parseHeaders(response.headers);
        request.responseHeaders = this.parseHeaders(response.headers);
        request.initiator = 'fetch';
        
        try {
          request.responseBody = await clonedResponse.json();
        } catch {
          request.responseBody = await clonedResponse.text();
        }
        
        this.completeRequest(request);
        return response;
      } catch (error) {
        request.error = error as Error;
        this.completeRequest(request);
        throw error;
      }
    };

    // Patch both window and global fetch for test environments
    (window as any).fetch = wrappedFetch as unknown as typeof fetch;
    (globalThis as any).fetch = wrappedFetch as unknown as typeof fetch;
  }

  private monitorXHR() {
    const self = this;
    window.XMLHttpRequest = class extends XMLHttpRequest {
      private request: NetworkRequest;

      constructor() {
        super();
        this.request = self.createRequest('', 'GET');

        this.addEventListener('load', () => {
        this.request.status = this.status;
        this.request.statusText = this.statusText;
        this.request.headers = self.parseHeaders(this.getAllResponseHeaders());
        this.request.responseHeaders = self.parseHeaders(this.getAllResponseHeaders());
        this.request.initiator = 'xhr';
          
          try {
            this.request.responseBody = JSON.parse(this.responseText);
          } catch {
            this.request.responseBody = this.responseText;
          }
          
          self.completeRequest(this.request);
        });

        this.addEventListener('error', (event) => {
          this.request.error = new Error('XHR request failed');
          self.completeRequest(this.request);
        });
      }

      open(method: string, url: string) {
        this.request.method = method;
        this.request.url = url;
        super.open(method, url);
      }

      send(body?: any) {
        if (body) {
          try {
            this.request.requestBody = JSON.parse(body);
          } catch {
            this.request.requestBody = body;
          }
        }
        super.send(body);
      }
    };
  }

  private createRequest(url: string | Request, method: string): NetworkRequest {
    const request: NetworkRequest = {
      id: Math.random().toString(36).substring(7),
      url: typeof url === 'string' ? url : url.url,
      method,
      startTime: Date.now()
    };

    this.requests.unshift(request);
    if (this.requests.length > this.maxRequests) {
      this.requests = this.requests.slice(0, this.maxRequests);
    }

    this.debug.info('NETWORK', `Request started: ${method} ${request.url}`, request);
    return request;
  }

  private completeRequest(request: NetworkRequest) {
    request.endTime = Date.now();
    request.duration = request.endTime - request.startTime;

    const status = request.status ? `${request.status} ${request.statusText}` : 'Failed';
    this.debug.info('NETWORK', `Request completed: ${request.method} ${request.url}`, {
      status,
      duration: request.duration,
      request
    });

    this.requestCallbacks.forEach(callback => callback(request));
  }

  private parseHeaders(headers: Headers | string): Record<string, string> {
    if (headers instanceof Headers) {
      const obj: Record<string, string> = {};
      (headers as any).forEach((value: string, key: string) => {
        obj[key.toLowerCase()] = value;
      });
      return obj;
    }

    if (typeof headers === 'string') {
      return headers.split(/\r?\n/)
        .filter(line => line)
        .reduce((obj, line) => {
          const [key, value] = line.split(': ');
          if (key && value !== undefined) {
            obj[key.toLowerCase()] = value;
          }
          return obj;
        }, {} as Record<string, string>);
    }

    return {};
  }

  getRequests() {
    return this.requests;
  }

  clearRequests() {
    this.requests.length = 0;
  }

  onRequest(callback: (request: NetworkRequest) => void) {
    this.requestCallbacks.push(callback);
    return () => {
      const index = this.requestCallbacks.indexOf(callback);
      if (index > -1) {
        this.requestCallbacks.splice(index, 1);
      }
    };
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.fetch = this.originalFetch;
      window.XMLHttpRequest = this.originalXHR;
    }
    (globalThis as any).fetch = this.originalFetch;
    this.requestCallbacks = [];
    this.requests.length = 0;
  }
} 