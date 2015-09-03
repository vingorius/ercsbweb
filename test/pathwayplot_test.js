//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

describe('Pathway Plot Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/pathwayplot')
            .expect(200, done);
    });
    it('parameter가 없으면 transfer_object error code 1000', function(done) {
        request(host)
            .get('/rest/pathwayplot')
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
            .get('/rest/pathwayplot?cancer_type=luad&sample_id=Pat99&seq=1')
            .expect('content-type',/json/,done);
    });
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/pathwayplot?cancer_type=luad&sample_id=Pat99&seq=1')
            //.field('gene','EGFR')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                //console.log(transfer_object.data.graph);
                assert.equal('OK', transfer_object.message);
                assert.equal('luad', transfer_object.data.cancer_type);
                assert.equal(32, transfer_object.data.pathway_list.length);
                assert.equal(2, transfer_object.data.gene_list.length);
                done();
            });
    });
});
