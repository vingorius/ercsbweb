//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

describe('Co Mutation Plot for ERCSB Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/comutationplotForERCSB')
            .expect(200, done);
    });
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/rest/comutationplotForERCSB')
            .expect('content-type',/json/,done);
    });
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/comutationplotForERCSB')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal('OK', transfer_object.message);
                assert.equal(3860, transfer_object.data.mutation_list.length);
                assert.equal(59, transfer_object.data.gene_list.length);
                assert.equal(2, transfer_object.data.group_list.length);
                assert.equal(0, transfer_object.data.patient_list.length);
                done();
            });
    });
});
