// 表单列表
export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
}

// 表单分页
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

// 表单数据
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
  currentPage: number;
}
