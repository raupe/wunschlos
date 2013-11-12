exports.wishlist = {
	title: String,
	to: String,
	publicId: String, // wanted to use ObjectId here but throws error
	items: [
		{
			title: String,
			price: Number,
			unit: String,
			link: String,
			idea: String,
			position: 0,
			secret: Boolean,
			share: [
				{
					name: String,
					amount: Number,
					secret: Boolean
    			}
			],
			comments: [
				{
					name: String,
					comment: String,
					secret: Boolean
    			}
			]
  		}
	]
};