var PUBLIC_DATA = 'public';
var PUBLIC_TOTAL = 'public_total';
var PUBLIC_FILTERED = 'public_filtered';
var PUBLIC_FILTERED_TOTAL = 'public_filtered_total';
var PUBLIC_FILTER_OPTIONS = 'public_checked_options';
var PUBLIC_FILTER_DOMAIN = 'public_filter_domain';

var initBGPublicData = function(obj) {
	savePublic(obj);
	savePublicFiltered(obj);
	saveFilterDomain(obj);
};


var savePublic = function(obj) {
	localStorage[PUBLIC_DATA] = JSON.stringify(obj);
	localStorage[PUBLIC_TOTAL] = obj.length;
};
var savePublicFiltered = function(obj) {
	localStorage[PUBLIC_FILTERED] = JSON.stringify(obj);
	localStorage[PUBLIC_FILTERED_TOTAL] = obj.length;
};

var onlyUnique = function(value, index, self) {
	if (value === null || value === undefined || value === 'NA') return false;
	return self.indexOf(value) === index;
};

var saveFilterDomain = function(obj) {
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
	localStorage[PUBLIC_FILTER_DOMAIN] = JSON.stringify(filterDomain);
};

var getPublic = function() {
	return JSON.parse(localStorage[PUBLIC_DATA]);
};

var getCountOfPublic = function() {
	return localStorage[PUBLIC_TOTAL];
};

var getCountOfFilteredPublic = function() {
	return localStorage[PUBLIC_FILTERED_TOTAL];
};

var savePublicFilterOptions = function(obj) {
	localStorage[PUBLIC_FILTER_OPTIONS] = JSON.stringify(obj);
};

var getPublicFilterOptions = function() {
	return JSON.parse(localStorage[PUBLIC_FILTER_OPTIONS]);
};

var getPublicFilterDomain = function() {
	return JSON.parse(localStorage[PUBLIC_FILTER_DOMAIN]);
};

var filterPublicData = function(arr, checkeditems) {
	var filtered = [];
	//console.log(arr);
	console.log(checkeditems);
	// console.log(getPublicFilterDomain());

	arr.forEach(function(item) {
		var isOK = [];
		checkeditems.forEach(function(data) {
			var name = getNameOfDomain(data.domain); //성능을 위하여 제거 요망.
			// console.log(name,item[name],data.value);
			if (data.checked.indexOf(item[name]) > -1) { // OR 조건
				isOK.push(true);
			} else {
				isOK.push(false);
			}
		});
		if (isOK.indexOf(false) < 0) filtered.push(item); // And 조건
	});
	//TODO filtered를 localStorage에 넣는 구문
	console.log(filtered);
	return filtered;
};

var getNameOfDomain = function(value) {
	var domains = getPublicFilterDomain();
	var idx = value.charCodeAt(0) - 97;
	return domains[idx].name;
};
