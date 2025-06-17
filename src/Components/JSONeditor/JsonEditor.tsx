import './JsonEditor.scss';
import { useState } from 'react'
import { Layout, Row, Col, message } from 'antd'
import JsonContainer from './JsonContainer/JsonContainer'

const {  Content } = Layout

const defaultJson1 = {
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "address": {
            "street": "123 Main St",
            "city": "New York",
            "zipCode": "10001"
        },
        "hobbies": ["reading", "gaming", "cooking"]
    },
    "settings": {
        "theme": "dark",
        "notifications": true
    }
}

const defaultJson2 = {
    "user": {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "address": {
            "street": "456 Oak Ave",
            "city": "Los Angeles",
            "zipCode": "90210"
        },
        "hobbies": ["reading", "traveling", "photography"]
    },
    "settings": {
        "theme": "light",
        "notifications": false,
        "language": "en"
    }
}
const JsonEditor = () => {
    const [json1, setJson1] = useState(JSON.stringify(defaultJson1, null, 2))
    const [json2, setJson2] = useState(JSON.stringify(defaultJson2, null, 2));

    // const handleSwap = () => {
    //     const temp = json1;
    //     setJson1(json2)
    //     setJson2(temp)
    //     message.success('JSON data swapped successfully!')
    // }

    const handleClear = (jsonNumber: string) => {
        if (jsonNumber === 'container1') {
            setJson1('{}')
            message.success('JSON cleared!')
        } else {
            setJson2('{}')
            message.success('JSON cleared!')
        }
    }
    return (
        <div>
            <Layout className="app-layout">
                <Content className="app-content">
                    <Row gutter={[16, 16]} className="json-row">
                        <Col xs={24} lg={12}>
                            <JsonContainer
                                title="JSON Document 1"
                                value={json1}
                                onChange={setJson1}
                                containerKey="container1"
                                handleClear={handleClear}
                            />
                        </Col>
                        <Col xs={24} lg={12}>
                            <JsonContainer
                                title="JSON Document 2"
                                value={json2}
                                onChange={setJson2}
                                containerKey="container2"
                                handleClear={handleClear}
                            />
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    )
}

export default JsonEditor