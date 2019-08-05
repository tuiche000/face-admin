import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string) {
  // const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('access_token', authority);
}
