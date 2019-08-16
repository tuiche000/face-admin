import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function detail(id: string) {
  console.log('执行了')
  return request(`/api/oss/visitor/${id}`, {
    method: 'GET'
  });
}

export async function query(params: TableListParams) {
  return request('/api/oss/visitor/query', {
    params,
  });
}

export async function remove(deviceId: number) {
  return request(`/api/oss/visitor/${deviceId}`, {
    method: 'DELETE'
  });
}

export async function add(params: TableListParams) {
  return request('/api/oss/visitor', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/oss/visitor', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
