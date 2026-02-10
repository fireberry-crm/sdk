export const MESSAGE_TYPES = {
  RESPONSE: 'RESPONSE',
  REQUEST: 'REQUEST',
  REQUEST_CONTEXT: 'REQUEST_CONTEXT',
  LOG: 'LOG',
} as const;

export const REQUEST_ACTIONS = {
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  QUERY: 'QUERY',
} as const;

export const TIMEOUT_DURATION = 60000; // one minute;
