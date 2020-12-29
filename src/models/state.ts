export type Action = 'Add' | 'Modify' | 'Delete';

export interface Header {
  id: string;
  name: string;
  value: string;
  enable: boolean;
  action: Action;
}

export type State = {
  playing: boolean;
  headers: Header[];
}

export type ActionType = {
  type: 'init' | 'playing' | 'add' | 'name' | 'value' | 'enable' | 'enable' | 'action' | 'delete';
  playing?: boolean;
  header?: Header;
  name?: string;
  value?: string;
  enable?: boolean;
  action?: Action;
  headers?: Header[];
}
