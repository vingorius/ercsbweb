//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost:3000';

describe('Login Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .post('/manager/login')
            .expect(200, done);
    })
    it('userid,password 가 들어오지 않으면 100번,EPARAM 발생.', function(done) {
        request(host)
            .post('/manager/login')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal(100, transfer_object.status)
                assert.equal('EPARAM', transfer_object.message)
                done()
            });
    })
    it('userid 만 들어와도 100번,EPARAM 발생.', function(done) {
        request(host)
            .post('/manager/login')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal(100, transfer_object.status)
                assert.equal('EPARAM', transfer_object.message)
                done()
            });
    })
    it('존재하지 않는 사용자인 경우 101번,ENOUSR 오류 발생.', function(done) {
        request(host)
            .post('/manager/login')
            .send({
                userid: 'xxx',
                password: 'hello'
            })
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal(101, transfer_object.status)
                assert.equal('ENOUSR', transfer_object.message)
                done()
            });
    })
    it('패스워드가 틀린경우 경우 102번,EINPWD 오류 발생.', function(done) {
        request(host)
            .post('/manager/login')
            .send({
                userid: 'vingorius',
                password: 'hello'
            })
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal(102, transfer_object.status)
                assert.equal('EINPWD', transfer_object.message)
                done()
            });
    })
    it('패스워드가 일치하면 0번,OK 발생. group 리턴해야한다', function(done) {
        request(host)
            .post('/manager/login')
            .send({
                userid: 'vingorius',
                password: 'vingorius'
            })
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal(0, transfer_object.status)
                assert.equal('OK', transfer_object.message)
                assert.equal('admin', transfer_object.user.group)
                done()
            });
    })
})
