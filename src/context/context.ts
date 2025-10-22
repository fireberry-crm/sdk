import { ContextDetails, RecordDetails, UserDetails } from '../types';

export class Context {
  public user: UserDetails;
  public record: RecordDetails;

  constructor(context: ContextDetails) {
    this.user = context.user;
    this.record = context.record;
  }
}
