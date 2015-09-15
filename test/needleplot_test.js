//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

describe('Needle Plot Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/needleplot')
            .expect(200, done);
    });
    it('parameter가 없으면 transfer_object error code 1000', function(done) {
        request(host)
            .get('/rest/needleplot')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                //console.log(transfer_object.data.graph);
                assert.equal(1000, transfer_object.status);
                assert.equal('No parameter', transfer_object.message);
                done();
            });
    });
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/rest/needleplot?cancer_type=luad&sample_id=Pat99&gene=EGFR&transcript=ENST00000275493')
            .expect('content-type',/json/,done);
    });
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/needleplot?cancer_type=luad&sample_id=Pat99&gene=EGFR&transcript=ENST00000275493')
            //.field('gene','EGFR')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                // console.log(transfer_object.data.graph);
                assert.equal('OK', transfer_object.message);
                assert.equal('EGFR', transfer_object.data.name);
                assert.equal(91, transfer_object.data.public_list.length);
                assert.equal(2, transfer_object.data.patient_list.length);
                assert.equal(5, transfer_object.data.graph.length);
                done();
            });
    });
});
