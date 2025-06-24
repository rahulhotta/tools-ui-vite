import React, { useState } from 'react'
import { QRCode, Segmented, Space, ColorPicker, Slider, Select, Upload, Switch, Tooltip } from 'antd';
import type { QRCodeProps } from 'antd';
import CommonCard from '../../Utils/CommonElements/Card/CommonCard';
import { Col, Row, message } from 'antd';
import { Form, Input } from 'antd';
import "./QRCodeGenerator.scss";
import Button from '../../Utils/CommonElements/Button/Button';
import { CopyOutlined, HistoryOutlined } from '@ant-design/icons';
import { FaRegCircleQuestion } from "react-icons/fa6";

type FieldType = {
  content?: string;
};

type QRHistory = {
  content: string;
  timestamp: number;
};

function QRCodeGenerator() {
  const [content, setContent] = useState('https://littletools.cc/');
  const [messageApi, contextHolder] = message.useMessage();
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [qrSize, setQrSize] = useState(300);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');
  const [logo, setLogo] = useState<string | null>(null);
  const [qrHistory, setQrHistory] = useState<QRHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);

  function doDownload(url: string, fileName: string) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadCanvasQRCode = () => {
    const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      doDownload(url, 'LittleToolsQRCode.png');
    }
  };

  const downloadSvgQRCode = () => {
    const svg = document.getElementById('myqrcode')?.querySelector<SVGElement>('svg');
    const svgData = new XMLSerializer().serializeToString(svg!);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    doDownload(url, 'QRCode.svg');
  };

  const addToHistory = (newContent: string) => {
    if (newContent && newContent !== 'https://littletools.cc/') {
      setQrHistory(prev => {
        const exists = prev.some(item => item.content === newContent);
        if (!exists) {
          const newHistory = [{ content: newContent, timestamp: Date.now() }, ...prev.slice(0, 9)];
          return newHistory;
        }
        return prev;
      });
    }
  };

  function handleChange(e) {
    const newContent = e.target.value || 'https://littletools.cc/';
    if (e.target.value.length <= 2000) {
      setContent(newContent);
      if (autoGenerate) {
        addToHistory(newContent);
      }
    }
  }

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      messageApi.success('Content copied to clipboard!');
    });
  };

  const selectFromHistory = (historyContent: string) => {
    setContent(historyContent);
    setShowHistory(false);
  };



  const [renderType, setRenderType] = React.useState<QRCodeProps['type']>('canvas');

  const handleDownloadChange = (value: QRCodeProps['type']) => {
    setRenderType(value);
  };

  return (
    <>
      <div className='qr_scanner'>
        {contextHolder}
        <Row gutter={24} className='qr_container'>
          <Col span={24} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }}>
            <CommonCard>
              <div className='input-card'>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <Form
                    layout="vertical"
                    name="basic"
                    style={{ width: '100%' }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                  >
                    <Form.Item<FieldType>
                      name="content"
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          Content
                          <Tooltip title="Copy current content">
                            <CopyOutlined onClick={copyToClipboard} style={{ cursor: 'pointer', color: '#1890ff' }} />
                          </Tooltip>
                          <Tooltip title="Show history">
                            <HistoryOutlined
                              onClick={() => setShowHistory(!showHistory)}
                              style={{ cursor: 'pointer', color: qrHistory.length > 0 ? '#1890ff' : '#ccc' }}
                            />
                          </Tooltip>
                        </div>
                      }
                      rules={[{ required: true, message: 'Please Enter Your Content!' },
                      { max: 2000, message: 'Content must be less than 2000 characters!' }
                      ]}
                    >
                      <Input.TextArea
                        placeholder="Please Enter The URL or content"
                        value={content}
                        onChange={(e) => handleChange(e)}
                        style={{ width: "100%" }}
                        rows={3}
                        showCount
                        maxLength={2000}
                      />
                    </Form.Item>
                  </Form>

                  {showHistory && qrHistory.length > 0 && (
                    <div style={{ marginBottom: '16px', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                      <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>Recent QR Codes:</div>
                      {qrHistory.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '4px 8px',
                            margin: '2px 0',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                          onClick={() => selectFromHistory(item.content)}
                        >
                          {item.content.length > 50 ? `${item.content.substring(0, 50)}...` : item.content}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginBottom: '4px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>Customization:</div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', marginBottom: '4px' }}>Size: {qrSize}px</div>
                      <Slider
                        min={100}
                        max={500}
                        value={qrSize}
                        onChange={setQrSize}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <Row gutter={8} style={{ marginBottom: '12px' }}>
                      <Col span={12}>
                        <div style={{ fontSize: '11px', marginBottom: '4px' }}>Background</div>
                        <ColorPicker
                          value={bgColor}
                          onChange={(color) => setBgColor(color.toHexString())}
                          showText
                          size="small"
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col span={12}>
                        <div style={{ fontSize: '11px', marginBottom: '4px' }}>Foreground</div>
                        <ColorPicker
                          value={fgColor}
                          onChange={(color) => setFgColor(color.toHexString())}
                          showText
                          size="small"
                          style={{ width: '100%' }}
                        />
                      </Col>
                    </Row>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', marginBottom: '4px' }}>Error Correction Level
                        <Tooltip title={
                          <>
                            Higher levels fix more damage but make the QR code bigger. Choose based on how much wear you expect
                          </>
                        }><FaRegCircleQuestion style={{ marginLeft: '5px' }} /></Tooltip></div>
                      <Select
                        value={errorLevel}
                        onChange={setErrorLevel}
                        size="small"
                        style={{ width: '100%' }}
                        options={[
                          { value: 'L', label: 'Low (~7%)' },
                          { value: 'M', label: 'Medium (~15%)' },
                          { value: 'Q', label: 'Quartile (~25%)' },
                          { value: 'H', label: 'High (~30%)' }
                        ]}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', marginBottom: '4px' }}>Logo (center image)</div>
                      <Upload
                        accept="image/*"
                        beforeUpload={handleLogoUpload}
                        showUploadList={false}
                      >
                        <Button>Upload Logo</Button>
                      </Upload>
                      {logo && (
                        <div style={{ marginTop: '4px' }}>
                          <Button onClick={() => setLogo(null)}>Remove Logo</Button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                      <Switch
                        size="small"
                        checked={autoGenerate}
                        onChange={setAutoGenerate}
                      />
                      Auto-save to history
                    </div>
                  </div>
                </div>
              </div>
            </CommonCard>
          </Col>
          <Col span={24} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }}>
            <CommonCard>
              <div className='qr-card'>
                <Space id="myqrcode" direction="vertical">
                  <Segmented options={['canvas', 'svg']} value={renderType} onChange={handleDownloadChange} block />
                  <div className='qr_scanner_container'>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <QRCode
                        type={renderType}
                        value={content}
                        errorLevel={errorLevel}
                        size={qrSize}
                        bgColor={bgColor}
                        color={fgColor}
                        style={{ marginBottom: 16 }}
                        icon={logo || undefined}
                        iconSize={logo ? qrSize / 6 : 0}
                      />
                    </div>
                    <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                      <Button
                        type="submit"
                        onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}
                      >
                        Download {renderType.toUpperCase()}
                      </Button>
                      <Tooltip title="Generate new QR code">
                        <Button
                          onClick={() => addToHistory(content)}
                        >
                          Save
                        </Button>
                      </Tooltip>
                    </Space>
                    <div style={{
                      fontSize: '11px',
                      color: '#999',
                      marginTop: '8px',
                      textAlign: 'center',
                      wordBreak: 'break-all'
                    }}>
                      QR Contains: {content.length > 30 ? `${content.substring(0, 30)}...` : content}
                    </div>
                  </div>
                </Space>
              </div>
            </CommonCard>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default QRCodeGenerator