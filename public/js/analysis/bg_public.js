var DATA = 'DATA';
var COUNT = 'COUNT';

var FILTERED = 'FILTERED';
var FILTERED_COUNT = 'FILTERED_COUNT';

var FILTER_OPTION = 'FILTER_OPTION';
var FILTER_DOMAIN = 'FILTER_DOMAIN';

var onlyUnique = function(value, index, self) {
	if (value === null || value === undefined || value === 'NA') return false;
	return self.indexOf(value) === index;
};

var getNameOfDomain = function(domains, value) {
	// var domains = this.getFilterDomain();
	var idx = value.charCodeAt(0) - 97;
	return domains[idx].name;
};


var bg_public = {
	init: function(obj) {
		this.clear();
		this.setData(obj);
		this.setFiltered(obj);
		this.setFilterDomain(obj);
	},
	clear: function() {
		localStorage.clear();
	},
	setData: function(obj) {
		localStorage[DATA] = JSON.stringify(obj);
		localStorage[COUNT] = obj.length;
	},
	getData: function() {
		return JSON.parse(localStorage[DATA]);
	},
	getCount: function() {
		return localStorage[COUNT] || 0;
	},

	setFiltered: function(obj) {
		localStorage[FILTERED] = JSON.stringify(obj);
		localStorage[FILTERED_COUNT] = obj.length;
	},
	getFiltered: function() {
		return JSON.parse(localStorage[FILTERED]);
	},
	getFilteredCount: function() {
		return localStorage[FILTERED_COUNT] || 0;
	},

	getMenuCountText: function(){
		return '(' + this.getFilteredCount() + '/' + this.getCount() + ')';
	},

	filter: function(checkeditems) {
		var arr = this.getData();
		var filtered = [];
		//console.log(arr);
		console.log('checkeditems',checkeditems);
		// console.log(getPublicFilterDomain());
		var domains = this.getFilterDomain();

		arr.forEach(function(item) {
			var isOK = [];
			checkeditems.forEach(function(data) {
				var name = getNameOfDomain(domains, data.domain);
				// console.log(name,item[name],data.value);
				if (data.checked.indexOf(item[name]) > -1) { // OR 조건
					isOK.push(true);
				} else {
					isOK.push(false);
				}
			});
			if (isOK.indexOf(false) < 0) filtered.push(item); // And 조건
		});
		console.log('filtered',filtered);
		return filtered;
	},

	setFilterDomain: function(obj) {
		var filterDomain = [];
		var filterNames = Object.keys(obj[0]);
		// filterNames.forEach(function(_data) {
		// 	console.log(_data);
		// });
		for (var i = 2; i < filterNames.length; i++) {
			var item = obj.map(function(_data) {
				return _data[filterNames[i]];
			});
			var domain = {
				name: filterNames[i],
				data: []
			};
			domain.data = item.filter(onlyUnique);
			filterDomain.push(domain);
		}
		localStorage[FILTER_DOMAIN] = JSON.stringify(filterDomain);
	},
	getFilterDomain: function() {
		return JSON.parse(localStorage[FILTER_DOMAIN]);
	},

	setFilterOption: function(obj) {
		localStorage[FILTER_OPTION] = JSON.stringify(obj);
	},
	getFilterOption: function() {
		return JSON.parse(localStorage[FILTER_OPTION] ||'[]');
	},

};
