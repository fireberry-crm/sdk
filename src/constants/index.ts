export const MESSAGE_TYPES = {
  RESPONSE: 'RESPONSE',
  REQUEST: 'REQUEST',
  REQUEST_CONTEXT: 'REQUEST_CONTEXT',
  LOG: 'LOG',
} as const;

export const REQUEST_ACTIONS = {
  SHOW_CALLBAR: 'SHOW_CALLBAR',
  HIDE_CALLBAR: 'HIDE_CALLBAR',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  QUERY: 'QUERY',
  SHOW_BADGE: 'SHOW_BADGE',
  HIDE_BADGE: 'HIDE_BADGE',
  GET_SETTINGS: 'GET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  GET_METADATA_FIELDS: 'GET_METADATA_FIELDS',
  GET_METADATA_FIELD: 'GET_METADATA_FIELD',
  GET_METADATA_OBJECTS: 'GET_METADATA_OBJECTS',
} as const;

export const FIELD_TYPES = [
  'date',
  'dateTime',
  'emailAddress',
  'lookUp',
  'number',
  'picklist',
  'richText',
  'text',
  'textArea',
  'url',
  'telephone',
  'formula',
  'summary',
] as const;

export const TIMEOUT_DURATION = 60000; // one minute;
