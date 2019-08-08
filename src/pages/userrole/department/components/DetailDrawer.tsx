import { Drawer, Divider, Col, Row } from 'antd';

import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { detail } from '../service'

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};
const DescriptionItem = ({ title, content }: any) => (
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
      {title}:
    </p>
    {content}
  </div>
);

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
          <DescriptionItem title="名字" content={detailInfo && detailInfo.name} />{' '}
        </Col>
        <Col span={24}>
          <DescriptionItem title="楼层" content={detailInfo && detailInfo.floorName} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="备注" content={detailInfo && detailInfo.remark} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="显示顺序" content={detailInfo && detailInfo.displayOrder} />
        </Col>
      </Row>
      <Divider></Divider>
    </Drawer>
  );
};

export default DetailDrawer;
