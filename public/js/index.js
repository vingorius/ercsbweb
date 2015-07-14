require.config({
	baseUrl : "/js",
	
	paths : {
		header : "chartheader/",
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

require(["header/setting_header", "size", "maplot/setting_maplot", "needleplot/setting_needleplot", "xyplot/setting_xyplot", "pcasetting", "interface_comutation", "degplot/setting_degplot"], function(_header, _size, _ma, _needle, _xy, _pca, _comutation, _deg)  {
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
			_pathname.indexOf("plot"));
	}

	$(function()    {
		var target = find_pathname(window.location.pathname);

		_header($(".container.chart_base_container"));

		request_data(target);
	});
});