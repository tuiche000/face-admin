import { Form, Input, Modal, InputNumber, Select, DatePicker } from 'antd';

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
    device: '',
    employee: '',
    id: '',
    visitTime: '',
    visitor: '',
    times: undefined
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
      title={hasVal ? "编辑设备授权" : "创建设备授权"}
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="设备">
        {form.getFieldDecorator('device', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: detailInfo && detailInfo.device
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="员工">
        {form.getFieldDecorator('employee', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: detailInfo && detailInfo.employee
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="访客">
        {form.getFieldDecorator('visitor', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: detailInfo && detailInfo.visitor
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="生效时间">
        {form.getFieldDecorator('visitTime', {
          initialValue: detailInfo && detailInfo.visitTime,
          rules: [{ type: 'object', required: true, message: '请选择' }]
        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="过期时间">
        {form.getFieldDecorator('expiredTime', {
          initialValue: detailInfo && detailInfo.expiredTime,
          rules: [{ type: 'object', required: true, message: '请选择' }]
        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="次数">
        {form.getFieldDecorator('times', {
          initialValue: detailInfo && detailInfo.times
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
