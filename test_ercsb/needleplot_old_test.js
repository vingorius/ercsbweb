//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

describe('Needle Plot(OLD) Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/needleplot_old')
            .expect(200, done);
    });
    it('parameter가 없으면 transfer_object error code 1000', function(done) {
        request(host)
            .get('/rest/needleplot_old')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                //console.log(transfer_object.data.graph);
                assert.equal(1000, transfer_object.status);
                assert.equal('No parameter', transfer_object.message);
                done();
            });
    });
    it('Database에 해당 Gene이 없을 때 오류를 발생하여야 한다.', function(done) {
            request(host)
                .get('/rest/needleplot_old?gene=XXX')
                .end(function(err, res) {
                    if (err) return done(err);
                    var transfer_object = res.body;
                    //console.log(transfer_object.data.graph);
                    assert.equal(1001, transfer_object.status);
                    assert.equal('No Data Found', transfer_object.message);
                    done();
                });
        });
    //TODO
    //it('Database에 해당 Gene.graph가 없을 때 오류를 발생하여야 한다.', function(done) {
    //})
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/rest/needleplot_old?gene=EGFR')
            .expect('content-type',/json/,done);
    });
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/needleplot_old?gene=EGFR')
            //.field('gene','EGFR')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                //console.log(transfer_object.data.graph);
                assert.equal('OK', transfer_object.message);
                assert.equal('EGFR', transfer_object.data.name);
                assert.equal(1210, transfer_object.data.graph[0].length);
                assert.equal(77, transfer_object.data.sample_list.length);
                done();
            });
    });
});
