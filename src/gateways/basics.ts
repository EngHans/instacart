export enum STATUS_CODES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  IM_A_TEAPOT = 418,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
}

export const getErrorData = (error: any): string => {
  const errorData = error.response?.data || error;
  return JSON.stringify(errorData);
};
