export interface APIResponse<T = null> {
  success: boolean;
  message: string | string[];
  statusCode: number;
  data?: T;
}
