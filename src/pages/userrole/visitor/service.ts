import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function detail(deviceId: string) {
  console.log('执行了')
  return request(`/api/oss/device/${deviceId}`, {
    method: 'GET'
  });
}

export async function query(params: TableListParams) {
  return request('/api/oss/device/query', {
    params,
  });
}

export async function remove(deviceId: number) {
  return request(`/api/oss/device/${deviceId}`, {
    method: 'DELETE'
  });
}

export async function add(params: TableListParams) {
  return request('/api/oss/device', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/oss/device', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
