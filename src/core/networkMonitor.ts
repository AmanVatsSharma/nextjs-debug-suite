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
  headers?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  error?: Error;
}

export class NetworkMonitor {
  private debug = debug;
  private requests: NetworkRequest[] = [];
  private maxRequests = 1000;
  private requestCallbacks: ((request: NetworkRequest) => void)[] = [];
  private originalFetch: typeof fetch = typeof window !== 'undefined' ? window.fetch : fetch;
  private originalXHR: typeof XMLHttpRequest = typeof window !== 'undefined' ? window.XMLHttpRequest : XMLHttpRequest;

  constructor() {
    if (typeof window !== 'undefined') {
      this.monitorFetch();
      this.monitorXHR();
    }
  }

  private monitorFetch() {
    window.fetch = async (...args) => {
      const request = this.createRequest(
        args[0] instanceof URL ? args[0].toString() : args[0],
        args[1]?.method || 'GET'
      );
      
      try {
        const response = await this.originalFetch.apply(window, args);
        const clonedResponse = response.clone();
        
        request.status = response.status;
        request.statusText = response.statusText;
        request.headers = this.parseHeaders(response.headers);
        
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
      headers.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }

    if (typeof headers === 'string') {
      return headers.split('\r\n')
        .filter(line => line)
        .reduce((obj, line) => {
          const [key, value] = line.split(': ');
          obj[key.toLowerCase()] = value;
          return obj;
        }, {} as Record<string, string>);
    }

    return {};
  }

  getRequests() {
    return this.requests;
  }

  clearRequests() {
    this.requests = [];
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
    this.requestCallbacks = [];
    this.requests = [];
  }
} 