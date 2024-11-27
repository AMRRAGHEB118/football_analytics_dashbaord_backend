type _Response = {
  err: string;
  status_code: number;
  data: any;
};

export type _ServerResponse = {
  message: string;
  status_code: number;
  data: any[];
}

export default _Response;