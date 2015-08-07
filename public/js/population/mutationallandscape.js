var mutational_landscape_call = function(_sample, _type)	{
	setTimeout(function()	{
		Init.requireJs("mutational_landscape_comutation", "/rest/comutationplot?cancer_type=" + _type + "&sample_id=" + _sample);
	}, 250);
}