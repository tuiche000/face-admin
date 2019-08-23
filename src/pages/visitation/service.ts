import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function detail(deviceId: string) {
  return request(`/api/oss/visitation/${deviceId}`, {
    method: 'GET'
  });
}

export async function query(params: TableListParams) {
  return request('/api/oss/visitation/query', {
    params,
  });
}

export async function remove(deviceId: number) {
  return request(`/api/oss/visitation/${deviceId}`, {
    method: 'DELETE'
  });
}

export async function add(params: TableListParams) {
  return request(`/api/oss/visitation`, {
    method: 'POST',
    data: {
      ...params
    },
    params: {
      parentId: params.parentId
    }
  });
}

export async function update(params: TableListParams) {
  return request('/api/oss/visitation', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
