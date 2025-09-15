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
export declare class NetworkMonitor {
    private debug;
    private requests;
    private maxRequests;
    private requestCallbacks;
    private originalFetch;
    private originalXHR;
    constructor();
    private monitorFetch;
    private monitorXHR;
    private createRequest;
    private completeRequest;
    private parseHeaders;
    getRequests(): NetworkRequest[];
    clearRequests(): void;
    onRequest(callback: (request: NetworkRequest) => void): () => void;
    destroy(): void;
}
