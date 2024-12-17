type _Response = {
  err: string;
  status_code: number;
  data: any;
};

export type _ServerResponse = {
  message: string;
  status_code: number;
  data: any[];
};

export function resObj(
  message: string,
  status_code: number,
  data: Array<any>,
): _ServerResponse {
  return {
    message,
    status_code,
    data,
  };
}

export default _Response;
