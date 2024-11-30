import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //return success response
    res.status(200).json(new ApiResponse(200, null, "OK"));
})

export { healthcheck };