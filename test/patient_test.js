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
				assert.equal(10, data.length);
				assert.equal('luad', data[0].cancer_type);
				assert.equal(279, data[0].variants_cnt);
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
			.get('/models/patient/getSampleVariantList?sample_id=Pat1099&cancer_type=luad&frequency=0&classification=All&cosmic=Y&filter_option=1')
			.end(function(err, res) {
				if (err) return done(err);
				var data = res.body;
				assert.equal(4, data.length);
                assert.equal('luad', data[0].cancer_type);
                assert.equal('Pat1099', data[0].sample_id);
                assert.equal(2, data[0].patientsOfPosition);
                assert.equal(76, data[0].cntOfFilteredPatient);
                assert.equal(12, data[0].patientsOfTranscript);
				done();
			});
	});
});
