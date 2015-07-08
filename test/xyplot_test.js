//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost:3000';

describe('Xy Plot Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/xyplot')
            .expect(200, done);
    });
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/rest/xyplot')
            .expect('content-type',/json/,done);
    });
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/xyplot')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal('OK', transfer_object.message);
                assert.equal('DrGap Plot', transfer_object.data.title);
                assert.equal(3492, transfer_object.data.plot_list.length);
                assert.equal(-7.392740954531198, transfer_object.data.x_axis.start);
                assert.equal(128.5368069944998, transfer_object.data.y_axis.end);
                done();
            });
    });
});
