import { Form, Input, Modal, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { TableListItem } from '../data.d';

const FormItem = Form.Item;
const { TextArea } = Input

interface CreateFormProps extends FormComponentProps {
  values: Partial<TableListItem>;
  modalVisible: boolean;
  handleAdd: (fieldsValue: TableListItem) => void;
  handleModalVisible: () => void;
  handleUpdate: (fieldsValue: TableListItem) => void;
  handleUpdateModalVisible: () => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, handleUpdate, handleUpdateModalVisible, values } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (Object.keys(values).length) { //修改的
        fieldsValue.id = values.id
        console.log(fieldsValue)
        handleUpdate(fieldsValue)
        return
      }
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={Object.keys(values).length ? "编辑楼层" : "创建楼层"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        if (Object.keys(values).length) {
          handleUpdateModalVisible()
        } else {
          handleModalVisible()
        }
      }}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名字">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: values && values.name
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: values && values.remark
        })(<TextArea autosize={
          { minRows: 2, maxRows: 6 }
        } placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
        {form.getFieldDecorator('displayOrder', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: values && values.displayOrder
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
