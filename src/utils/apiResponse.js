export default class ApiResponse {
  constructor(
    statusCode = 200,
    message = "successful response",
    data = null,
    meta = {},
  ) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success(message = "Success", data = null, meta = {}) {
    return new ApiResponse({ statusCode: 200, message, data, meta });
  }
  static created(message = "Resource created", data = null) {
    return new ApiResponse({ statusCode: 201, message, data });
  }
  static paginated(data, page, limit, totalResults) {
    return new ApiResponse({
      statusCode: 200,
      message: "Data fetched.",
      data,
      meta: {
        page,
        limit,
        totalResults,
        totalPages: Math.ceil(totalResults / limit),
      },
    });
  }
}
