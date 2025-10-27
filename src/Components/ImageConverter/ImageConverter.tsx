'use client'
import React, { useCallback, useState } from 'react';
import './imageConverter.scss';
import { Col, Row, message } from 'antd';
import DragDropArea from './dragDropArea/dragDropArea';
import ExtensionSelector from './ExtensionSelector/extensionSelector';
import ConvertableExtensions from '../../assets/Jsons/ConvertableExtensions.json'



function ImageConverter() {
  const [image, setImage] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const allowedExtensions = ConvertableExtensions.map((extension) => {
    return extension.value
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (!file) return;
    const uploadedFiles: File[] = [...file];
    uploadedFiles.forEach(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        messageApi.error(`The file "${file.name}" is not supported! Allowed types: ${allowedExtensions.join(', ')}.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        let result: string | null = null;
        if (typeof reader.result === 'string') {
          result = reader.result;
        }
        if (typeof result === 'string') {
          setPreview(prevPreviews => [...prevPreviews, result]);
          setImage(prevImages => [...prevImages, file]);
        }
        };
        
        reader.readAsDataURL(file);
        });
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
          setPreview(prevPreviews => [...prevPreviews, fileContent]);
          setImage(prevImages => [...prevImages, file]);
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
          <h1 className='file_converter_heading'>
            CONVERT YOUR FILES FROM ONE FORMAT TO ANOTHER, ONLINE.
          </h1>
        </Col>
        <Col span={16} xs={{ span: 23 }}
          sm={{ span: 23 }}
          md={{ span: 22 }}
          lg={{ span: 16 }}
        >
          {image.length === 0 ? (
            // To upload image show this
            (
              <DragDropArea onDrop={onDrop} handleImageChange={handleImageChange} />
            )

          ) : (
            // If you have image then show this
            (
              <ExtensionSelector image={image} setImage={setImage} preview={preview} setPreview={setPreview} />
            )
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ImageConverter