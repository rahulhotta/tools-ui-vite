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
  compareWith?: string;
}

export interface JsonTreeViewProps {
  data: JsonValue;
  differences?: JsonDifferences;
}

export interface JsonComparisonProps {
  json1: string;
  json2: string;
  isVisible: boolean;
  onClose: () => void;
}

export interface JsonDifferences {
  added: { [key: string]: any };
  deleted: { [key: string]: any };
  updated: { [key: string]: any };
}

export type ViewMode = 'tree' | 'raw' | 'comparison';

export type DifferenceType = 'added' | 'deleted' | 'updated' | 'none';
