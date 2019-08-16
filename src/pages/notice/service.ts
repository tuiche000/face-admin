import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function floorQuery(params: {
  sorter?: string;
  status?: string;
  name?: string;
  pageSize: number;
  pageNo: number;
}) {
  return request('/api/oss/floor/query', {
    params,
  });
}

export async function detail(deviceId: string) {
  return request(`/api/oss/notice/${deviceId}`, {
    method: 'GET'
  });
}

export async function query(params: TableListParams) {
  return request('/api/oss/notice/query', {
    params,
  });
}

export async function remove(deviceId: number) {
  return request(`/api/oss/notice/${deviceId}`, {
    method: 'DELETE'
  });
}

export async function add(params: TableListParams) {
  return request('/api/oss/notice', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/oss/notice', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
