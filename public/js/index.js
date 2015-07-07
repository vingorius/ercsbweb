require.config({
	baseUrl : "/js",
	
	paths : {
		size : "size",
		utils : "utils",
		interface_comutation : "comutationplot/interface_comutationplot",
		comutation : "comutationplot/comutation/",
		gene : "comutationplot/gene/",
		pq : "comutationplot/pq/",
		sample : "comutationplot/sample/",
		comutationnavigation : "comutationplot/navigation/",
		legend : "legend/",
		maplot : "maplot/",
		needleplot : "needleplot/needle/",
		needleplotnavigation : "needleplot/navigation/",
		pcasetting : "pcaplot/interface_pcaplot",
		pcaplot2d : "pcaplot/pca2d/",
		pcaplot3d : "pcaplot/pca3d/",
		xyplot : "xyplot/",
		degplot : "degplot/"
	}
});

require(["size", "maplot/setting_maplot", "needleplot/setting_needleplot", "xyplot/setting_xyplot", "pcasetting", "interface_comutation", "degplot/setting_degplot"], function(_size, _ma, _needle, _xy, _pca, _comutation, _deg)  {
	//Nessecery for make chart 
	var info_chart = {
		comutation : { 
			url : "/rest/tumorportal_cmp?type=BRCA", 
			func : _comutation 
		},
		needle : { 
			url : "/rest/needleplot?gene=EGFR", 
			func : _needle
		},
		xy : { 
			url : "/rest/xyplot", 
			func : _xy 
		},
		ma : { 
			url : "/rest/maplot", 
			func : _ma
		},
		pca : { 
			url : "/datas/PCA.dat.tsv", 
			func : _pca 
		},
		deg : {
			url : "/rest/degplot",
			func : _deg
		}
}

	 var request_data = function(_id)    {    
	 	var id = "";

	 	if(_id.lastIndexOf("-") < 0)   { id = _id; }
	 	else { id = _id.substring(0, _id.lastIndexOf("-")); }

	 	$.get(info_chart[id].url, function(_res)   { 
	 		info_chart[id].func(_res); 
	 	});
	 }

	 var find_pathname = function(_pathname)	{
	 	return _pathname.substring(_pathname.lastIndexOf("/") + 1,
	 		_pathname.length - 4);
	 }
	 
	$(function()    {
		var target = find_pathname(window.location.pathname);
		request_data(target);
	});
});