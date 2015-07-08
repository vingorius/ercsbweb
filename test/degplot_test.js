//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost:3000';

describe('DEG Plot Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/degplot')
            .expect(200, done);
    });
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/rest/degplot')
            .expect('content-type',/json/,done);
    });
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/degplot')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal('OK', transfer_object.message);
                assert.equal(48, transfer_object.data.pathway_list.length);
                assert.equal("Cellular Processes", transfer_object.data.pathway_list[0].pathway_a);
                assert.equal(3.4138753844, transfer_object.data.pathway_list[0].si_down_log_p);
                done();
            });
    });
});
