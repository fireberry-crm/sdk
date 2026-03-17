import { MESSAGE_TYPES } from '../constants';

export interface SystemEventMap {}

export type SystemEventName = keyof SystemEventMap;

export type EventMessage<K extends SystemEventName = SystemEventName> = {
  type: typeof MESSAGE_TYPES.EVENT;
  event: K;
  data: SystemEventMap[K];
};

export type EventListener<K extends SystemEventName> = (data: SystemEventMap[K]) => void;
