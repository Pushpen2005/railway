import dotenv from "dotenv";
dotenv.config();


export async function checkApiKey(req,res,next){
    try{
        const apiKey = req.headers['x-api-key'];
            if(apiKey !== process.env.DEVICE_API_KEY){
                return res.status(401).json({message:"Unauthorized"});
            }
            // If API key is valid, proceed to the next middleware or route handler
            next();
    }catch{
        return res.status(500).json({message:"Internal Server Error"});
    }

}