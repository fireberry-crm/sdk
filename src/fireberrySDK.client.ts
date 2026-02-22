import { MESSAGE_TYPES, REQUEST_ACTIONS } from './constants';
import { Context } from './context';
import { IframeMessageManager } from './iframeMessageManager';
import type {
  API,
  BadgePayload,
  CallbarPayload,
  Payload,
  QueryPayload,
  RecordDetails,
  Response,
  ResponseData,
  ResponseError,
  UserDetails,
} from './types';

export class FireberryClientSDK<TData extends Response> extends IframeMessageManager<TData> {
  private _context: Context | null = null;
  constructor() {
    super();
  }

  get api(): API<TData> {
    return {
      query: this.query.bind(this),
      create: this.create.bind(this),
      delete: this.delete.bind(this),
      update: this.update.bind(this),
    };
  }

  get context(): Context | null {
    return this._context;
  }

  get system() {
    return {
      callbar: {
        show: this.showCallbar.bind(this),
        hide: this.hideCallbar.bind(this),
      },
      badge: {
        show: this.showBadge.bind(this),
        hide: this.hideBadge.bind(this),
      },
    };
  }

  /**
   * @param this - see what `this` argument means here https://www.typescriptlang.org/docs/handbook/2/classes.html#this-parameters
   */
  async initializeContext<T extends TData>(
    this: FireberryClientSDK<T>
  ): Promise<FireberryClientSDK<T>> {
    if (this.context) {
      return this;
    }

    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST_CONTEXT,
    });

    const { status, data, statusText } = (response?.error as ResponseError) ?? {};

    if (status && status !== 200) {
      const errorMessage = data?.Message ?? statusText;
      this.logError('Context initialization failed', {
        status,
        message: errorMessage,
        data,
      });
      throw new Error(errorMessage);
    }

    const { recordId, objectType, userInfo } =
      (response.data as T & {
        recordId: RecordDetails['id'];
        objectType: RecordDetails['type'];
        userInfo: UserDetails;
      }) ?? {};

    this.setContext(
      new Context({
        record: { id: recordId, type: objectType },
        user: {
          fullName: userInfo.fullName,
          id: userInfo.id,
          organizationId: userInfo.organizationId,
        },
      })
    );

    return this;
  }

  private showBadge(payload: BadgePayload): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.SHOW_BADGE,
      ...payload,
    });
  }

  private hideBadge(): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.HIDE_BADGE,
    });
  }

  private setContext(context: Context): void {
    this._context = context;
  }

  private showCallbar(payload: CallbarPayload): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.SHOW_CALLBAR,
      ...payload,
    });
  }

  private hideCallbar(): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.HIDE_CALLBAR,
    });
  }

  private query(objectType: string | number, payload: QueryPayload): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.QUERY,
      objecttype: objectType,
      ...payload,
    });
  }

  private create<T extends Payload>(
    objectType: string | number,
    payload: T
  ): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.CREATE,
      objectType,
      ...payload,
    });
  }

  private delete(objectType: string | number, recordId: string): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.DELETE,
      objectType,
      recordId,
    });
  }

  private update<T extends Payload>(
    objectType: string | number,
    recordId: string,
    payload: T
  ): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.UPDATE,
      objectType,
      recordId,
      ...payload,
    });
  }
}

export type {
  BusinessObject,
  Data,
  Payload,
  QueryPayload,
  ResponseData,
  ResponseError,
} from './types';

export default FireberryClientSDK;
