import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addQueryParams(
  url: string,
  params: Record<string, string | number>
) {
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return `${url}?${query}`;
}

/*
 * Returns where the next param tells you to navigate, undefined if no redirect param
 */
export function getRedirectUrl(searchParams: URLSearchParams) {
  const nextParam = searchParams.get('next');
  // avoid malicious redirect
  return nextParam?.startsWith('/') && !nextParam.startsWith('//')
    ? nextParam
    : undefined;
}
