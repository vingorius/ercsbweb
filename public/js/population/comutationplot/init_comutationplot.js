var init_comutationplot = function (_is, _type, _id)	{
	if(_is === "ERCSB")	{
		Init.requireJs(
			"mutational_landscape_comutation", 
			"/rest/comutationplotForERCSB"
			);
	}
	else {
		Init.requireJs(
			"mutational_landscape_comutation", 
			"/rest/comutationplot?cancer_type=" + _type + "&sample_id=" + _id
			);
	}
}