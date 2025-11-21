import './dragDropArea.scss';
import { Col, Row } from 'antd';
import { useDropzone } from 'react-dropzone';
import Button from '../../../Utils/CommonElements/Button/Button';
import CommonCard from '../../../Utils/CommonElements/Card/CommonCard';

interface DragAndDropProps {
    onDrop: (acceptedFiles: File[]) => void;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: Record<string, string[]>;
    multiple?: boolean;
}
const  DragDropArea: React.FC<DragAndDropProps> = ({ handleImageChange, onDrop, accept, multiple }) =>{
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: accept || undefined,  multiple: multiple ?? true  });
    return (
        <div className='dropzone_container'>
            <CommonCard >
                <Row {...getRootProps()} className={`dropzone file_converter_file_input_container ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} onChange={handleImageChange} />
                    <Col span={24} className='file_converter_col'>
                        <Button> + Add File</Button>
                    </Col>
                    {isDragActive ?
                        (
                            <Col span={24} className='file_converter_col'>
                                Drop Your File Here.
                            </Col>
                        ) :
                        (
                            <>
                                <Col span={24} className='file_converter_col'>
                                    OR
                                </Col>
                                <Col span={24} className='file_converter_col'>
                                    Drag and drop your file HERE.
                                </Col>
                            </>
                        )
                    }
                </Row>
            </CommonCard>
        </div>
    )
}

export default DragDropArea