import request from '@/utils/request'
import { FromDataType } from './index';

export async function fakeAccountLogin(params: FromDataType) {
  return request(`/oauth/oauth2/token?grant_type=password&client_id=${process.env.config.CLIENTID}&client_secret=${process.env.config.CLIENTSECRET}&username=${params.username}&password=${params.password}`);
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
