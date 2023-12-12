'use client';
import axiosWithAuth from '@/middlewares/axiosInterceptor';
import { AxiosResponseTransformer } from 'axios';
import { ResponseType } from 'axios';

export async function fetcher<TResponse = any>(url: string, transformResponse?: AxiosResponseTransformer, responseType?: ResponseType) {
  return (await axiosWithAuth().get<TResponse>(url, { transformResponse, responseType })).data;
}

export async function multiFetcher(...urls: string[]) {
  const f = async (url: string) => {
    return (await axiosWithAuth().get(url))?.data;
  };

  return Promise.all(urls.map((url) => f(url)));
}

export async function Mutation<TBody = any, TResponse = any>(url: string, body: TBody) {
  return (await axiosWithAuth().post<TResponse>(url, body))?.data;
}
