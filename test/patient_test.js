//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

describe('Patient Test Suite', function() {
    it('getSampleList JSON Data Format Check', function(done) {
		request(host)
			.get('/models/patient/getSampleList')
			.end(function(err, res) {
				if (err) return done(err);
				var data = res.body;
				assert.equal(71, data.length);
				assert.equal('luad', data[0].cancer_type);
				assert.equal(5, data[0].cnt);
				done();
			});
	});
    it('getSampleVariantList Request Parameter Check', function(done) {
		request(host)
			.get('/models/patient/getSampleVariantList?sample_id=Pat99&cancer_type=luad&frequency=0&classification=All') //&cosmic=Y ')
            .expect(400, done);
	});
    it('getSampleVariantList JSON Data Format Check', function(done) {
		request(host)
			.get('/models/patient/getSampleVariantList?sample_id=Pat99&cancer_type=luad&frequency=0&classification=Missense_Mutation%2CNonstop_Mutation%2CFrame_Shift_Ins%2CFrame_Shift_Del&&cosmic=Y ')
			.end(function(err, res) {
				if (err) return done(err);
				var data = res.body;
				assert.equal(4, data.length);
                assert.equal('luad', data[0].cancer_type);
                assert.equal('Pat99', data[0].sample_id);
				done();
			});
	});
});
