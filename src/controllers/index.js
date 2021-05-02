module.exports = {
	root: async (req, res) => {
		res.render('index', {
			title: "Fass Converter"
		})
  	}
}
