var chooseUrl = function (_type)	{
	return {
		"xy" : "/rest/xyplot",
		"ma" : "/rest/maplot",
		"deg" : "/rest/degplot",
		"pca" : "/datas/PCA.dat.tsv",
		"needle" : "/rest/needleplot?cancer_type=luad&sample_id=Pat1099&gene=EGFR&transcript=ENST00000275493&classification=All&filter",
		"comutation" : "/rest/tumorportal_cmp?type=BRCA"
	}[_type];
}

var startChart = function(_type)	{
	Init.requireJs(_type, chooseUrl(_type));
}

var startPathway = function(_type, _id, _seq, _filter)	{
	Init.requireJs("analysis_pathway", "/rest/pathwayplot?cancer_type=" + _type + "&sample_id=" + _id + "&filter=" + _filter);
}

var startComutation = function (_is, _type, _id, _filter)	{
	if(_is === "ERCSB")	{
		Init.requireJs("mutational_landscape_comutation", "/rest/comutationplotForERCSB");
	}
	else {
		Init.requireJs("mutational_landscape_comutation", "/rest/comutationplot?cancer_type=" + _type + "&sample_id=" + _id + "&filter=" + _filter);
	}
}