import { TRequestController } from "../config/types.config";
import { AsyncRequestHandler } from "../utils/async-request-handler.utils";


const getUser:TRequestController = async (req, res):Promise<void> => {
    res.status(200).json({
        ok: true,
        msg: "Data fetched successfully.",
        data: req.user
    })
}

export const GetUser = AsyncRequestHandler(getUser)