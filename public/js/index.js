require.config({
	baseUrl : "../js",
	
	paths : {
		size : "size",
		utils : "utils",
		interface_comutation : "./comutationplot/interface_comutationplot",
		comutation : "./comutationplot/comutation/",
		gene : "./comutationplot/gene/",
		pq : "./comutationplot/pq/",
		sample : "./comutationplot/sample/",
		comutationnavigation : "./comutationplot/navigation/",
		legend : "./legend/",
		maplot : "./maplot/",
		needleplot : "./needleplot/needle/",
		needleplotnavigation : "./needleplot/navigation/",
		pcasetting : "./pcaplot/interface_pcaplot",
		pcaplot2d : "./pcaplot/pca2d/",
		pcaplot3d : "./pcaplot/pca3d/",
		xyplot : "./xyplot/"
	}
});

require(["size", "maplot/setting_maplot", "needleplot/setting_needleplot", "xyplot/setting_xyplot", "pcasetting", "interface_comutation"], function(_size, _ma, _needle, _xy, _pca, _comutation)  {
	//Nessecery for make chart 
	var info_chart = {
		comutation : { 
			url : "http://192.168.191.159/rest/tumorportal_cmp?type=BRCA", 
			func : _comutation 
		},
		needle : { 
			url : "http://192.168.191.159/rest/needleplot?gene=EGFR", 
			func : _needle
		},
		xy : { 
			url : "http://192.168.191.159/rest/xyplot", 
			func : _xy 
		},
		ma : { 
			url : "http://192.168.191.159/rest/maplot", 
			func : _ma
		},
		pca : { 
			url : "http://192.168.191.159/datas/PCA.dat.tsv", 
			func : _pca 
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