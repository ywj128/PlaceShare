const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid").v1;

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_S3_REGION,
});

const s3 = new aws.S3();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, uuid());
    },
  }),
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //       cb(null, "uploads/images")
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = MIME_TYPE_MAP[file.mimetype];
  //     cb(null, uuid() + "." + ext);
  //   },
  // }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid MIME type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
