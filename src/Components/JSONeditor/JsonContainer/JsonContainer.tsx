import { useState, useMemo, useEffect } from 'react'
import { Switch, Space, Typography, Alert, Button, message } from 'antd'
import { EyeOutlined, EditOutlined, CopyOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import './JsonContainer.scss';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView, Decoration } from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';
import CommonCard from '../../../Utils/CommonElements/Card/CommonCard';
import JsonTreeView from '../JsonTreeView/JsonTreeView';

const { Title } = Typography;

// Define decoration effects for diff highlighting
const addLineEffect = StateEffect.define();
const removeLineEffect = StateEffect.define();
const changeLineEffect = StateEffect.define();
const clearDecorations = StateEffect.define();

interface Diff {
    type: 'added' | 'removed' | 'value_change' | 'type_change';
    path: string;
}

type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };
interface EnhancedJsonTreeViewProps {
  data: JsonValue;
}

// Create decorations for different types of changes
const addedDecoration = Decoration.line({
  attributes: { style: "background-color: #f6ffed; border-left: 3px solid #52c41a; padding-left: 4px;" }
});

const removedDecoration = Decoration.line({
  attributes: { style: "background-color: #fff2f0; border-left: 3px solid #ff4d4f; padding-left: 4px;" }
});

const changedDecoration = Decoration.line({
  attributes: { style: "background-color: #fff7e6; border-left: 3px solid #fa8c16; padding-left: 4px;" }
});

// State field to manage decorations
const decorationsField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    
   for (const e of tr.effects) {
  if (e.is(addLineEffect) && e.value !== null) {
    const value = e.value as number;
    decorations = decorations.update({
      add: [addedDecoration.range(value)],
    });
  } else if (e.is(removeLineEffect) && e.value !== null) {
    const value = e.value as number;
    decorations = decorations.update({
      add: [removedDecoration.range(value)],
    });
  } else if (e.is(changeLineEffect) && e.value !== null) {
    const value = e.value as number;
    decorations = decorations.update({
      add: [changedDecoration.range(value)],
    });
  } else if (e.is(clearDecorations)) {
    decorations = Decoration.none;
  }
}


    return decorations;
  },
  provide: f => EditorView.decorations.from(f)
});

// Function to find line numbers for paths in JSON string
const findLineForPath = (jsonString:string, path:string) => {
  if (!path) return [];
  
  const lines = jsonString.split('\n');
  const pathParts = path.split(/[.\[\]]/).filter(p => p !== '');
  const foundLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if any part of the path appears in this line
    for (const part of pathParts) {
      if (line.includes(`"${part}"`) || 
          (line.includes(part) && /^\d+$/.test(part)) ||
          line.includes(`"${part}"`)) {
        foundLines.push(i);
        break;
      }
    }
  }
  
  return foundLines;
};

// Enhanced JsonTreeView with diff highlighting


interface jsonContainerPropType {
    title: string | null,
    value: string,
    onChange: (event: string) => void,
    containerKey: string,
    handleClear: (containerKey: string) => void,
    compareMode?: boolean,
    differences?: Diff[],
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
    const [editorView, setEditorView] = useState(null)

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

    // Apply decorations when differences change
    useEffect(() => {
        if (editorView && compareMode && differences.length > 0) {
            const effects = [clearDecorations.of(null)];
            
            differences.forEach(diff => {
                const lines = findLineForPath(value, diff.path);
                
                lines.forEach(lineNum => {
                    try {
                        const line = editorView.state.doc.line(lineNum + 1);
                        
                        if (diff.type === 'added' && side === 'right') {
                            effects.push(addLineEffect.of(line.from));
                        } else if (diff.type === 'removed' && side === 'left') {
                            effects.push(removeLineEffect.of(line.from));
                        } else if (diff.type === 'value_change' || diff.type === 'type_change') {
                            effects.push(changeLineEffect.of(line.from));
                        }
                    } catch (e) {
                        // Line number might be out of bounds, skip
                        console.warn('Line number out of bounds:', lineNum + 1,e);
                    }
                });
            });
            
            if (effects.length > 1) {
                editorView.dispatch({ effects });
            }
        } else if (editorView) {
            editorView.dispatch({ effects: [clearDecorations.of(null)] });
        }
    }, [editorView, compareMode, differences, value, side]);

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

    const EnhancedJsonTreeView = ({ data }: EnhancedJsonTreeViewProps) => {
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
                        {differences.length} difference(s) found - Switch to Edit mode for detailed highlighting
                    </div>
                )}
            </div>
        );
    };

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

    // Get relevant differences for this side
    const relevantDifferences = differences.filter(d => 
        (d.type === 'added' && side === 'right') ||
        (d.type === 'removed' && side === 'left') ||
        (d.type === 'value_change' || d.type === 'type_change')
    );

    return (
        <div style={{ height: "100%" }}>
            <CommonCard>
                <div className="json-container">
                    <div>
                        <div className="container-header">
                            <Title level={4} className="container-title">
                                {title}
                                {compareMode && relevantDifferences.length > 0 && (
                                    <span style={{ 
                                        marginLeft: '8px', 
                                        fontSize: '12px', 
                                        color: '#1890ff',
                                        fontWeight: 'normal'
                                    }}>
                                        ({relevantDifferences.length} changes)
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
                                    extensions={[json(), decorationsField]}
                                    onChange={(val: string) => onChange(val)}
                                    theme="light"
                                    onCreateEditor={(view) => setEditorView(view)}
                                />
                                
                                {/* Show comparison status */}
                                {compareMode && relevantDifferences.length > 0 && (
                                    <div className="diff-indicator">
                                        <span className="diff-count">
                                            {relevantDifferences.length} change(s) highlighted
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