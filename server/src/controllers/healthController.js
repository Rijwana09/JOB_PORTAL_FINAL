import ApiResponse from "../utils/apiResponse.js";

export const healthCheck = (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      "Server Running Successfully",
      {
        uptime: process.uptime(),
        timestamp: new Date()
      }
    )
  );
};