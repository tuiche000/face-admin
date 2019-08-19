import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  // Select,
  message,
  Popconfirm
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
// import moment from 'moment';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import DetailDrawer from './components/DetailDrawer';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  userroleDepartment: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  drawerVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  pageNo: number | undefined;
  type: string;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    userroleDepartment,
    loading,
  }: {
    userroleDepartment: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userroleDepartment,
    loading: loading.models.userroleDepartment,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    drawerVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    pageNo: 1,
    type: 'add',
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '名字',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <a href="javascript:void(0);" onClick={() => this.handleDrawerVisible(true, record)}>{text}</a>
        )
      }
    },
    {
      title: '机构',
      dataIndex: 'code',
    },
    // {
    //   title: '显示顺序',
    //   dataIndex: 'displayOrder',
    // },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定吗?"
            onConfirm={() => {
              this.handleMenuClick({
                key: 'remove',
                record
              })
            }}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a href="javascript:void(0);">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userroleDepartment/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      ...formValues,
      ...filters,
    };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }
    this.setState({
      pageNo: pagination.current
    })
    dispatch({
      type: 'userroleDepartment/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userroleDepartment/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string, record?: TableListItem }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'userroleDepartment/remove',
          payload: e.record ? e.record.id : selectedRows.map(row => row.id),
          callback: () => {
            message.success('删除成功');
            dispatch({
              type: 'userroleDepartment/fetch',
              payload: {
                pageNo: this.state.pageNo
              }
            });
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // const values = {
      //   ...fieldsValue,
      //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      // };
      this.setState({
        pageNo: 1,
        formValues: fieldsValue,
      });

      dispatch({
        type: 'userroleDepartment/fetch',
        payload: fieldsValue,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
      type: 'add'
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: TableListItem) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      type: record ? 'update' : 'add'
    });
  };

  handleDrawerVisible = (flag?: boolean, record?: Partial<TableListItem>) => {
    this.setState({
      drawerVisible: !!flag,
      stepFormValues: record || {},
      type: record ? 'drawer' : 'add'
    });
  };

  handleAdd = (fields: TableListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userroleDepartment/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        dispatch({
          type: 'userroleDepartment/fetch',
          payload: {
            pageNo: this.state.pageNo
          }
        });
      },
    });

    this.handleModalVisible();
  };

  handleUpdate = (fields: TableListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userroleDepartment/update',
      payload: fields,
      callback: () => {
        message.success('修改成功');
        dispatch({
          type: 'userroleDepartment/fetch',
          payload: {
            pageNo: this.state.pageNo
          },
        });
      },
    });
    this.handleUpdateModalVisible(false);
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keyword')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      userroleDepartment: { data },
      loading,

    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, type } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {
          data.list ? (
            <CreateForm {...parentMethods} hasVal={false} departments={data.list} modalVisible={modalVisible} />
          ) : null
        }
        {
          type == 'update' ? (
            <CreateForm
              {...updateMethods}
              hasVal={true}
              modalVisible={updateModalVisible}
              departments={data.list}
              values={stepFormValues} />
          ) : null
        }
        {type == 'drawer' ? (
          <DetailDrawer
            values={stepFormValues}
            drawerVisible={this.state.drawerVisible}
            handleDrawerVisible={this.handleDrawerVisible}
          ></DetailDrawer>
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
