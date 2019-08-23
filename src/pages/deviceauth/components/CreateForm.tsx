import { Form, Input, Modal, InputNumber, Select, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { detail, device, employee, visitor } from '../service'
import moment from 'moment';

const FormItem = Form.Item;
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

  const [devices, setDevices] = useState()
  const [employees, setemployees] = useState()
  const [visitors, setVisitors] = useState()
  const [detailInfo, setDetailInfo] = useState({
    device: '',
    employee: '',
    id: '',
    visitTime: '',
    expiredTime: '',
    visitor: '',
    times: undefined
  });

  useEffect(() => {
    device().then((res) => {
      if (res.code == "0") {
        setDevices(res.data && res.data.result)
      }
    })
    employee().then(res => {
      if (res.code == "0") {
        setemployees(res.data && res.data.result)
      }
    })
    visitor().then(res => {
      if (res.code == "0") {
        setVisitors(res.data && res.data.result)
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
      fieldsValue.visitTime = moment(fieldsValue.visitTime).format('YYYY-MM-DD HH:mm:ss')
      fieldsValue.expiredTime = moment(fieldsValue.expiredTime).format('YYYY-MM-DD HH:mm:ss')
      form.resetFields();
      if (hasVal) { //修改的
        fieldsValue.id = detailInfo.id
        fieldsValue.device = undefined
        fieldsValue.employee = undefined
        fieldsValue.visitor = undefined
        handleUpdate && handleUpdate(fieldsValue)
        return
      }
      handleAdd && handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={hasVal ? "编辑设备授权" : "创建设备授权"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
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
          disabled={detailInfo.device ? true : false}
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={(e) => {
            console.log(e)
          }}
        >
          {
            devices && devices.map((item: any): JSX.Element => {
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
          disabled={detailInfo.device ? true : false}
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={(e) => {
            console.log(e)
          }}
        >
          {
            employees && employees.map((item: any): JSX.Element => {
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
          disabled={detailInfo.device ? true : false}
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={(e) => {
            console.log(e)
          }}
        >
          {
            visitors && visitors.map((item: any): JSX.Element => {
              return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )
            })
          }
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="生效时间">
        {form.getFieldDecorator('visitTime', {
          initialValue: detailInfo.visitTime ? moment(detailInfo.visitTime) : null,
          rules: [{ type: 'object', required: true, message: '请选择' }]
        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="过期时间">
        {form.getFieldDecorator('expiredTime', {
          initialValue: detailInfo.expiredTime ? moment(detailInfo.expiredTime) : null,
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
