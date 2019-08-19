import request from '@/utils/request';
import { TableListParams } from './data.d';

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
export async function type() {
  return request(`/api/oss/common/enum/NOTICE_TYPE`, {
    method: 'GET',
    params: {
      pageSize: 999
    }
  });
}

export async function detail(id: string) {
  return request(`/api/oss/notice/${id}`, {
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
