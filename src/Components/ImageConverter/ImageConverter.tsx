'use client'
import React, { useCallback, useState } from 'react';
import './imageConverter.scss';
import { Col, Row, message  } from 'antd';
import DragDropArea from './dragDropArea/dragDropArea';
import ExtensionSelector from './ExtensionSelector/extensionSelector';
import ConvertableExtensions from '../../assets/Jsons/ConvertableExtensions.json'
// import successAnimation from 'public/Animations/success.lottie'
function ImageConverter() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const allowedExtensions = ConvertableExtensions.map((extension)=>{
        return extension.value
    })

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    messageApi.error("This image type is not allowed!");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    let result: string | null = null;
    if (typeof reader.result === 'string') {
         result = reader.result;
    }
    if (typeof result === 'string') {
      setPreview(result); // base64 image string
      setImage(file);
    }
  };

  reader.readAsDataURL(file);
};

const onDrop = useCallback((acceptedFiles: File[]) => {
  acceptedFiles.forEach((file: File) => {
    const reader = new FileReader();

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      messageApi.error("This image type is not allowed!");
      return;
    }

    reader.onload = () => {
      const fileContent = reader.result;
      if (typeof fileContent === 'string') {
        console.log('File content (data URL):', fileContent);
        setPreview(fileContent); // base64 string
        setImage(file);
      }
    };

    reader.readAsDataURL(file);
  });
}, []);


    return (
        <div className='fileConverter_container'>
        {contextHolder}
            <Row className='display_flex'>
                <Col className='fileConverter_banner display_flex' span={24}>
                    {/* <div>
                        <Image src={littleToolsBanner} alt='little tools landing page banner' className='fileConverter_banner_image' />
                    </div> */}
                    <h1 className='file_converter_heading'>
                        CONVERT YOUR FILES FROM ONE FORMAT TO ANOTHER, ONLINE.
                    </h1>
                </Col>
                <Col span={16} xs={{ span: 23 }}
                    sm={{ span: 23 }}
                    md={{ span: 22 }}
                    lg={{ span: 16 }}
                    >
                    {!image ?
                        // To upload image show this
                        (
                            <DragDropArea onDrop={onDrop} handleImageChange={handleImageChange} />
                        )

                        :
                        // If you have image then show this
                        (
                            <ExtensionSelector image={image} setImage={setImage} preview={preview} />
                        )
                    }
                </Col>
            </Row>
        </div>
    )
}

export default ImageConverter