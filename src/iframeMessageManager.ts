import { MESSAGE_TYPES, TIMEOUT_DURATION } from './constants';
import { MessagePayload, Response, ResponseData } from './types';

export class IframeMessageManager<TData extends Response> {
  private requestIdCounter: number = 0;
  private pendingRequests: Map<
    string,
    {
      resolve: (value: ResponseData<TData>) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reject: (reason: any) => void;
    }
  > = new Map();

  constructor() {
    this.listen();
  }

  private listen(): this {
    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener('message', this.handleMessage);

    return this;
  }

  private sendMessage(payload: MessagePayload): void {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, '*');
    }
  }

  protected sendMessageWithPromise(payload: MessagePayload): Promise<ResponseData<TData>> {
    const requestId = `req_${++this.requestIdCounter}_${Date.now()}`;

    return new Promise<ResponseData<TData>>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      const payloadWithId = {
        ...payload,
        requestId,
      };

      this.sendMessage(payloadWithId);

      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout: No response received'));
        }
      }, TIMEOUT_DURATION);
    });
  }

  private handleMessage(event: MessageEvent<ResponseData<TData>>): void {
    const { data: payload } = event;

    if (!payload || typeof payload !== 'object' || !payload.type) {
      return;
    }

    const { type, requestId } = payload;

    const handlePendingRequest = (
      requestId: string,
      callback?: (payload: ResponseData<TData>) => void
    ) => {
      if (requestId && this.pendingRequests.has(requestId)) {
        const { resolve } = this.pendingRequests.get(requestId)!;
        this.pendingRequests.delete(requestId);
        resolve(payload);
      }
      if (callback) {
        callback(payload);
      }
    };

    // Keep this switch case for further extensions
    switch (type) {
      case MESSAGE_TYPES.RESPONSE:
        handlePendingRequest(requestId);
        break;
      default:
        throw new Error(`Unknown response type: ${type}`);
    }
  }

  public destroy(): void {
    window.removeEventListener('message', this.handleMessage);

    this.pendingRequests.forEach(({ reject }) => {
      reject(new Error('SDK destroyed'));
    });

    this.pendingRequests.clear();
  }
}
