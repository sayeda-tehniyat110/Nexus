export type MouseAction = 'move' | 'click' | 'right_click' | 'double_click' | 'scroll' | 'drag';

export type KeyboardAction = 'type' | 'press' | 'hotkey';

export type FileAction = 'read' | 'write' | 'delete' | 'move' | 'copy' | 'list';

export type AppAction = 'launch' | 'close' | 'focus' | 'list';

export type ActionResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export interface MouseParams {
  x?: number;
  y?: number;
  button?: 'left' | 'right' | 'middle';
  clicks?: number;
  dx?: number;
  dy?: number;
  duration?: number;
}

export interface KeyboardParams {
  text?: string;
  key?: string;
  keys?: string[];
}

export interface FileParams {
  path: string;
  content?: string;
  destination?: string;
}

export interface AppParams {
  name?: string;
  pid?: number;
  path?: string;
}
