import { PERMISSION_ENUM } from '../../../shared/metadata';

export interface INav {
  id: number;
  name: string;
  path: string;
  permission?: PERMISSION_ENUM;
}
