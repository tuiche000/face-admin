// 表单列表
export interface TableListItem {
  id: string;
  noticeType: string;
  title: string;
  content: string;
  employee: string;
  visitor: string;
  published: Date;
  readtime: Date;
  readed: boolean;
}

// 表单分页
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

// 页面数据
export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

// 表单组件参数
export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  pageNo: number;
}
