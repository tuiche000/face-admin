import { Form, Input, Modal, Switch, Select, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { detail, employee, visitor, type } from '../service'
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  hasVal: boolean; // true=>编辑 false=>新增
  values?: Partial<TableListItem>;
  handleAdd?: (fieldsValue: TableListItem) => void;
  handleModalVisible?: () => void;
  handleUpdate?: (fieldsValue: Partial<TableListItem>) => void;
  handleUpdateModalVisible?: (flag?: boolean, record?: TableListItem) => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, handleUpdate, handleUpdateModalVisible, values, hasVal } = props;

  const [employees, setemployees] = useState()
  const [visitors, setVisitors] = useState()
  const [types, setTypes] = useState()
  const [detailInfo, setDetailInfo] = useState({
    id: '',
    noticeType: '',
    title: '',
    content: '',
    employee: '',
    visitor: '',
    published: '',
    readtime: '',
    readed: undefined,
  });

  useEffect(() => {
    employee().then(res => {
      if (res && res.code == "0") {
        setemployees(res.data && res.data.result)
      }
    })
    visitor().then(res => {
      if (res && res.code == "0") {
        setVisitors(res.data && res.data.result)
      }
    })
    type().then(res => {
      if (res && res.code == "0") {
        setTypes(res && res.data)
      }
    })

    if (hasVal) { // 修改加载数据
      let id = values && values.id
      let detailId = id ? id : ''
      detail(detailId).then((res: {
        code: string;
        data: TableListItem
      }) => {
        if (res && res.code == "0") {
          setDetailInfo(res.data)
        }
      })
    }
  }, [])

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (hasVal) { //修改的
        let fields = {
          id: detailInfo.id,
          readed: fieldsValue.readed,
          readtime: moment(fieldsValue.readtime).format('YYYY-MM-DD HH:mm:ss'),
        }
        handleUpdate && handleUpdate(fields)
        return
      }
      handleAdd && handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={hasVal ? "编辑消息" : "创建消息"}
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="消息类型">
        {form.getFieldDecorator('noticeType', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: detailInfo && detailInfo.noticeType
        })(<Select
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={(e) => {
            console.log(e)
          }}
        >
          {
            types && types.map((item: any): JSX.Element => {
              return (
                <Option key={item.code} value={item.code}>{item.name}</Option>
              )
            })
          }
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: detailInfo && detailInfo.title
        })(<Input disabled={detailInfo.title ? true : false} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: detailInfo && detailInfo.content
        })(<TextArea disabled={detailInfo.title ? true : false} autosize={
          { minRows: 2, maxRows: 6 }
        } placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="员工">
        {form.getFieldDecorator('employee', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: detailInfo && detailInfo.employee
        })(<Select
          // mode="multiple"
          disabled={detailInfo.title ? true : false}
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
          disabled={detailInfo.title ? true : false}
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否已读">
        {form.getFieldDecorator('readed', {
          initialValue: detailInfo.readed ? detailInfo.readed : false
        })(<Switch checkedChildren="已读" unCheckedChildren="未读" defaultChecked={detailInfo.readed ? true : false} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发送时间">
        {form.getFieldDecorator('published', {
          initialValue: detailInfo.published && moment(detailInfo.published),
          // rules: [{ type: 'object', required: true, message: '请选择' }]
        })(<DatePicker disabled={detailInfo.title ? true : false} showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="阅读时间">
        {form.getFieldDecorator('readtime', {
          initialValue: detailInfo.readtime && moment(detailInfo.readtime),
          // rules: [{ type: 'object', required: true, message: '请选择' }]
        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
