export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonObject 
  | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type JsonDataType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

export interface TreeNodeData {
  title: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  className?: string;
  isLeaf: boolean;
  children?: TreeNodeData[];
}

export interface JsonContainerProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  containerKey: string;
}

export interface JsonTreeViewProps {
  data: JsonValue;
}

export type ViewMode = 'tree' | 'raw';
