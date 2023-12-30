const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_S3_REGION,
});

const s3 = new aws.S3();

const fileDelete = async (imagePath) => {
  const fileName = imagePath.split("/").pop();
  const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: fileName };
  let fileObject;
  try {
    fileObject = await s3.headObject(params).promise();
  } catch (err) {
    console.log("File not found in bucket.");
    console.log(err.message);
  }
  if (fileObject) {
    try {
      await s3.deleteObject(params).promise();
    } catch (err) {
      console.log("Deleting file in bucket failed.");
      console.log(err.message);
    }
  }
};

module.exports = fileDelete;
