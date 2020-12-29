export type Action = 'Add' | 'Modify' | 'Delete';

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
  type: 'init' | 'running' | 'add' | 'name' | 'value' | 'enable' | 'enable' | 'action' | 'delete';
  running?: boolean;
  header?: Header;
  name?: string;
  value?: string;
  enable?: boolean;
  action?: Action;
  headers?: Header[];
}
