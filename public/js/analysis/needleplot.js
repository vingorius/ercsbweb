window.tsEvents = {
	'click #transcript': function (e, value, row, index) {
		alert('You click like action, row: ' + JSON.stringify(row));
		//drawNeedleplot(cancer_type,sample_id,gene,transcript);
	}
};
