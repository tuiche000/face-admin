import request from 'umi-request'
import { FromDataType } from './index';

export async function fakeAccountLogin(params: FromDataType) {
  console.log(params)
  return request(`http://visit.fothing.com/oauth/oauth2/token?grant_type=password&client_id=${'07z9hRpWbtVzNf3KQO2pO0'}&client_secret=${'yFJbfGVTNomavvR7cwMyYddFStw2tKiU'}&username=${params.username}&password=${params.password}`, {
    // method: 'POST',
    // data: {
    //   ...params,
      
    // },
    // requestType: 'form',
    // headers: { 'Authorization': `Basic ${window.btoa("webApp:webApp")}`}
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
