import { Form, Input, Modal, InputNumber, Select, Upload, Button, Icon, Radio } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { query } from '@/pages/business/floor/service'
import { detail } from '@/pages/business/device/service'

const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  hasVal: boolean; // true=>编辑 false=>新增
  values?: Partial<TableListItem>;
  handleAdd?: (fieldsValue: TableListItem) => void;
  handleModalVisible?: () => void;
  handleUpdate?: (fieldsValue: TableListItem) => void;
  handleUpdateModalVisible?: (flag?: boolean, record?: TableListItem) => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, handleUpdate, handleUpdateModalVisible, values, hasVal } = props;

  const [floors, setFloors] = useState()
  const [detailInfo, setDetailInfo] = useState({
    avatar: '',
    displayOrder: 0,
    floor: '',
    floorId: '',
    floorName: '',
    id: '',
    name: '',
    remark: '',
    host: '',
  });
  const [fileList, setFileList] = useState()

  useEffect(() => {
    query({
      pageNo: 1,
      pageSize: 9999
    }).then(res => {
      if (res.code == "0") {
        setFloors(res.data && res.data.result)
      }
    })
    if (hasVal) { // 修改加载数据
      let id = values && values.id
      let detailId = id ? id : ''
      detail(detailId).then((res: {
        code: string;
        data: TableListItem
      }) => {
        if (res.code == "0") {
          setDetailInfo(res.data)
        }
      })
    }
  }, [])

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      fieldsValue.avatar = (fileList && fileList.length) ? fileList[0].url : undefined
      form.resetFields();
      setFileList([])
      if (hasVal) { //修改的
        fieldsValue.id = detailInfo.id
        console.log('修改')
        handleUpdate && handleUpdate(fieldsValue)
        return
      }
      handleAdd && handleAdd(fieldsValue);
    });
  };

  const handleChange = (info: {
    file: any,
    fileList: any[]
  }) => {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data.resource;
      }
      return file;
    });
    setFileList(fileList)
  }

  if (hasVal && !fileList) {
    setFileList([
      {
        uid: values && values.id,
        name: values && values.name,
        status: 'done',
        url: values && values.avatar,
      }
    ])
  }

  return (
    <Modal
      destroyOnClose
      title={hasVal ? "创建员工" : "编辑员工"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        setFileList([])
        if (hasVal) {
          handleUpdateModalVisible && handleUpdateModalVisible(false, detailInfo)
        } else {
          handleModalVisible && handleModalVisible()
        }
      }}
      afterClose={() => handleUpdateModalVisible && handleUpdateModalVisible(false)}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名字">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: detailInfo && detailInfo.name
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">
        {form.getFieldDecorator('phone', {
          rules: [{ required: true, message: '请输入正确的号码', pattern: /^1[3456789][0-9]{9}$/ }],
          initialValue: detailInfo && detailInfo.phone
        })(<Input type="number" maxLength={11} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="员工编号">
        {form.getFieldDecorator('empcode', {
          // rules: [{ required: true, message: '请输入' }],
          initialValue: detailInfo && detailInfo.empcode
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator('gender', {
          // rules: [{ required: true, message: '请选择' }],
          initialValue: (detailInfo && detailInfo.floor) || 'MALE'
        })(<Radio.Group>
          <Radio value='MALE'>男</Radio>
          <Radio value='FEMALE'>女</Radio>
        </Radio.Group>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门">
        {form.getFieldDecorator('department', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: detailInfo && detailInfo.department
        })(<Select
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={(e) => {
            console.log(e)
          }}
        >
          {
            floors && floors.map((item: any): JSX.Element => {
              return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )
            })
          }
        </Select>)}
      </FormItem>
      {/* <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备照片" extra="上传设备照片">
        {form.getFieldDecorator('upload', {
          // valuePropName: 'fileList',
          // getValueFromEvent: this.normFile,
        })(
          <Upload
            name="uploadFile"
            headers={{
              Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`
            }}
            onChange={handleChange}
            action={process.env.config.API_HOST + '/api/oss/device/image'}
            fileList={fileList}
            listType="picture">
            <Button>
              <Icon type="upload" /> 点击上传
              </Button>
          </Upload>,
        )}
      </Form.Item>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          // rules: [{ required: true, message: '请输入' }],
          initialValue: detailInfo && detailInfo.remark
        })(<TextArea autosize={
          { minRows: 2, maxRows: 6 }
        } placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
        {form.getFieldDecorator('displayOrder', {
          initialValue: detailInfo && detailInfo.displayOrder
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem> */}
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
