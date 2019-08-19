// 表单列表
export interface TableListItem {
  id: string
  name: string
  organization: string,
  parentId?: string
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
  name: string
  organization: string
  parentId?: number
}
