const db = require('./../models');
const Works = db.works;
const cloudinary = require('cloudinary').v2

exports.findAll = async (req, res) =>  {
	const works = await Works.findAll({include: 'category'});
	return res.status(200).json(works);
}

exports.create = async (req, res) => {
	const title = req.body.title;
	const categoryId = req.body.category;
	const userId = req.auth.userId;
	const imageUrl = req.file.path; // URL Cloudinary
	try{
		const work = await Works.create({
			title,
			imageUrl,
			categoryId,
			userId
		})
		return res.status(201).json(work)
	}catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') })
	}
}

exports.delete = async (req, res) => {
	try{
		// Récupérer le work pour obtenir l'URL de l'image
		const work = await Works.findOne({where:{id: req.params.id}});

		if (work && work.imageUrl) {
			// Extraire le public_id de l'URL Cloudinary
			const urlParts = work.imageUrl.split('/');
			const filename = urlParts[urlParts.length - 1];
			const publicId = `sophie-bluel/${filename.split('.')[0]}`;

			// Supprimer l'image de Cloudinary
			await cloudinary.uploader.destroy(publicId);
		}

		// Supprimer le work de la base de données
		await Works.destroy({where:{id: req.params.id}})
		return res.status(204).json({message: 'Work Deleted Successfully'})
	}catch(e){
		return res.status(500).json({error: new Error('Something went wrong')})
	}

}
