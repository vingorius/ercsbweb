//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost:3000';

describe('Ma Plot Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/chart/maplot')
            .expect(200, done);
    })
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/chart/maplot')
            .expect('content-type',/json/,done)
    })
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/chart/maplot')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal('OK', transfer_object.message)
                assert.equal(20429, transfer_object.data.plot_list.length)
                assert.equal('DNAJC6|9829', transfer_object.data.plot_list[0].title)
                done()
            })
    })
})
