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
				assert.equal(6, data.length);
				assert.equal('luad', data[0].cancer_type);
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
			.get('/models/patient/getSampleVariantList?order=asc&limit=5&offset=0&sample_id=Sample3&cancer_type=luad&frequency=0&classification=All&cosmic=Y&filter_option=&driver=Y')
			.end(function(err, res) {
				if (err) return done(err);
				var data = res.body;
				assert.equal(9, data.length);
                assert.equal('luad', data[0].cancer_type);
                assert.equal('Sample3', data[0].sample_id);
                assert.equal(0, data[0].patientsOfPosition);
                assert.equal(543, data[0].cntOfFilteredPatient);
                assert.equal(14, data[0].patientsOfTranscript);
				done();
			});
	});
});
