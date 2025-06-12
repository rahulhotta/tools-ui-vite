import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd';
import './extensionSelector.scss'
import Button from '../../../Utils/CommonElements/Button/Button';
import { Select } from 'antd';
import {  Form } from 'antd';
import CommonCard from '../../../Utils/CommonElements/Card/CommonCard';
import ConvertableExtensions from '../../../assets/Jsons/ConvertableExtensions.json'
interface ExtensionSelectorProps {
    image: File | null;
    preview: string | null;
    setImage: (img: File | null) => void
}
const ExtensionSelector: React.FC<ExtensionSelectorProps> = ({ image, setImage, preview }) => {

    const convertableExtensions = ConvertableExtensions

    const [fileSizeInMB, setFileSizeInMB] = useState('0');
    const [selectedExtension, setSelectedExtension] = useState(null)

    const convertToExtension = () => {
        try{
            if (!image) return;
    
            const img: HTMLImageElement = document.createElement('img');
            if (preview) {
                img.src = preview;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d")!;
                    ctx.drawImage(img, 0, 0);
    
                    const pngUrl = canvas.toDataURL(`image/${selectedExtension}`);
                    const link = document.createElement("a");
                    link.href = pngUrl;
                    const fileNameWithoutExtension = image?.name?.split('.').slice(0, -1).join('.');
                    link.download = `${fileNameWithoutExtension}_converted.${selectedExtension}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
            }
        }catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        if(image){
            const sizeInMB = (image.size / (1024 * 1024)).toFixed(2);
            setFileSizeInMB(sizeInMB)
        }
    }, []);

    const truncateMiddle = (text: string, maxLength = 40) => {
        if (text.length <= maxLength) return text;

        const sideLength = Math.floor((maxLength - 10) / 2);
        return `${text.substring(0, sideLength)}...${text.substring(text.length - sideLength)}`;
    };

    return (
        <div>
            <Form onFinish={convertToExtension} name="basic">
                <CommonCard>
                    <Row className='extension_selector_div'>

                        <Col span={8} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 8 }} data-testid="column-antd">
                            <div className='extension_selector_image_name'>
                                {image && truncateMiddle(image?.name)}
                            </div>
                            <div className='extension_selector_image_size'>
                                {fileSizeInMB} MB
                            </div>
                        </Col>

                        <Col span={8} xs={{ span: 24 }} sm={{ span: 20 }} md={{ span: 20 }} lg={{ span: 8 }}className='extension_selector_file_convert_select_container'>
                            <div>
                                Convert To:
                            </div>
                            <Form.Item
                                //   label="Username"
                                name="username"
                                style={{ width: '100%' }}
                                rules={[{ required: true, message: 'Please input your username!' }]}  >
                                <Select
                                    showSearch
                                    placeholder="Select a Type"
                                    optionFilterProp="label"
                                    style={{ width: '90%' }}
                                    className='extension_selector_SelectMenu'
                                    options={convertableExtensions}
                                    onChange={(value) => { setSelectedExtension(value) }}

                                />
                            </Form.Item>
                        </Col>


                        <Col span={8} xs={{ span: 24 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 8 }}className='extension_selector_file_convert_button_container'>
                            <Button type="submit">Convert</Button>
                        </Col>
                    </Row>
                </CommonCard>
                <Row className='extension_selector_new_convert_button_container'>
                    <Button onClick={() => { setImage(null) }}>Convert New File</Button>
                </Row>
            </Form>
        </div>
    )
}

export default ExtensionSelector
