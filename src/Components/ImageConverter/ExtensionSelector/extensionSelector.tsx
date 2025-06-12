import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd';
import './extensionSelector.scss'
import Button from '../../../Utils/CommonElements/Button/Button';
import { Select } from 'antd';
import { Form } from 'antd';
import CommonCard from '../../../Utils/CommonElements/Card/CommonCard';
import ConvertableExtensions from '../../../assets/Jsons/ConvertableExtensions.json'
interface ExtensionSelectorProps {
    image: File[];
    preview: string[];
    setImage: (imgs: File[]) => void;
}
const ExtensionSelector: React.FC<ExtensionSelectorProps> = ({ image, setImage, preview }) => {

    const convertableExtensions = ConvertableExtensions

    const [fileSizeInMB, setFileSizeInMB] = useState<string[]>([]);
    const [selectedExtension, setSelectedExtension] = useState(null);

    const convertToExtension = () => {
        try {
            if (!image) return;
            if (!preview || preview.length === 0) return;
            preview.forEach((imgSrc, index) => {
                const img: HTMLImageElement = document.createElement('img');

                if (preview) {
                    img.src = imgSrc;
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d")!;
                        ctx.drawImage(img, 0, 0);

                        const pngUrl = canvas.toDataURL(`image/${selectedExtension}`);
                        const link = document.createElement("a");
                        link.href = pngUrl;
                        const originalFileName = image[index]?.name?.split('.').slice(0, -1).join('.');
                        link.download = `${originalFileName}_converted.${selectedExtension}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    };
                }
            });
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (image && image.length > 0) {
            const sizesInMB = image.map(img => (img.size / (1024 * 1024)).toFixed(2));
            setFileSizeInMB(sizesInMB);
        }
    }, [image]);

    const truncateMiddle = (text: string, maxLength = 40) => {
        if (text.length <= maxLength) return text;

        const sideLength = Math.floor((maxLength - 10) / 2);
        return `${text.substring(0, sideLength)}...${text.substring(text.length - sideLength)}`;
    };

    return (
        <div>
            <Form onFinish={convertToExtension} name="basic">
                <Row>
                    <Col span={8} xs={{ span: 12 }} sm={{ span: 8 }} md={{ span: 8 }} lg={{ span: 8 }} className='extension_selector_file_convert_select_container'>
                        <Form.Item
                            //   label="Username"
                            name="username"
                            style={{ width: '100%' }}
                            rules={[{ required: true, message: 'Please input your file format!' }]}  >
                            <Select
                                showSearch
                                placeholder="Select a Type"
                                optionFilterProp="label"
                                style={{ width: '90%', height: "3rem" }}
                                className='extension_selector_SelectMenu'
                                options={convertableExtensions}
                                onChange={(value) => { setSelectedExtension(value) }}

                            />
                        </Form.Item>
                    </Col>

                    <Col span={8} xs={{ span: 12 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 8 }}>
                        <Button type="submit">Convert</Button>
                    </Col>
                    <Col span={8} xs={{ span: 12 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 8 }} className='convert_new_button_container'>
                        <Button onClick={() => { setImage([]) }}>Convert New File</Button>
                    </Col>
                </Row>
                {image.map((image, index) => (
                    <CommonCard key={index}>
                        <Row className='extension_selector_div' justify="start">

                            <Col span={18} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 8 }} data-testid={`column-antd-${index}`}>
                                <div className='extension_selector_image_name'>
                                    {image && truncateMiddle(image?.name)}
                                </div>
                                <div className='extension_selector_image_size'>
                                    {fileSizeInMB[index]} MB
                                </div>
                            </Col>
                        </Row>
                    </CommonCard>
                ))}
                {/* <Row className='extension_selector_new_convert_button_container'>
                    <Button onClick={() => { setImage([]) }}>Convert New File</Button>
                </Row> */}
            </Form>
        </div>
    )
}

export default ExtensionSelector
