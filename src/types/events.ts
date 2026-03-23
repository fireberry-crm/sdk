import { MESSAGE_TYPES } from '../constants';
import type { NavigationData } from './index';

export interface SystemEventMap {
  navigation: NavigationData;
}

export type SystemEventName = keyof SystemEventMap;

export type EventMessage<K extends SystemEventName = SystemEventName> = {
  type: typeof MESSAGE_TYPES.EVENT;
  event: K;
  data: SystemEventMap[K];
};

export type EventListener<K extends SystemEventName> = (data: SystemEventMap[K]) => void;
