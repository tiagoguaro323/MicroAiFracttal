export interface IErrors {
  // <field name>
  [field: string]: string[];
}

export interface IApi {
  create?: string;
  read?: string;
  update?: string;
  delete?: string;
  list?: string;
}

export interface IResponse {
  success: boolean;
  message: string;
  data: any;
  total: number;
}
