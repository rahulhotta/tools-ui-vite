import  { useState, useEffect } from 'react';
import {  Input, Typography, Row, Col, Alert } from 'antd';
import CommonCard from '../../Utils/CommonElements/Card/CommonCard'
import './JwtDecoder.scss'
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface JWTHeader {
    alg: string; // Algorithm used for signing
    typ: string; // Type of token, usually "JWT"
}
 
interface JWTPayload {
    sub?: string;
    name?: string;
    iat?: number;
    exp?: number;
    [key: string]: string | number | undefined;
}
 
 
interface JWTState {
    header?: JWTHeader | null;
    payload?: JWTPayload | null;
    signature?: null | string;
    error?: null | string;
    isPayloadOnly?: boolean;
    doubleEncoded?: boolean;
    originalData?: null;
}

const JWTDecoder = () => {
  const [encodedJWT, setEncodedJWT] = useState('');
  const [decodedJWT, setDecodedJWT] = useState<JWTState>({
    header: null,
    payload: null,
    signature: null,
    error: null,
    isPayloadOnly: false,
    doubleEncoded: false,
    originalData: null
  });

  const decodeJWT = (token) => {
    try {
      if (!token.trim()) {
        return {
          header: null,
          payload: null,
          signature: null,
          error: null,
          isPayloadOnly: false
        };
      }

      const parts = token.split('.');
      
      // Check if it's a full JWT (3 parts)
      if (parts.length === 3) {
        // Decode header
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        
        // Decode payload
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        // Signature (keep encoded)
        const signature = parts[2];

        return {
          header,
          payload,
          signature,
          error: null,
          isPayloadOnly: false
        };
      }
      // Check if it's just a payload (single part, no dots)
      else if (parts.length === 1 && token.trim().indexOf('.') === -1) {
        // Try to decode as payload only
        const payload = JSON.parse(atob(token.trim().replace(/-/g, '+').replace(/_/g, '/')));
        
        return {
          header: null,
          payload,
          signature: null,
          error: null,
          isPayloadOnly: true
        };
      }
      // Invalid format
      else {
        return {
          header: null,
          payload: null,
          signature: null,
          error: 'Invalid format. Please provide either a complete JWT (3 parts separated by dots) or just the payload part.',
          isPayloadOnly: false
        };
      }
    } catch (error) {
      if(error){
        return {
          header: null,
          payload: null,
          signature: null,
          error: 'Invalid token or payload. Please check your input - it should be valid Base64URL encoded data.',
          isPayloadOnly: false
        };
      }
    }
  };

  useEffect(() => {
    const decoded = decodeJWT(encodedJWT);
    setDecodedJWT(decoded);
  }, [encodedJWT]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return 'Invalid timestamp';
    }
  };

  const renderJSONSection = (title, data, color) => {
    if (!data) return null;
    
    return (
      <div style={{ marginBottom: '16px' }}>
        <Title level={5} style={{ color, marginBottom: '8px' }}>
          {title}
        </Title>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '12px', 
          borderRadius: '6px',
          fontSize: '12px',
          overflow: 'auto',
          border: `1px solid ${color}20`
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  const renderPayloadDetails = (payload) => {
    if (!payload) return null;

    const commonClaims = {
      iss: 'Issuer',
      sub: 'Subject',
      aud: 'Audience',
      exp: 'Expiration Time',
      nbf: 'Not Before',
      iat: 'Issued At',
      jti: 'JWT ID'
    };

    return (
      <div style={{ marginTop: '16px' }}>
        <Title level={5} style={{ color: '#52c41a' }}>
          Payload Claims
        </Title>
        {Object.entries(payload).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <Text strong>{commonClaims[key] || key}: </Text>
            <Text>
              {key === 'exp' || key === 'nbf' || key === 'iat' 
                ? `${value} (${formatTimestamp(value)})`
                : typeof value === 'object' 
                  ? JSON.stringify(value)
                  : String(value)
              }
            </Text>
          </div>
        ))}
      </div>
    );
  };
  return (

    <div className='page-style'>
      <div className='page-container'>
        <Title level={2} className='jwt_page_title'>
          JWT Decoder
        </Title>
        
        <Row gutter={[24, 24]}>
          {/* Encoded JWT Input Card */}
          <Col xs={24} lg={12}>
             <CommonCard> 
            {/* <Card 
              title={decodedJWT.isPayloadOnly ? "Encoded JWT Payload" : "Encoded JWT"}
              style={{ height: '100%' }}
              headStyle={{ backgroundColor: '#1890ff', color: 'white' }}
            > */}
              <div className='encoded_jwt_header'>
                <h2 >
                  Encoded JWT
                </h2>
              </div>
            <div className='encoded_jwt_container'>
              <TextArea
                placeholder="Paste your JWT token, payload, or double-encoded data here..."
                value={encodedJWT}
                onChange={(e) => setEncodedJWT(e.target.value)}
                rows={8}
                style={{ fontFamily: 'monospace' }}
              />
              <Paragraph style={{ marginTop: '12px', fontSize: '12px'}} className='jwt_paragraph'>
                Supports multiple formats:
                <br />• Complete JWT token (header.payload.signature)
                <br />• Just the payload part (Base64URL encoded JSON)
                <br />• Double-encoded data (Base64 containing JWT or payload)
                <br />• API responses with JWT in data/token fields
              </Paragraph>
            </div>
            {/* </Card> */}
            </CommonCard>
          </Col>

          {/* Decoded JWT Output Card */}
          <Col xs={24} lg={12}>
          <CommonCard>

            <div className='decoded_jwt_header'>
                <h2 >
                  Decoded JWT
                </h2>
              </div>
            <div className='decded_jwt_container'>

              {decodedJWT.error ? (
                <Alert 
                  message="Decoding Error" 
                  description={decodedJWT.error}
                  type="error" 
                  showIcon 
                />
              ) : !encodedJWT.trim() ? (
                <Alert 
                  message="No Input" 
                  description="Please paste a JWT token or payload in the left panel to see the decoded result."
                  type="info" 
                  showIcon 
                />
              ) : decodedJWT.isPayloadOnly ? (
                <div>
                  <Alert 
                    message={decodedJWT.doubleEncoded ? "Double-Encoded Payload Detected" : "Payload Only Mode"}
                    description={decodedJWT.doubleEncoded ? 
                      "Detected and decoded a double-encoded payload. Here's the decoded content:" :
                      "You've provided just the payload part. Here's the decoded content:"
                    }
                    type="info" 
                    showIcon 
                    style={{ marginBottom: '16px' }}
                  />
                  {decodedJWT.doubleEncoded && decodedJWT.originalData && (
                    <div style={{ marginBottom: '16px' }}>
                      {renderJSONSection('Original Container Data', decodedJWT.originalData, '#722ed1')}
                    </div>
                  )}
                  {renderJSONSection('Decoded Payload', decodedJWT.payload, '#52c41a')}
                  {decodedJWT.payload && renderPayloadDetails(decodedJWT.payload)}
                </div>
              ) : (
                <div>
                  {decodedJWT.doubleEncoded && (
                    <Alert 
                      message="Double-Encoded JWT Detected" 
                      description="Detected and automatically extracted JWT from double-encoded data."
                      type="success" 
                      showIcon 
                      style={{ marginBottom: '16px' }}
                    />
                  )}
                  
                  {decodedJWT.doubleEncoded && decodedJWT.originalData && (
                    <div style={{ marginBottom: '16px' }}>
                      {renderJSONSection('Original Container Data', decodedJWT.originalData, '#722ed1')}
                    </div>
                  )}
                  
                  {renderJSONSection('Header', decodedJWT.header, '#1890ff')}
                  {renderJSONSection('Payload', decodedJWT.payload, '#52c41a')}
                  
                  {decodedJWT.payload && renderPayloadDetails(decodedJWT.payload)}
                  
                  {decodedJWT.signature && (
                    <div style={{ marginTop: '16px' }}>
                      <Title level={5} style={{ color: '#fa8c16' }}>
                        Signature
                      </Title>
                      <Text code style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                        {decodedJWT.signature}
                      </Text>
                      <Paragraph style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                        The signature is used to verify the token's authenticity and cannot be decoded without the secret key.
                      </Paragraph>
                    </div>
                  )}
                </div>
              )}
            </div>
            </CommonCard>
          </Col>
        </Row>

        {/* Information Section */}
        <div style={{marginTop: '20px'}}>

          <CommonCard >
          {/* <Card style={{ marginTop: '24px' }} title="About JWT"> */}
          <div className="about_jwt_header">
            <h2 >
              About JWT
            </h2>
          </div>
          <div className='about_jwt_container'>
            <Paragraph className='about_jwt_para'>
              JSON Web Tokens (JWT) are an open standard (RFC 7519) that defines a compact and self-contained way 
              for securely transmitting information between parties as a JSON object. A JWT consists of three parts:
            </Paragraph>
            <ul>
              <li><Text strong style={{ color: '#1890ff' }}>Header:</Text> Contains metadata about the token, typically the signing algorithm and token type.</li>
              <li><Text strong style={{ color: '#52c41a' }}>Payload:</Text> Contains the claims (statements about an entity and additional data).</li>
              <li><Text strong style={{ color: '#fa8c16' }}>Signature:</Text> Used to verify the sender and ensure the message wasn't changed along the way.</li>
            </ul>
          </div>
          {/* </Card> */}
          </CommonCard>
        </div>
      </div>
    </div>

  );
};

export default JWTDecoder;