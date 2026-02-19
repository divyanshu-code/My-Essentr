import { v2 as cloudinary } from 'cloudinary'

// cloudinary for large media storage . cloudinary stores the media permanently. It is used for large projects
// where multer is also used for media storage but for small projects and store in local server or local system . multer is middleware that stores the media temporarily 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const upload = async (file) => {

    if (!file) {
        return null;
    }

    try {

        const arraybuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arraybuffer);

        return new Promise((resolve, reject) => {

            const uploadstream = cloudinary.uploader.upload_stream(

                { resource_type: "auto" },
                (error, result) => {
                    if (error) {
                        log("Cloudinary Upload Error:", error);
                        reject(error)
                    } else {
                        resolve(result?.secure_url ?? null)
                    }
                }
            )

            uploadstream.end(buffer)
        })
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

export default upload