const cloudinary = require('cloudinary').v2

exports.Upload = (req, res) => {
    try {
        console.log("here", req.body);
        cloudinary.uploader.upload(req.body.file, {
                resource_type: "image",

            })
            .then((result) => {
                console.log("cloud", JSON.stringify(result));
            })
    } catch (error) {
        console.log(error);
    }
}