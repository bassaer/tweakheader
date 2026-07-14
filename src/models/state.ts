export type Action = 'Set' | 'Remove';

export interface Header {
  id: string;
  name: string;
  value: string;
  enable: boolean;
  action: Action;
}

export type State = {
  running: boolean;
  headers: Header[];
}

export type ActionType = {
  type: 'init' | 'running' | 'add' | 'name' | 'value' | 'enable' | 'action' | 'delete';
  state?: State;
  running?: boolean;
  header?: Header;
  name?: string;
  value?: string;
  enable?: boolean;
  action?: Action;
}
