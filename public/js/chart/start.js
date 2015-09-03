function chooseUrl(_type)	{
	return {
		"xy" : "/rest/xyplot",
		"ma" : "/rest/maplot",
		"deg" : "/rest/degplot",
		"pca" : "/datas/PCA.dat.tsv",
		"needle" : "/rest/needleplot_old?gene=EGFR",
		"comutation" : "/rest/tumorportal_cmp?type=BRCA"
	}[_type];
}

function startChart(_type)	{
	var url = chooseUrl(_type);

	Init.requireJs( _type, url );
}