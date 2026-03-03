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

export const AppSubscriptionBillingCyclePlan = {
  Annual: 1,
  Monthly: 2,
} as const;

export const AppSubscriptionStatus = {
  Active: 1,
  Inactive: 2,
  ChargeError: 3,
  BlockedPayment: 4,
  Trial: 5,
  TrialExpired: 6,
} as const;
