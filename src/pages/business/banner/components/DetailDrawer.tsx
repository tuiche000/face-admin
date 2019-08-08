import { Drawer, Divider, Col, Row } from 'antd';

import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { detail } from '../service'
import { JSXElement } from '@babel/types';

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};
const DescriptionItem = (props: { title: string, children: any }): JSX.Element => {
  console.log(typeof props.children)
  return (
    <div
      style={{
        fontSize: 14,
        lineHeight: '22px',
        marginBottom: 7,
        color: 'rgba(0,0,0,0.65)',
      }}
    >
      <p
        style={{
          marginRight: 8,
          display: 'inline-block',
          color: 'rgba(0,0,0,0.85)',
        }}
      >
        {props.title}:
      </p>
      {props.children}
    </div>
  );
}

interface DetailDrawerProps {
  drawerVisible: boolean;
  handleDrawerVisible: (flag?: boolean, record?: Partial<TableListItem>) => void
  values: Partial<TableListItem>;
}
const DetailDrawer: React.FC<DetailDrawerProps> = props => {
  const { drawerVisible, handleDrawerVisible, values } = props;

  const [detailInfo, setDetailInfo] = useState();
  useEffect(() => {
    detail(values.id).then((res: {
      code: string;
      data: TableListItem
    }) => {
      if (res.code == "0") {
        setDetailInfo(res.data)
      }
    })
  }, []);

  return (
    <Drawer
      width={'50%'}
      placement="right"
      closable={false}
      onClose={() => handleDrawerVisible(false, values)}
      afterVisibleChange={() => {
        if (!drawerVisible) {
          handleDrawerVisible(false)
        }
      }}
      visible={drawerVisible}
    >
      <p style={{ ...pStyle, marginBottom: 24 }}>查看设备</p>
      {/* <p style={pStyle}>Personal</p> */}
      <Divider></Divider>
      <Row>
        <Col span={24}>
          <DescriptionItem title="名字">{detailInfo && detailInfo.name}</DescriptionItem>
        </Col>
        <Col span={24}>
          <DescriptionItem title="资源路径"><img width="100%" src={detailInfo && detailInfo.resource}></img></DescriptionItem>
        </Col>
        <Col span={24}>
          <DescriptionItem title="目标">{detailInfo && detailInfo.target}</DescriptionItem>
        </Col>
        <Col span={24}>
          <DescriptionItem title="显示顺序">{detailInfo && detailInfo.displayOrder}</DescriptionItem>
        </Col>
      </Row>
      <Divider></Divider>
    </Drawer>
  );
};

export default DetailDrawer;
