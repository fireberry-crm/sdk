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
} as const;

export const TIMEOUT_DURATION = 60000; // one minute;

export const APP_SUBSCRIPTION_BILLING_CYCLE_PLAN = {
  annual: 1,
  monthly: 2,
} as const;

export const APP_SUBSCRIPTION_STATUS = {
  active: 1,
  inactive: 2,
  chargeError: 3,
  blockedPayment: 4,
  trial: 5,
  trialExpired: 6,
} as const;
