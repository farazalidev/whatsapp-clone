'use client';
import axiosWithAuth from '@/middlewares/axiosInterceptor';
import { AxiosHeaders, AxiosRequestConfig, AxiosResponseTransformer, RawAxiosRequestHeaders } from 'axios';
import { ResponseType } from 'axios';

export async function fetcher<TResponse = any>(
  url: string,
  transformResponse?: AxiosResponseTransformer,
  responseType?: ResponseType,
  server_type: 'static' | 'primary' | undefined = 'primary',
  headers?: RawAxiosRequestHeaders | AxiosHeaders,
) {
  return (
    await axiosWithAuth({ static_server: server_type === 'static' ? true : false }).get<TResponse>(url, {
      transformResponse,
      responseType,
      headers,
    })
  ).data;
}

export async function multiFetcher(...urls: string[]) {
  const f = async (url: string) => {
    return (await axiosWithAuth({ static_server: false }).get(url))?.data;
  };

  return Promise.all(urls.map((url) => f(url)));
}

export async function Mutation<TBody = any, TResponse = any>(
  url: string,
  body: TBody,
  server_type: 'static' | 'primary' | undefined = 'primary',
  config?: AxiosRequestConfig<any | undefined>,
) {
  return (await axiosWithAuth({ static_server: server_type === 'static' ? true : false }).post<TResponse>(url, body, config))?.data;
}
