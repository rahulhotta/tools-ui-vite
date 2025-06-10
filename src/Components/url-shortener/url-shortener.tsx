'use client'
import {useRef, useState} from 'react'
import type { FormProps } from 'antd';
import { Space, Form, Input, Radio, Tooltip } from 'antd';
import type { InputRef } from 'antd';
import './url-shortener.scss';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import Button from '../../Utils/CommonElements/Button/Button';
import CommonCard from '../../Utils/CommonElements/Card/CommonCard';
import { MdContentCopy } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import {ServiceUtils} from '../../Utils/Services/httpLayer'
import { Alert } from 'antd';
const UrlShortener = () => {
  const [shortenedURL, setShortenedURL] = useState('');
  const shortenURL = (inputJson:FieldType) => {
    try{
      const payload = {
        "main_url": inputJson['URL'],
        "expire_in_days": inputJson['expiry_date']
      }
      interface submit_url_Response {
        status: string;
        message: string;
        short_url?: string;
      }
      ServiceUtils.postRequest("/s/submit_url",payload,true).then((response:submit_url_Response) => {
        if (response && response?.status === 'success' && response !== null) {
          toast.success(response.message)
          setShortenedURL(response?.short_url || '')
        }else{
          toast.error(response?.message ? response.message : 'Something went wrong!')
        }
      })
    }catch(error){
      console.log(error)
    }
  }
  const inputRef = useRef<InputRef>(null);
  const handleCopy = async () => {
    const inputValue = inputRef.current?.input?.value;

    if (!inputValue) {
      toast.error('Please Generate a URL first!');
      return;
    }

    try {
      await navigator.clipboard.writeText(inputValue);
      toast.success('Copied to Clipboard!')

    } catch (err) {
      toast.error(`Failed to copy, error: ${err}` );
    }
  };
  type FieldType = {
    URL?: string;
    expiry_date?: number;
  };
  const options: CheckboxGroupProps<number>['options'] = [
    { label: '1 Day', value: 1 },
    { label: '3 Days', value: 3},
    { label: '7 Days', value: 7 },
  ];
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log("values: ", values);
    shortenURL(values);
  }
  return (
    <div className='url_shortener_page_container'>
      <Toaster />
      <div className='url_shortener_header'>
        <h1>
          Make your URLs really short, ONLINE.
        </h1>
      </div>
      <div className='url_shortener_form_container'>
        <CommonCard>
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 1000 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            className='url_shortener_form'
          >
            <Form.Item<FieldType>
              label="Enter URL"
              name="URL"
              rules={[{ required: true, message: 'Please Enter your URL!' }]}
            >
              <Input placeholder='Enter your URL' className='form_input custom_input' />
            </Form.Item>

            <Form.Item<FieldType>
              label="Expires In"
              name="expiry_date"
              rules={[{ required: true, message: 'Please Enter Expiry Time!' }]}
            >
              <Radio.Group
                block
                options={options}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>

            <Form.Item label={null}>
              <Button width={'100%'}>
                Generate
              </Button>
            </Form.Item>
          </Form>
        </CommonCard>
      </div>
      <div className='url_shortener_form_container'>
        <CommonCard>
          <div className='copy_container'>
            <Space.Compact style={{ width: '100%' }}>
              <Input className='copy_input custom_input' placeholder='Copy URL' disabled  value={shortenedURL} ref={inputRef}/>

              <Tooltip placement="top" title={'Copy'}>
                <Button onClick={handleCopy} > <MdContentCopy style={{ fontSize: "1rem" }} /></Button>
              </Tooltip>
            </Space.Compact>
          </div>
             {shortenedURL && <Alert message="Copy the generated url before leaving or you will lose it!" banner />} 
        </CommonCard>
      </div>
    </div>
  )
}

export default UrlShortener