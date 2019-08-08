import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function detail(deviceId: string) {
  return request(`/api/oss/banner/${deviceId}`, {
    method: 'GET'
  });
}

export async function query(params: TableListParams) {
  return request('/api/oss/banner/query', {
    params,
  });
}

export async function remove(deviceId: number) {
  return request(`/api/oss/banner/${deviceId}`, {
    method: 'DELETE'
  });
}

export async function add(params: TableListParams) {
  return request('/api/oss/banner', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/oss/banner', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
