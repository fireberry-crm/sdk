import { MESSAGE_TYPES, REQUEST_ACTIONS } from './constants';
import { Context } from './context';
import { IframeMessageManager } from './iframeMessageManager';
import type {
  API,
  BadgePayload,
  CallbarPayload,
  FieldMeta,
  GetFilesResponse,
  GoToRecordPayload,
  JsonValue,
  ObjectMeta,
  ObjectType,
  PaginationPayload,
  Payload,
  PermissionsData,
  QueryPayload,
  RecordDetails,
  Response,
  ResponseData,
  ResponseError,
  SettingsAPI,
  StorageAPI,
  StorageRecordAPI,
  ToastPayload,
  UserDetails,
} from './types';
import { EventListener, SystemEventName } from './types/events';

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
      metadata: {
        getFields: this.getMetadataFields.bind(this),
        getField: this.getMetadataField.bind(this),
        getObjects: this.getMetadataObjects.bind(this),
      },
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
      getFile: this.getFile.bind(this),
    };
  }

  private get storageRecord(): StorageRecordAPI {
    return {
      uploadFile: this.uploadFileRecord.bind(this),
      getFiles: this.getRecordFiles.bind(this),
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
      toast: {
        show: this.showToast.bind(this),
        hide: this.hideToast.bind(this),
      },
      goToRecord: this.goToRecord.bind(this),
      on: this.on.bind(this),
      off: this.off.bind(this),
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

    const { recordId, objectType, userInfo, permissions } =
      (response.data as T & {
        recordId: RecordDetails['id'];
        objectType: RecordDetails['type'];
        userInfo: UserDetails;
        permissions: PermissionsData;
      }) ?? {};

    this.setContext(
      new Context({
        record: { id: recordId, type: objectType, storage: this.storageRecord },
        user: {
          fullName: userInfo.fullName,
          id: userInfo.id,
          organizationId: userInfo.organizationId,
          license: userInfo.license,
          permissions,
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

  private showToast(payload: ToastPayload): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.SHOW_TOAST,
      ...payload,
    });
  }

  private hideToast(): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.HIDE_TOAST,
    });
  }

  private async goToRecord(
    objectType: GoToRecordPayload['objectType'],
    recordId: GoToRecordPayload['recordId']
  ): Promise<void> {
    if (!objectType) {
      throw new Error('objectType is required');
    }
    if (!recordId) {
      throw new Error('recordId is required');
    }
    await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GO_TO_RECORD,
      objectType,
      recordId,
    });
  }

  private query(objectType: ObjectType, payload: QueryPayload): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.QUERY,
      objecttype: objectType,
      ...payload,
    });
  }

  private create<T extends Payload>(
    objectType: ObjectType,
    payload: T
  ): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.CREATE,
      objectType,
      ...payload,
    });
  }

  private delete(objectType: ObjectType, recordId: string): Promise<ResponseData<TData>> {
    return this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.DELETE,
      objectType,
      recordId,
    });
  }

  private update<T extends Payload>(
    objectType: ObjectType,
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

  private async getMetadataFields(objectType: ObjectType): Promise<string[]> {
    const { data } = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_METADATA_FIELDS,
      objectType,
    });
    return (data as unknown as { fields: string[] }).fields;
  }

  private async getMetadataField(objectType: ObjectType, fieldName: string): Promise<FieldMeta> {
    const { data } = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_METADATA_FIELD,
      objectType,
      fieldName,
    });
    return (data as unknown as { field: FieldMeta }).field;
  }

  private async getMetadataObjects(): Promise<ObjectMeta[]> {
    const { data } = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_METADATA_OBJECTS,
    });
    return (data as unknown as { objects: ObjectMeta[] }).objects;
  }

  private async deleteFile(fileId: string): Promise<void> {
    await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.DELETE_FILE,
      fileId,
    });
  }

  private async getFiles(payload: PaginationPayload): Promise<GetFilesResponse> {
    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_FILES,
      ...payload,
    });
    return response.data as unknown as GetFilesResponse;
  }

  private async getRecordFiles(payload: PaginationPayload): Promise<GetFilesResponse> {
    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_RECORD_FILES,
      ...payload,
    });
    return response.data as unknown as GetFilesResponse;
  }

  private async getFile(fileId: string): Promise<File> {
    const response = await this.sendMessageWithPromise({
      type: MESSAGE_TYPES.REQUEST,
      action: REQUEST_ACTIONS.GET_FILE,
      fileId,
    });
    return response.data as unknown as File;
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

  private on(event: SystemEventName, listener: EventListener<SystemEventName>): void {
    this.eventListeners.set(event, [...(this.eventListeners.get(event) || []), listener]);
  }

  private off(event: SystemEventName, listener: EventListener<SystemEventName>): void {
    this.eventListeners.set(
      event,
      (this.eventListeners.get(event) || []).filter((l) => l !== listener)
    );
  }
}

export { FIELD_TYPES, OBJECTS } from './constants';

export type {
  AppSubscriptionBillingCyclePlanValues,
  AppSubscriptionStatusValues,
  BadgePayload,
  BusinessObject,
  CallbarPayload,
  Data,
  FeaturePermission,
  FieldMeta,
  FieldType,
  FileMetadata,
  GetFilesResponse,
  GoToRecordPayload,
  JsonValue,
  LicenseDetails,
  MetadataAPI,
  ObjectMeta,
  ObjectPermission,
  Objects,
  ObjectType,
  Payload,
  PermissionFeatures,
  PermissionObjects,
  PermissionsData,
  PicklistOption,
  QueryPayload,
  ResponseData,
  ResponseError,
  SettingsAPI,
  StorageAPI,
  StorageRecordAPI,
  ToastPayload,
} from './types';

export { APP_SUBSCRIPTION_BILLING_CYCLE_PLAN, APP_SUBSCRIPTION_STATUS } from './constants';

export default FireberryClientSDK;
