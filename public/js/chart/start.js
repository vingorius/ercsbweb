var chooseUrl = function (_type)	{
	return {
		"xy" : "/rest/xyplot",
		"ma" : "/rest/maplot",
		"deg" : "/rest/degplot",
		"pca" : "/datas/PCA.dat.tsv",
		"needle" : "/rest/needleplot_old?gene=EGFR",
		"comutation" : "/rest/tumorportal_cmp?type=BRCA"
	}[_type];
}

var startChart = function(_type)	{
	var url = chooseUrl(_type);

	Init.requireJs( _type, url );
}

var init_pathwayplot = function(_is, _type, _id, _seq)	{
	Init.requireJs("analysis_pathway", "/rest/pathwayplot?cancer_type=" + _type + "&sample_id=" + _id + "&seq=1");
}

var init_comutationplot = function (_is, _type, _id)	{
	if(_is === "ERCSB")	{
		Init.requireJs("mutational_landscape_comutation", "/rest/comutationplotForERCSB");
	}
	else {
		Init.requireJs("mutational_landscape_comutation", "/rest/comutationplot?cancer_type=" + _type + "&sample_id=" + _id);
	}
}