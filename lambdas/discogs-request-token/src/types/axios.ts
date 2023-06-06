export interface AxiosOauth {
  oauth_consumer_key: string | undefined;
  oauth_nonce: string;
  oauth_signature: string | undefined;
  oauth_signature_method: string;
  oauth_timestamp: number;
  oauth_callback: string;
  set?: string;
  get?: string;
  has?: string;
  delete?: string;
  clear?: string;
  normalize?: string;
  concat?: string;
  toJSON?: string;
  setContentType?: string;
  getContentType?: string;
  hasContentType?: string;
  setContentLength?: string;
  getContentLength?: string;
  hasContentLength?: string;
  setAccept?: string;
  getAccept?: string;
  hasAccept?: string;
  getUserAgent?: string;
  setUserAgent?: string;
  hasUserAgent?: string;
  setContentEncoding?: string;
  getContentEncoding?: string;
  hasContentEncoding?: string;
  setAuthorization?: string;
  getAuthorization?: string;
  hasAuthorization?: string;
}

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

export interface AxiosConfig {
  headers?: AxiosHeaders;
  url?: string;
  method?: Method | string;
  baseURL?: string;
}
export interface AxiosHeaders {
  "Content-Type": string;
  Authorization: AxiosOauth;
  "User-Agent": string;
}

export interface AxiosResponse {
  data: object;
  status: string;
}

// export type RawAxiosResponseHeaders = Partial<
//   RawAxiosHeaders & RawCommonResponseHeaders
// >;

// type CommonResponseHeadersList =
//   | "Server"
//   | "Content-Type"
//   | "Content-Length"
//   | "Cache-Control"
//   | "Content-Encoding";

// type RawCommonResponseHeaders = {
//   [Key in CommonResponseHeadersList]: AxiosHeaderValue;
// } & {
//   "set-cookie": string[];
// };

// export type AxiosHeaderValue =
//   | AxiosHeaders
//   | string
//   | string[]
//   | number
//   | boolean
//   | null
//   | object;

// interface RawAxiosHeaders {
//   [key: string]: AxiosHeaderValue;
// }

// export type AxiosResponseHeaders = RawAxiosResponseHeaders & AxiosHeaders;

// export interface InternalAxiosRequestConfig<D = any>
//   extends AxiosRequestConfig<D> {
//   headers: AxiosRequestHeaders;
// }

// export interface APIResponse<T = any, D = any> {
//   data: T;
//   status: number;
//   statusText: string;
//   headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
//   config: InternalAxiosRequestConfig<D>;
//   request?: any;
// }

// export type AxiosRequestHeaders = RawAxiosRequestHeaders & AxiosHeaders;

// export interface AxiosRequestConfig<D = any> {
//   url?: string;
//   method?: Method | string;
//   baseURL?: string;
//   transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
//   transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
//   headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
//   params?: any;
//   paramsSerializer?: ParamsSerializerOptions | CustomParamsSerializer;
//   data?: D;
//   timeout?: Milliseconds;
//   timeoutErrorMessage?: string;
//   withCredentials?: boolean;
//   adapter?: AxiosAdapterConfig | AxiosAdapterConfig[];
//   auth?: AxiosBasicCredentials;
//   responseType?: ResponseType;
//   responseEncoding?: responseEncoding | string;
//   xsrfCookieName?: string;
//   xsrfHeaderName?: string;
//   onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
//   onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
//   maxContentLength?: number;
//   validateStatus?: ((status: number) => boolean) | null;
//   maxBodyLength?: number;
//   maxRedirects?: number;
//   maxRate?: number | [MaxUploadRate, MaxDownloadRate];
//   beforeRedirect?: (
//     options: Record<string, any>,
//     responseDetails: { headers: Record<string, string> }
//   ) => void;
//   socketPath?: string | null;
//   transport?: any;
//   httpAgent?: any;
//   httpsAgent?: any;
//   proxy?: AxiosProxyConfig | false;
//   cancelToken?: CancelToken;
//   decompress?: boolean;
//   transitional?: TransitionalOptions;
//   signal?: GenericAbortSignal;
//   insecureHTTPParser?: boolean;
//   env?: {
//     FormData?: new (...args: any[]) => object;
//   };
//   formSerializer?: FormSerializerOptions;
//   family?: 4 | 6 | undefined;
//   lookup?:
//     | ((
//         hostname: string,
//         options: object,
//         cb: (err: Error | null, address: string, family: number) => void
//       ) => void)
//     | ((
//         hostname: string,
//         options: object
//       ) => Promise<[address: string, family: number] | string>);
// }
