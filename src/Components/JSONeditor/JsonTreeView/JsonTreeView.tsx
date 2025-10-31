import React, { useState } from 'react';
import './JsonTreeView.scss'

// Types - made compatible with parent component's JsonValue type
type JsonValue = unknown;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
type JsonDataType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'undefined';

interface JsonTreeViewProps {
  data: JsonValue;
}

interface TreeNodeProps {
  nodeKey: string;
  value: JsonValue;
  isArrayItem?: boolean;
  arrayIndex?: number;
  depth?: number;
}

// Simple SVG Icons
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// const FileTextIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <path d="M9 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V7L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M9 2V7H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const HashIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <path d="M3 6H13M3 10H13M6.5 2V14M9.5 2V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const CheckCircleIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
//     <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const XCircleIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
//     <path d="M10 6L6 10M6 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const HelpCircleIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
//     <path d="M6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4C8.53043 4 9.03914 4.21071 9.41421 4.58579C9.78929 4.96086 10 5.46957 10 6C10 7 8 7 8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//     <circle cx="8" cy="11" r="0.5" fill="currentColor"/>
//   </svg>
// );

// const ListIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <path d="M5 4H13M5 8H13M5 12H13M2 4H2.01M2 8H2.01M2 12H2.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const FolderIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//     <path d="M14 12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6L7.33333 4H12.6667C13.0203 4 13.3594 4.14048 13.6095 4.39052C13.8595 4.64057 14 4.97971 14 5.33333V12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data }) => {
  return (
    <div className="json-tree-view">
      <TreeNode nodeKey="root" value={data} depth={0} />
    </div>
  );
};

export { JsonTreeView };

const TreeNode: React.FC<TreeNodeProps> = ({ 
  nodeKey, 
  value, 
  isArrayItem = false, 
  arrayIndex,
  depth = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  
  const getValueType = (val: JsonValue): JsonDataType => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) return 'array';
    return typeof val as JsonDataType;
  };

  const type = getValueType(value);
  const isExpandable = type === 'object' || type === 'array';
  
  // const getTypeIcon = (t: JsonDataType) => {
  //   switch (t) {
  //     case 'string': return <FileTextIcon />;
  //     case 'number': return <HashIcon />;
  //     case 'boolean': return value ? <CheckCircleIcon /> : <XCircleIcon />;
  //     case 'null': return <HelpCircleIcon />;
  //     case 'array': return <ListIcon />;
  //     case 'object': return <FolderIcon />;
  //     default: return <HelpCircleIcon />;
  //   }
  // };

  const renderValue = (val: JsonValue, t: JsonDataType): React.ReactNode => {
    switch (t) {
      case 'string':
        return <span className="value-string">"{val as string}"</span>;
      case 'number':
        return <span className="value-number">{val as number}</span>;
      case 'boolean':
        return <span className={val ? 'value-boolean-true' : 'value-boolean-false'}>{String(val)}</span>;
      case 'null':
        return <span className="value-null">null</span>;
      default:
        return <span>{String(val)}</span>;
    }
  };

  const getLabel = () => {
    if (isArrayItem && arrayIndex !== undefined) {
      return `[${arrayIndex}]`;
    }
    return nodeKey === 'root' ? 'root' : nodeKey;
  };

  const getItemCount = () => {
    if (type === 'array') {
      return (value as JsonArray).length;
    }
    if (type === 'object') {
      return Object.keys(value as JsonObject).length;
    }
    return 0;
  };

  const handleToggle = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="tree-node-wrapper">
      <div 
        className={`tree-node ${isExpandable ? 'expandable' : ''}`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={handleToggle}
      >
        {/* Expand/Collapse Icon */}
        <div className="expand-icon">
          {isExpandable ? (
            isExpanded ? <ChevronDown /> : <ChevronRight />
          ) : (
            <span className="icon-spacer" />
          )}
        </div>

        {/* Type Icon */}
        {/* <div className={`type-icon-wrapper type-${type}`}>
          {getTypeIcon(type)}
        </div> */}

        {/* Key/Label */}
        <span className="node-key">
          {getLabel()}:
        </span>

        {/* Value or Type Tag */}
        {!isExpandable ? (
          renderValue(value, type)
        ) : (
          <span className={`type-tag type-tag-${type}`}>
            {type === 'array' ? `Array(${getItemCount()})` : `Object{${getItemCount()}}`}
          </span>
        )}
      </div>

      {/* Children */}
      {isExpandable && isExpanded && (
        <div className="tree-children">
          {type === 'array' ? (
            (value as JsonArray).map((item, index) => (
              <TreeNode
                key={`${nodeKey}-${index}`}
                nodeKey={String(index)}
                value={item}
                isArrayItem={true}
                arrayIndex={index}
                depth={depth + 1}
              />
            ))
          ) : (
            Object.entries(value as JsonObject).map(([key, val]) => (
              <TreeNode
                key={`${nodeKey}-${key}`}
                nodeKey={key}
                value={val}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Demo component with sample data
const JsonTREEView = ({data}) => {


  return (
    <div className="demo-container">
          <JsonTreeView data={data} />
    </div>
  );
};

export default JsonTREEView;