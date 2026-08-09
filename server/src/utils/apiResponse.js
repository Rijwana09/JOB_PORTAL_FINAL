class ApiResponse {
  constructor({
    statusCode = 200,
    message = "Success",
    data = null,
    meta = null,
  } = {}) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;

    if (meta) {
      this.meta = meta;
    }
  }
}

export default ApiResponse;