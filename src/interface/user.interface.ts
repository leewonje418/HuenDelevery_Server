import Driver from '../entity/driver';

export interface IDriver extends Driver {
  totalCount: number;
  completedCount: number;
}