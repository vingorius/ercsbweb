var init_pathwayplot = function(_is, _type, _id, _seq)	{
	Init.requireJs(
		"analysis_pathway", 
		"/rest/pathwayplot?cancer_type=" + _type + "&sample_id=" + _id + "&seq=1"
		);
}