import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function detail(floorId: number) {
  return request(`/api/oss/floor/${floorId}`, {
    method: 'POST'
  });
}

export async function query(params: TableListParams) {
  return request('/api/oss/floor/query', {
    params,
  });
}

export async function remove(floorId: number) {
  return request(`/api/oss/floor/${floorId}`, {
    method: 'DELETE'
  });
}

export async function add(params: TableListParams) {
  return request('/api/oss/floor', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/oss/floor', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
