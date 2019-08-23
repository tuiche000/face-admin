import { Form, Input, Modal, Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { detail } from '../service'

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  hasVal: boolean; // true=>编辑 false=>新增
  values?: Partial<TableListItem>;
  departments: TableListItem[];
  handleAdd?: (fieldsValue: TableListItem) => void;
  handleModalVisible?: () => void;
  handleUpdate?: (fieldsValue: TableListItem) => void;
  handleUpdateModalVisible?: (flag?: boolean, record?: TableListItem) => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, handleUpdate, handleUpdateModalVisible, values, hasVal, departments } = props;

  const [detailInfo, setDetailInfo] = useState({
    id: '',
    name: '',
    organization: '',
    parentId: ''
  });

  useEffect(() => {
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

      form.resetFields();
      if (hasVal) { //修改的
        fieldsValue.id = detailInfo.id
        console.log('修改')
        handleUpdate && handleUpdate(fieldsValue)
        return
      }
      handleAdd && handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={hasVal ? "编辑部门" : "创建部门"}
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名字">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: detailInfo && detailInfo.name
        })(<Input placeholder="请输入" />)}
      </FormItem>
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构">
        {form.getFieldDecorator('organization', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: detailInfo && detailInfo.organization
        })(<Input placeholder="请输入" />)}
      </FormItem> */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
        {form.getFieldDecorator('parentId', {
          initialValue: detailInfo && detailInfo.parentId
        })(<Select
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={(e) => {
            console.log(e)
          }}
        >
          {
            departments.map((item: TableListItem): JSX.Element => {
              return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )
            })
          }
        </Select>)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
