import { useCallback, useEffect, useState } from "react";
import { Row, Input, Col, Typography, Alert, Space, Segmented, Tabs, Image } from "antd";
import CommonCard from "../../Utils/CommonElements/Card/CommonCard";
import './Base64EncoderDecoder.scss'
import Button from '../../Utils/CommonElements/Button/Button';
import { FileTextOutlined, FileImageOutlined, CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import DragDropArea from '../ImageConverter/dragDropArea/dragDropArea';
import toast, { Toaster } from 'react-hot-toast';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

function Base64EncoderDecoder() {
    const [modeType, setModeType] = useState<"text" | "image">("text");
    const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');

    const [base64Data, setBase64Data] = useState<string>("");
    const [decodedImage, setDecodedImage] = useState<string>("");
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [imageError, setImageError] = useState("");

    // Text Encode Decode Logic
    useEffect(() => {
        if (modeType !== "text" || !inputText.trim()) {
            setOutputText("");
            setErrorMessage("");
            return;
        }

        try {
            setErrorMessage('');
            if (activeTab === 'encode') {
                const encoded = btoa(unescape(encodeURIComponent(inputText)));
                setOutputText(encoded);
            } else {
                const decoded = decodeURIComponent(escape(atob(inputText)));
                setOutputText(decoded);
            }
        } catch (error) {
            setOutputText("");
            setErrorMessage("Invalid Base64 input. Unable to Decode")
        }
    }, [inputText, activeTab]
    )

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result;
            if (typeof fileContent === 'string') {
                setBase64Data(fileContent);
            }
        };
        reader.readAsDataURL(file);
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;

        const file = fileList[0];

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setBase64Data(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to Clipboard!')

        } catch (err) {
            toast.error(`Failed to copy, error: ${err}`);
        }
    };

    const downloadBase64Image = () => {
        if (!decodedImage) return;
        const a = document.createElement("a");
        a.href = decodedImage;
        a.download = "decoded-image.png";
        a.click();
    };

    // Reusable Text Layout
    const renderTextTab = (tabMode: "encode" | "decode") => (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
                <CommonCard>
                    <div className="encoded_base64_header">
                        <h2>
                            {tabMode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                        </h2>
                    </div>
                    <div className="encoded_base64_container">
                        <TextArea
                            placeholder={tabMode === 'encode' ? 'Enter text here to encode into Base64' : 'Paste Base64 encoded string here to decode'}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={8}
                            style={{ fontFamily: 'monospace' }}
                        />
                        <Paragraph
                            style={{ marginTop: 12, fontSize: 12 }}
                            className="base64_paragraph">
                            {tabMode === "encode"
                                ? "Automatically encodes UTF-8 text as you type."
                                : "Automatically decodes valid Base64 text."
                            }
                        </Paragraph>
                    </div>
                </CommonCard>
            </Col>

            <Col xs={24} lg={12}>
                <CommonCard>
                    <div className='decoded_base64_header'>
                        <h2>Output</h2>
                    </div>
                    <div className='decded_base64_container'>
                        {!inputText.trim() ? (
                            <Alert
                                message="No Input"
                                description={tabMode === "encode"
                                    ? "Please enter text to encode."
                                    : "Paste Base64 data to decode ."}
                                type="info"
                                showIcon
                            />
                        ) : errorMessage ? (
                            <Alert
                                message="Invalid Base64"
                                description={errorMessage}
                                type="error"
                                showIcon
                            />
                        ) :
                            (
                                <>
                                    <TextArea
                                        value={outputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        rows={8}
                                        readOnly
                                        style={{ fontFamily: 'monospace' }}
                                    />
                                    <Space style={{ marginTop: 12 }}>
                                        <Button
                                            onClick={() => handleCopy(outputText)}>
                                            <CopyOutlined /> Copy
                                        </Button>
                                    </Space>
                                </>
                            )}
                    </div>
                </CommonCard>
            </Col>
        </Row>
    );

    const renderImageTab = (tabMode: "encode" | "decode") => (
        <Row gutter={[24, 24]}>
            {tabMode === "encode" ? (
                <>
                    <Col xs={24} lg={12}>
                        <CommonCard>
                            <div className="encoded_base64_header">
                                <h2>Upload & Encode</h2>
                            </div>
                            <div className="encoded_base64_container">
                                <DragDropArea onDrop={onDrop} handleImageChange={handleImageChange} accept={{ "image/*": [] }} multiple={false} />
                            </div>
                        </CommonCard>
                    </Col>
                    <Col xs={24} lg={12}>
                        <CommonCard>
                            <div className="decoded_base64_header">
                                <h2>Base64 Output</h2>
                            </div>
                            <div className="encoded_base64_container">
                                {!base64Data ? (
                                    <Alert
                                        message="No Output"
                                        description="Encoded Base64 data will appear here once you upload an image."
                                        type="info"
                                        showIcon
                                    />
                                ) : imageError ? (
                                    <Alert
                                        message="Invalid Base64"
                                        description={imageError}
                                        type="error"
                                        showIcon
                                    />
                                ) : (
                                    <>
                                        <TextArea
                                            rows={8}
                                            value={base64Data}
                                            onChange={(e) => setBase64Data(e.target.value)}
                                            placeholder="Encoded Base64 data will appear here..."
                                            style={{ fontFamily: "monospace" }}
                                        />
                                        <Space style={{ marginTop: 12 }}>
                                            <Button
                                                onClick={() => handleCopy(base64Data)}>
                                                <CopyOutlined /> Copy
                                            </Button>
                                        </Space>
                                    </>
                                )}
                            </div>
                        </CommonCard>
                    </Col>
                </>
            ) : (
                <>
                    <Col xs={24} lg={12}>
                        <CommonCard>
                            <div className="encoded_base64_header">
                                <h2>Decode Base64 Image</h2>
                            </div>
                            <div className="encoded_base64_container">
                                <TextArea
                                    rows={8}
                                    value={base64Data}
                                    onChange={(e) => setBase64Data(e.target.value)}
                                    placeholder="Paste Base64 data to decode image..."
                                    style={{ fontFamily: "monospace" }}
                                />
                            </div>
                        </CommonCard>
                    </Col>

                    <Col xs={24} lg={12}>
                        <CommonCard>
                            <div className="decoded_base64_header">
                                <h2>Decoded Image</h2>
                            </div>
                            <div className="encoded_base64_container">
                                {!decodedImage ? (
                                    <Alert
                                        message="No Image"
                                        description="Paste Base64 data and click Decode to view the image."
                                        type="info"
                                        showIcon
                                    />
                                ) : (
                                    <>
                                        <img
                                            src={decodedImage}
                                            alt="Decoded Preview"
                                            className="decoded_thumbnail"
                                            onClick={() => setIsPreviewVisible(true)}
                                        />
                                        {/* Download Button */}
                                        <Space style={{ marginTop: 10 }}>
                                            <Button
                                                onClick={downloadBase64Image}>
                                                <DownloadOutlined /> Download
                                            </Button>
                                        </Space>

                                        {/* Ant Design Full Preview */}
                                        <Image
                                            src={decodedImage}
                                            preview={{
                                                visible: isPreviewVisible,
                                                onVisibleChange: (vis) => setIsPreviewVisible(vis),
                                            }}
                                            style={{ display: "none" }}
                                        />
                                    </>
                                )}
                            </div>
                        </CommonCard>
                    </Col>
                </>
            )}
        </Row>
    )

    useEffect(() => {
        if (!base64Data) {
            setDecodedImage(null);
            setImageError("");
            return;
        }

        try {
            setImageError("");
            let imgSrc = base64Data.trim();
            const isFullDataUrl = imgSrc.startsWith("data:image");

            if (!isFullDataUrl) {
                imgSrc = `data:image/png;base64,${imgSrc}`;
            }

            atob(imgSrc.split(",")[1]);

            setDecodedImage(imgSrc);
        }
        catch (err) {
            setDecodedImage(null);
            setImageError("Invalid Base64 image data. Unable to render preview.")
        }
    })

    return (
        <div className="page-style">
            <Toaster />
            <div className="page-container">
                <Title level={2} className="base64_page_title">
                    Base64 Encoder / Decoder
                </Title>

                {/* Toggle between Text & Image mode*/}
                <div className="base64_info_toggle_row">
                    <Segmented
                        value={modeType}
                        onChange={(value) => {
                            setModeType(value as "text" | "image");
                            setInputText("");
                            setOutputText("");
                            setBase64Data("");
                            setDecodedImage("");
                        }}
                        options={[
                            {
                                label: "Text",
                                value: "text",
                                icon: <FileTextOutlined />,
                            },
                            {
                                label: "Image",
                                value: "image",
                                icon: <FileImageOutlined />,
                            },
                        ]}
                    />
                </div>

                {/* Tabs for Encode & Decode */}
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key as "encode" | "decode");
                        setInputText("");
                        setOutputText("");
                        setBase64Data("");
                        setDecodedImage("");
                    }} centered>
                    <TabPane tab="Encode" key="encode">
                        {modeType === "text" ? renderTextTab("encode") : renderImageTab("encode")}
                    </TabPane>

                    <TabPane tab="Decode" key="decode">
                        {modeType === "text" ? renderTextTab("decode") : renderImageTab("decode")}
                    </TabPane>
                </Tabs>

                {/* Information Section */}
                <div style={{ marginTop: '20px' }}>
                    <CommonCard>
                        <div className="about_base64_header">
                            <h2 >
                                About Base64
                            </h2>
                        </div>
                        <div className="about_base64_container">
                            <Paragraph className="about_base64_para">
                                Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
                                It’s commonly used to encode data for transmission over text-based protocols such as email and HTTP.
                            </Paragraph>
                            <ul>
                                <li>
                                    <Text strong style={{ color: '#1890ff' }}>Encoding:</Text> Converts plain text or binary data into a Base64-encoded string.
                                </li>
                                <li>
                                    <Text strong style={{ color: '#52c41a' }}>Decoding:</Text> Converts Base64 data back to its original form.
                                </li>
                                <li>
                                    <Text strong style={{ color: '#fa8c16' }}>Usage:</Text> Commonly used for embedding images, tokens, or data within JSON or HTML.
                                </li>
                            </ul>
                        </div>
                    </CommonCard>
                </div>
            </div>
        </div>
    );
}

export default Base64EncoderDecoder