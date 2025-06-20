import React, { useState, useMemo } from 'react'
import { Tree, Typography, Tag, Space } from 'antd'
import type { TreeProps } from 'antd'
import { 
  CaretRightOutlined, 
  CaretDownOutlined,
  FileTextOutlined,
  NumberOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
  FolderOutlined
} from '@ant-design/icons';
import  './JsonTreeView.scss'

import type { JsonTreeViewProps, JsonValue, JsonDataType, TreeNodeData, JsonObject, JsonArray } from '../../../Types/index'
const { Text } = Typography

const JsonTreeView: React.FC<JsonTreeViewProps> = ({data}) => {
  
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const getValueType = (value: JsonValue): JsonDataType => {
    if (value === null) return 'null'
    if (Array.isArray(value)) return 'array'
    return typeof value as JsonDataType
  }

  const getTypeIcon = (type: JsonDataType): React.ReactNode => {
    switch (type) {
      case 'string': return <FileTextOutlined />
      case 'number': return <NumberOutlined />
      case 'boolean': return <CheckCircleOutlined />
      case 'null': return <QuestionCircleOutlined />
      case 'array': return <UnorderedListOutlined />
      case 'object': return <FolderOutlined />
      default: return <QuestionCircleOutlined />
    }
  }

  const getBooleanIcon = (value: boolean): React.ReactNode => {
    return value ? <CheckCircleOutlined /> : <CloseCircleOutlined />
  }

  const getTypeColor = (type: JsonDataType): string => {
    switch (type) {
      case 'string': return 'blue'
      case 'number': return 'green'
      case 'boolean': return 'orange'
      case 'null': return 'default'
      case 'array': return 'purple'
      case 'object': return 'cyan'
      default: return 'default'
    }
  }

  const renderValue = (value: JsonValue, type: JsonDataType): React.ReactNode => {
    switch (type) {
      case 'string':
        return <Text code className="json-string">"{value as string}"</Text>
      case 'number':
        return <Text className="json-number">{value as number}</Text>
      case 'boolean':
        return <Text className={`json-boolean ${value ? 'true' : 'false'}`}>{String(value)}</Text>
      case 'null':
        return <Text className="json-null">null</Text>
      default:
        return <Text>{String(value)}</Text>
    }
  }

  const buildTreeData = (obj: JsonValue, parentKey: string = ''): TreeNodeData[] => {
    if (obj === null || obj === undefined) {
      return []
    }

    if (typeof obj !== 'object') {
      return []
    }

    const entries = Array.isArray(obj) 
      ? obj.map((item, index) => [String(index), item] as [string, JsonValue])
      : Object.entries(obj as JsonObject)

    return entries.map(([key, value]) => {
      const nodeKey = parentKey ? `${parentKey}-${key}` : key
      const type = getValueType(value)
      const isLeaf = type !== 'object' && type !== 'array'
      
      const title = (
        <Space className="tree-node-title">
          <Text strong className="json-key">
            {Array.isArray(obj) ? `[${key}]:` : `${key}:`}
          </Text>
          {isLeaf && renderValue(value, type)}
          {!isLeaf && (
            <Space>
              <Tag 
                icon={getTypeIcon(type)} 
                color={getTypeColor(type)} 
                className="type-tag"
              >
                {type === 'array' ? `Array(${(value as JsonArray).length})` : 'Object'}
              </Tag>
            </Space>
          )}
        </Space>
      )

      const node: TreeNodeData = {
        title,
        key: nodeKey,
        icon: type === 'boolean' ? getBooleanIcon(value as boolean) : getTypeIcon(type),
        className: `tree-node tree-node-${type}`,
        isLeaf
      }

      if (!isLeaf) {
        node.children = buildTreeData(value, nodeKey)
      }

      return node
    })
  }

  const treeData = useMemo(() => buildTreeData(data), [data])

  const onExpand: TreeProps['onExpand'] = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  const switcherIcon: TreeProps['switcherIcon'] = ({ expanded }) => 
    expanded ? <CaretDownOutlined /> : <CaretRightOutlined />

  return (
    <div className="json-tree-view">
      <Tree
        showIcon
        switcherIcon={switcherIcon}
        treeData={treeData}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        className="json-tree"
      />
    </div>
  )
}


export default JsonTreeView