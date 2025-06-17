import { useState, useMemo } from 'react'
import { Switch, Space, Typography, Alert, Button, message } from 'antd'
import { EyeOutlined, EditOutlined, CopyOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import './JsonContainer.scss';
import JsonTreeView from '../JsonTreeView/JsonTreeView';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import CommonCard from '../../../Utils/CommonElements/Card/CommonCard';

const { Title } = Typography;

interface jsonContainerPropType {
    title: string | null,
    value: string,
    onChange: (event: string) => void,
    containerKey: string,
    handleClear: (containerKey: string) => void,
    compareMode?: boolean,
    differences?: any[],
    side?: 'left' | 'right'
}

const JsonContainer: React.FC<jsonContainerPropType> = ({ 
    title, 
    value, 
    onChange, 
    containerKey, 
    handleClear,
    compareMode = false,
    differences = [],
    side = 'left'
}) => {
    const [viewMode, setViewMode] = useState('tree')
    const [isValid, setIsValid] = useState(true)
    const [error, setError] = useState('')

    const parsedJson = useMemo(() => {
        try {
            const parsed = JSON.parse(value)
            setIsValid(true)
            setError('')
            return parsed
        } catch (err) {
            setIsValid(false)
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    }, [value])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            message.success('JSON copied to clipboard!')
        } catch (err) {
            if (err instanceof Error) {
                message.error('Failed to copy JSON');
            }
        }
    }

    const handleDownload = () => {
        const blob = new Blob([value], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${containerKey}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        message.success('JSON downloaded!')
    }

    const formatJson = () => {
        if (isValid && parsedJson) {
            onChange(JSON.stringify(parsedJson, null, 2))
            message.success('JSON formatted!')
        }
    }

    // Enhanced tree view with diff highlighting
    const EnhancedJsonTreeView = ({ data }: { data: any }) => {
        if (!compareMode || !differences.length) {
            return <JsonTreeView data={data} />;
        }

        // For tree view, we'll add a subtle border to indicate comparison mode
        const containerStyle = {
            border: compareMode ? '1px solid #d9d9d9' : 'none',
            borderRadius: '4px',
            padding: compareMode ? '8px' : '0'
        };

        return (
            <div style={containerStyle}>
                <JsonTreeView data={data} />
                {compareMode && differences.length > 0 && (
                    <div style={{ 
                        marginTop: '8px', 
                        padding: '4px 8px', 
                        backgroundColor: '#f0f2f5', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#666'
                    }}>
                        {differences.length} difference(s) found - Switch to Raw mode for detailed highlighting
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ height: "100%" }}>
            <CommonCard>
                <div className="json-container">
                    <div>
                        <div className="container-header">
                            <Title level={4} className="container-title">
                                {title}
                                {compareMode && differences.length > 0 && (
                                    <span style={{ 
                                        marginLeft: '8px', 
                                        fontSize: '12px', 
                                        color: '#1890ff',
                                        fontWeight: 'normal'
                                    }}>
                                        ({differences.filter(d => 
                                            (d.type === 'added' && side === 'right') ||
                                            (d.type === 'removed' && side === 'left') ||
                                            (d.type === 'value_change' || d.type === 'type_change')
                                        ).length} changes)
                                    </span>
                                )}
                            </Title>
                            <Space>
                                <Button 
                                    color="primary" 
                                    size="small" 
                                    variant="outlined" 
                                    onClick={handleCopy}
                                    title="Copy JSON"
                                >
                                    <CopyOutlined />
                                </Button>

                                <Button 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined" 
                                    onClick={handleDownload}
                                    title="Download JSON"
                                >
                                    <DownloadOutlined />
                                </Button>

                                <Button 
                                    size="small" 
                                    color="danger" 
                                    variant="outlined" 
                                    onClick={() => { handleClear(containerKey) }}
                                    title="Clear JSON"
                                >
                                    <DeleteOutlined />
                                </Button>
                                
                                <Button
                                    size="small"
                                    onClick={formatJson}
                                    disabled={!isValid}
                                    title="Format JSON"
                                    type='primary'
                                >
                                    Format
                                </Button>
                            </Space>
                        </div>
                        <Space align="center" className='edit_toggle_container'>
                            <EyeOutlined className={viewMode === 'tree' ? 'active-icon' : ''} />
                            <Switch
                                checked={viewMode === 'raw'}
                                onChange={(checked) => setViewMode(checked ? 'raw' : 'tree')}
                                size="small"
                            />
                            <EditOutlined className={viewMode === 'raw' ? 'active-icon' : ''} />
                        </Space>
                    </div>

                    {!isValid && (
                        <Alert
                            message="Invalid JSON"
                            description={error}
                            type="error"
                            showIcon
                            className="error-alert"
                        />
                    )}

                    <div className="content-container">
                        {viewMode === 'tree' ? (
                            <div className="tree-view-container">
                                {isValid && parsedJson ? (
                                    <EnhancedJsonTreeView data={parsedJson} />
                                ) : (
                                    <div className="empty-state">
                                        {value.trim() === '' ? 'Enter JSON data to view tree' : 'Fix JSON syntax errors to view tree'}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div 
                                className={`code-editor-wrapper ${compareMode ? 'compare-mode' : ''}`}
                                data-differences={JSON.stringify(differences)}
                                data-side={side}
                            >
                                <CodeMirror
                                    value={value}
                                    height="100%"
                                    extensions={[json()]}
                                    onChange={(val: string) => onChange(val)}
                                    theme="light"
                                />
                                
                                {/* Show comparison status */}
                                {compareMode && differences.length > 0 && (
                                    <div className="diff-indicator">
                                        <span className="diff-count">
                                            {differences.filter(d => 
                                                (d.type === 'added' && side === 'right') ||
                                                (d.type === 'removed' && side === 'left') ||
                                                (d.type === 'value_change' || d.type === 'type_change')
                                            ).length} change(s) highlighted
                                        </span>
                                    </div>
                                )}
                                
                                
                            </div>
                        )}
                    </div>
                </div>
            </CommonCard>
        </div>
    )
}

export default JsonContainer