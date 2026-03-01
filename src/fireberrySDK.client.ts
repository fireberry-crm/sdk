import { MESSAGE_TYPES, REQUEST_ACTIONS } from './constants';
import { Context } from './context';
import { IframeMessageManager } from './iframeMessageManager';
import type {
  API,
  BadgePayload,
  CallbarPayload,
  GetFilesResponse,
  JsonValue,
  Payload,
  QueryPayload,
  RecordDetails,
  Response,
  ResponseData,
  ResponseError,
  SettingsAPI,
  StorageAPI,
  StorageRecordAPI,
  UserDetails,
} from './types';

export class FireberryClientSDK<
  TData extends Response,
  TSettings = JsonValue,
> extends IframeMessageManager<TData> {
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
  app = {
    settings: this.settings,
    storage: this.storage,
  };
  private get settings(): SettingsAPI<TSettings> {
    return {
      get: this.getSettings.bind(this),
      set: this.setSettings.bind(this),
    };
  }

  private get storage(): StorageAPI {
    return {
      uploadFile: this.uploadFile.bind(this),
      deleteFile: this.deleteFile.bind(this),
      getFiles: this.getFiles.bind(this),
    };
  }

  private get storageRecord(): StorageRecordAPI {
    return {
      uploadFile: this.uploadFileRecord.bind(this),
      getFiles: this.getFilesRecord.bind(this),
    };
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
    this: FireberryClientSDK<T, TSettings>
  ): Promise<FireberryClientSDK<T, TSettings>> {
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
        record: { id: recordId, type: objectType, storage: this.storageRecord },
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

  private async getSettings(): Promise<TSettings> {
    const { data } = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_SETTINGS,
    });
    return (data as unknown as { settings: TSettings }).settings;
  }

  private async setSettings(settings: TSettings): Promise<TSettings> {
    const { data } = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.UPDATE_SETTINGS,
      settings,
    });
    return (data as unknown as { settings: TSettings }).settings;
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

  private async deleteFile(fileId: string): Promise<void> {
    await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.DELETE_FILE,
      fileId,
    });
  }

  private async getFiles(): Promise<GetFilesResponse> {
    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_FILES,
    });
    return response.data as unknown as GetFilesResponse;
  }

  private async getFilesRecord(): Promise<GetFilesResponse> {
    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_RECORD_FILES,
    });
    return response.data as unknown as GetFilesResponse;
  }

  private async uploadFile(file: File): Promise<{ url: string; id: string }> {
    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.UPLOAD_FILE,
      file,
    });
    return response.data as unknown as { url: string; id: string };
  }

  private async uploadFileRecord(file: File): Promise<{ url: string; id: string }> {
    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.UPLOAD_RECORD_FILE,
      file,
    });
    return response.data as unknown as { url: string; id: string };
  }
}

export type {
  BusinessObject,
  Data,
  FileMetadata,
  GetFilesResponse,
  JsonValue,
  Payload,
  QueryPayload,
  ResponseData,
  ResponseError,
  SettingsAPI,
  StorageAPI,
  StorageRecordAPI,
} from './types';

export default FireberryClientSDK;
