const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './tmp/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
  s3: multerS3({
    s3: new AWS.S3(),
    bucket: 'uploadimagensmy',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
};

const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(
    (acceptedFormat) => acceptedFormat == file.mimetype
  );

  if (isAccepted) {
    return cb(null, true);
  }

  return cb(null, false);
};

module.exports = multer({
  storage: storageTypes[process.env.STORAGE_TYPE],
  fileFilter,
});
