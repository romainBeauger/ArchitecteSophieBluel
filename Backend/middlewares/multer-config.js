const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Configuration Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

const MIME_TYPE = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
}

// Stockage Cloudinary
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'sophie-bluel',
		allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
		public_id: (req, file) => {
			const filename = file.originalname.split(' ').join('_')
			const filenameArray = filename.split('.')
			filenameArray.pop()
			const filenameWithoutExtention = filenameArray.join('.')
			return filenameWithoutExtention + Date.now()
		}
	}
})

module.exports = multer({storage}).single('image')
