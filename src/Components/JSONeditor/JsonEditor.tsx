import './JsonEditor.scss';
import { useState, useEffect } from 'react'
import {  Row, Col, message, Switch, Space, Button, Typography } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import JsonContainer from './JsonContainer/JsonContainer'

const { Title } = Typography

// Utility function to deeply compare JSON objects and find differences
const findDifferences = (obj1: any, obj2: any, path = ''): any[] => {
  const differences: any[] = [];
  
  const traverse = (o1: any, o2: any, currentPath: string) => {
    if (o1 === o2) return;
    
    if (typeof o1 !== typeof o2) {
      differences.push({
        path: currentPath,
        type: 'type_change',
        left: o1,
        right: o2
      });
      return;
    }
    
    if (o1 === null || o2 === null) {
      differences.push({
        path: currentPath,
        type: 'value_change',
        left: o1,
        right: o2
      });
      return;
    }
    
    if (Array.isArray(o1) && Array.isArray(o2)) {
      const maxLength = Math.max(o1.length, o2.length);
      for (let i = 0; i < maxLength; i++) {
        const newPath = currentPath ? `${currentPath}[${i}]` : `[${i}]`;
        if (i >= o1.length) {
          differences.push({
            path: newPath,
            type: 'added',
            left: undefined,
            right: o2[i]
          });
        } else if (i >= o2.length) {
          differences.push({
            path: newPath,
            type: 'removed',
            left: o1[i],
            right: undefined
          });
        } else {
          traverse(o1[i], o2[i], newPath);
        }
      }
    } else if (typeof o1 === 'object' && typeof o2 === 'object') {
      const allKeys = new Set([...Object.keys(o1), ...Object.keys(o2)]);
      for (const key of allKeys) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        if (!(key in o1)) {
          differences.push({
            path: newPath,
            type: 'added',
            left: undefined,
            right: o2[key]
          });
        } else if (!(key in o2)) {
          differences.push({
            path: newPath,
            type: 'removed',
            left: o1[key],
            right: undefined
          });
        } else {
          traverse(o1[key], o2[key], newPath);
        }
      }
    } else if (o1 !== o2) {
      differences.push({
        path: currentPath,
        type: 'value_change',
        left: o1,
        right: o2
      });
    }
  };
  
  traverse(obj1, obj2, path);
  return differences;
};

const defaultJson1 = {
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "address": {
            "street": "123 Main St",
            "city": "New York",
            "zipCode": "10001"
        },
        "hobbies": ["reading", "gaming", "cooking"]
    },
    "settings": {
        "theme": "dark",
        "notifications": true
    }
}

const defaultJson2 = {
    "user": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "address": {
            "street": "456 Oak Ave",
            "city": "Los Angeles",
            "zipCode": "90210"
        },
        "hobbies": ["reading", "traveling", "photography"]
    },
    "settings": {
        "theme": "light",
        "notifications": false,
        "language": "en"
    }
}

const JsonEditor = () => {
    const [json1, setJson1] = useState(JSON.stringify(defaultJson1, null, 2))
    const [json2, setJson2] = useState(JSON.stringify(defaultJson2, null, 2));
    const [compareMode, setCompareMode] = useState(false);
    const [differences, setDifferences] = useState<any[]>([]);
    const [parsedJson1, setParsedJson1] = useState<any>(null);
    const [parsedJson2, setParsedJson2] = useState<any>(null);

    // Parse JSONs and calculate differences
    useEffect(() => {
        try {
            const parsed1 = JSON.parse(json1);
            setParsedJson1(parsed1);
        } catch {
            setParsedJson1(null);
        }

        try {
            const parsed2 = JSON.parse(json2);
            setParsedJson2(parsed2);
        } catch {
            setParsedJson2(null);
        }
    }, [json1, json2]);

    useEffect(() => {
        if (compareMode && parsedJson1 && parsedJson2) {
            const diffs = findDifferences(parsedJson1, parsedJson2);
            setDifferences(diffs);
            
            if (diffs.length > 0) {
                message.info(`Found ${diffs.length} difference(s)`);
            } else {
                message.success('No differences found');
            }
        } else {
            setDifferences([]);
        }
    }, [compareMode, parsedJson1, parsedJson2]);

    const handleSwap = () => {
        const temp = json1;
        setJson1(json2)
        setJson2(temp)
        message.success('JSON data swapped successfully!')
    }

    const handleClear = (jsonNumber: string) => {
        if (jsonNumber === 'container1') {
            setJson1('{}')
            message.success('JSON cleared!')
        } else {
            setJson2('{}')
            message.success('JSON cleared!')
        }
    }

    return (
        <div>
            <div className="app-layout">
                <div className="app-content">
                    {/* Compare Controls */}
                    <div className="compare-controls" style={{ marginBottom: '16px', textAlign: 'center' }}>
                        <Space size="large">
                            <div>
                                <Title level={3} style={{ margin: 0 }}>JSON Editor with Compare</Title>
                            </div>
                            
                            <Space>
                                <Switch
                                    checked={compareMode}
                                    onChange={setCompareMode}
                                    checkedChildren="Compare ON"
                                    unCheckedChildren="Compare OFF"
                                />
                                
                                <Button 
                                    icon={<SwapOutlined />} 
                                    onClick={handleSwap}
                                    type="primary"
                                >
                                    Swap JSONs
                                </Button>
                            </Space>
                        </Space>

                        {/* Differences Summary */}
                        {/* {compareMode && differences.length > 0 && (
                            <Alert
                                message={`Found ${differences.length} difference(s)`}
                                description={
                                    <div style={{ textAlign: 'left' }}>
                                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                            {differences.slice(0, 5).map((diff, index) => (
                                                <li key={index} style={{ fontSize: '12px', margin: '4px 0' }}>
                                                    <code>{diff.path || 'root'}</code>: {diff.type.replace('_', ' ')}
                                                    {diff.type === 'value_change' && (
                                                        <span> ({JSON.stringify(diff.left)} → {JSON.stringify(diff.right)})</span>
                                                    )}
                                                </li>
                                            ))}
                                            {differences.length > 5 && (
                                                <li style={{ fontSize: '12px', color: '#666' }}>
                                                    ...and {differences.length - 5} more
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                }
                                type="info"
                                showIcon
                                style={{ marginTop: '12px', textAlign: 'left' }}
                            />
                        )} */}

                        {/* {compareMode && differences.length === 0 && parsedJson1 && parsedJson2 && (
                            <Alert
                                message="No differences found"
                                description="Both JSON documents are identical"
                                type="success"
                                showIcon
                                style={{ marginTop: '12px' }}
                            />
                        )} */}

                        {/* Legend */}
                        {compareMode && (
                            <div style={{ marginTop: '12px' }}>
                                <Space>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ 
                                            width: '16px', 
                                            height: '16px', 
                                            backgroundColor: '#f6ffed', 
                                            borderLeft: '3px solid #52c41a' 
                                        }}></div>
                                        <span style={{ fontSize: '12px' }} className='legend_text'>Added</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ 
                                            width: '16px', 
                                            height: '16px', 
                                            backgroundColor: '#fff2f0', 
                                            borderLeft: '3px solid #ff4d4f' 
                                        }}></div>
                                        <span style={{ fontSize: '12px' }} className='legend_text'>Removed</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ 
                                            width: '16px', 
                                            height: '16px', 
                                            backgroundColor: '#fff7e6', 
                                            borderLeft: '3px solid #fa8c16' 
                                        }}></div>
                                        <span style={{ fontSize: '12px' }} className='legend_text'>Modified</span>
                                    </div>
                                </Space>
                            </div>
                        )}
                    </div>

                    <Row gutter={[16, 16]} className="json-row">
                        <Col xs={24} lg={12}>
                            <JsonContainer
                                title="JSON Document 1"
                                value={json1}
                                onChange={setJson1}
                                containerKey="container1"
                                handleClear={handleClear}
                                compareMode={compareMode}
                                differences={differences}
                                side="left"
                            />
                        </Col>
                        <Col xs={24} lg={12}>
                            <JsonContainer
                                title="JSON Document 2"
                                value={json2}
                                onChange={setJson2}
                                containerKey="container2"
                                handleClear={handleClear}
                                compareMode={compareMode}
                                differences={differences}
                                side="right"
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default JsonEditor