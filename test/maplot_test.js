//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost:3000';

describe('Ma Plot Test Suite', function() {
    describe('Ma Plot Test', function() {
        it('path가 존재하여야 한다.', function(done) {
            request(host)
                .get('/maplot')
                .expect(200, done);
        })
        it('Content Type이 application/json 여야한다.', function(done) {
            request(host)
                .get('/maplot')
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal('application/json; charset=utf-8', res.headers['content-type'])
                    done()
                })
        })
        it('JSON Data Format Check', function(done) {
            request(host)
                .get('/maplot')
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal('OK', res.body.message)
                    assert.equal(20429, res.body.plot_list.length)
                    assert.equal('DNAJC6|9829', res.body.plot_list[0].title)
                    done()
                })
        })
    })
})
