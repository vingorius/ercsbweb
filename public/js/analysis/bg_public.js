var COUNT = 'COUNT';
var FILTERED_COUNT = 'FILTERED_COUNT';
var FILTER_OPTION = 'FILTER_OPTION';

var bg_public = {
	init: function(cnt) {
		this.clear();
		this.setCount(cnt);
		this.setFilteredCount(cnt);
	},
	clear: function() {
		localStorage.clear();
	},

	setCount: function(cnt){
		localStorage[COUNT] = cnt;
	},

	getCount: function() {
		return localStorage[COUNT] || 0;
	},

	setFilteredCount: function(cnt){
		localStorage[FILTERED_COUNT] = cnt;
	},

	getFilteredCount: function() {
		return localStorage[FILTERED_COUNT] || 0;
	},

	getMenuCountText: function(){
		// return '(' + this.getFilteredCount() + '/' + this.getCount() + ')';
		return  this.getFilteredCount() + '/' + this.getCount();
	},

	setFilterOption: function(obj) {
		localStorage[FILTER_OPTION] = JSON.stringify(obj);
	},

	getFilterOption: function() {
		return JSON.parse(localStorage[FILTER_OPTION] ||'[]');
	},
};
