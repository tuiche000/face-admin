import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function device() {
  return request(`/api/oss/device/query`, {
    method: 'GET',
    params: {
      pageSize: 999
    }
  });
}
export async function employee() {
  return request(`/api/oss/employee/query`, {
    method: 'GET',
    params: {
      pageSize: 999
    }
  });
}
export async function visitor() {
  return request(`/api/oss/visitor/query`, {
    method: 'GET',
    params: {
      pageSize: 999
    }
  });
}

export async function detail(deviceId: string) {
  return request(`/api/oss/deviceauth/${deviceId}`, {
    method: 'GET'
  });
}

export async function query(params: TableListParams) {
  return request('/api/oss/deviceauth/query', {
    params,
  });
}

export async function remove(deviceId: number) {
  return request(`/api/oss/deviceauth/${deviceId}`, {
    method: 'DELETE'
  });
}

export async function add(params: TableListParams) {
  return request('/api/oss/deviceauth', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/oss/deviceauth', {
    method: 'PUT',
    data: {
      ...params
    },
  });
}
