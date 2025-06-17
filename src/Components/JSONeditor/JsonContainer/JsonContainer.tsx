import  { useState, useMemo } from 'react'
import {  Switch, Space, Typography, Alert, Button, message } from 'antd'
import { EyeOutlined, EditOutlined, CopyOutlined, DownloadOutlined ,DeleteOutlined} from '@ant-design/icons'
import './JsonContainer.scss';
import JsonTreeView from '../JsonTreeView/JsonTreeView';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import CommonCard from '../../../Utils/CommonElements/Card/CommonCard';
// const { TextArea } = Input
const { Title } = Typography;

interface jsonContainerPropType {
    title : string | null,
    value : string,
    onChange: (event:string)=>void,
    containerKey : string,
    handleClear: (containerKey:string)=>void
}

const JsonContainer : React.FC<jsonContainerPropType> = ({ title, value, onChange, containerKey,handleClear }) => {
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
  return (
    <div style={{height:"100%"}}>
        <CommonCard 
      
    >
      <div className="json-container">
      <div>
         <div className="container-header">
          <Title level={4} className="container-title">{title}</Title>
          <Space>

            <Button color="primary" size="small" variant="outlined"  onClick={handleCopy}
              title="Copy JSON">
                <CopyOutlined />
            </Button>

            <Button size="small" color="primary" variant="outlined" onClick={handleDownload}
              title="Download JSON">
                <DownloadOutlined />
            </Button>

            <Button size="small" color="danger" variant="outlined" onClick={() => {handleClear(containerKey)}}
              title="Download JSON">
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
              <JsonTreeView data={parsedJson} />
            ) : (
              <div className="empty-state">
                {value.trim() === '' ? 'Enter JSON data to view tree' : 'Fix JSON syntax errors to view tree'}
              </div>
            )}
          </div>
        ) : (
        //   <TextArea
        //     value={value}
        //     onChange={handleTextChange}
        //     className={json-textarea ${!isValid ? 'error' : ''}}
        //     rows={20}
        //     placeholder="Enter your JSON here..."
        //     spellCheck={false}
        //   />

        <CodeMirror
            value={value}
            height="100%"
            extensions={[json()]}
            onChange={(val: string) => onChange(val)}
            theme="light"
            />
        )}
      </div>
        </div>  
    </CommonCard>
    </div>
  )
}

export default JsonContainer