import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    // Check if the request method is GET
    if (req.method !== 'GET') {
        throw new ApiError(405, "Method Not Allowed");
    }

    // Check for any potential issues with headers
    if (!req.headers['content-type'] || req.headers['content-type'] !== 'application/json') {
        throw new ApiError(400, "Invalid Content-Type");
    }

    // Return success response
    res.status(200).json(new ApiResponse(200, null, "OK"));
})

export { healthcheck };