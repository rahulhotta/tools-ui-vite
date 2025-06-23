import React, { useState } from 'react'
import { QRCode, Segmented, Space } from 'antd';
import type { QRCodeProps } from 'antd';
import CommonCard from '../../Utils/CommonElements/Card/CommonCard';
import { Col, Row, message } from 'antd';
import { Form, Input } from 'antd';
import "./QRCodeGenerator.scss";
import Button from '../../Utils/CommonElements/Button/Button';
import { Link } from 'react-router-dom';

type FieldType = {
  content?: string;
};

function QRCodeGenerator() {
  const [content, setContent] = useState('https://littletools.cc/');
  const [messageApi, contextHolder] = message.useMessage();
  const [showUrlShortener, setShowShortener] = useState(false);

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

  function handleChange(e: any) {
    if (e.target.value.length <= 2000) {
      setContent(e.target.value || 'https://littletools.cc/');
    }
    else {
      setShowShortener(true)
      messageApi.error("The content Must not exceed 1000 characters");
    }
  }


  const [renderType, setRenderType] = React.useState<QRCodeProps['type']>('canvas');
  return (
    <>
      <h1>hello</h1>
      <div className='qr_scanner'>
        {contextHolder}
        <Row gutter={24} className='qr_container'>
          <Col span={24} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }}>
            <CommonCard>
              <div className='input-card'>
                <Form
                  layout="vertical"
                  name="basic"
                  style={{ width: '100%', maxWidth: '400px' }}
                  initialValues={{ remember: true }}
                  autoComplete="off"
                >
                  <Form.Item<FieldType>
                    name="content"
                    label="Url"
                    max="2000"
                    rules={[{ required: true, message: 'Please Enter Your Content!' },
                    { max: 2000, message: 'Content must be less than 800 characters!' }
                    ]}
                  >
                    <Input placeholder="Please Enter The URL" value={content} onChange={(e) => handleChange(e)} style={{ width: "100%" }} />
                  </Form.Item>
                </Form>
                {/* {showUrlShortener && (
                <a 
                    // href={`/links/url-shortener/${encodeURIComponent(content)}`} 
                     href={`/links/url-shortener/`}
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <Button type="primary">
                        Shorten URL
                    </Button>
                </a>
            )} */}
              </div>
            </CommonCard>
          </Col>
          <Col span={24} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 12 }}>
            <CommonCard>
              <div className='qr-card'>
                <Space id="myqrcode" direction="vertical">
                  <Segmented options={['canvas', 'svg']} value={renderType} onChange={setRenderType} block />
                  <div className='qr_scanner_container'>
                    <QRCode
                      type={renderType}
                      value={content}
                      errorLevel="L"
                      size={300}
                      bgColor="#fff"
                      style={{ marginBottom: 16 }}
                    />
                    <Button
                      type="primary"
                      className="download-button"
                      onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}
                    >
                      Download
                    </Button>
                    {/* <div style={{
                      fontSize: '11px',
                      color: '#999',
                      marginTop: '8px',
                      textAlign: 'center',
                      wordBreak: 'break-all'
                    }}>
                      QR Code contains: {content.length > 50 ? `${content.substring(0, 50)}...` : content}
                    </div> */}
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