var transfer_object = {};

transfer_object.default = function() {
	return {
		status: 0,
		message: 'OK',
	};
};

transfer_object.noparameter = function() {
	return {
		status: 1000,
		message: 'No parameter',
	};
};
transfer_object.nodatafound = function() {
	return {
		status: 1001,
		message: 'No Data Found',
	};
};
module.exports = transfer_object;
