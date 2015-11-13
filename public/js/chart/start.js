"use strict";
var chooseUrl = function (_type)	{
	switch(_type)	{
		case "xy" : return "/rest/xyplot"; break;
		case "ma" : return "/rest/maplot"; break;
		case "deg" : return "/rest/degplot"; break;
		case "pca" : return "/datas/PCA.dat.tsv"; break;
		case "needle" : "/rest/needleplot?cancer_type=luad&sample_id=Pat1099&gene=EGFR&transcript=ENST00000275493&classification=All&filer"; break;
		case "comutation" : return "/rest/tumorportal_cmp?type=BRCA"; break;
	}
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