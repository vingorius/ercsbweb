//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var getConnection = require('../routes/modules/mysql_connection');
var host = 'http://localhost';

describe('Profile Test Suite', function() {
    var user = {
        id: 114,
        username: 'test2@gmail.com',
        password: 'test2',
    };
    var agent = request.agent(host);
    it('login ' + user.username + ' + 으로 로그인하여야 한다.', function(done) {
        agent.post('/login')
            .send(user)
            .expect(302) //Moved Temporarily
            .end(function(err, res) {
                if (err) return done(err);
                assert.equal(res.header.location,'/');
                done();
            });
    });

    it('로그인을 했으면 /models/users/profile 화면 패스(get)가 존재하여야 한다.', function(done) {
        agent.get('/models/users/profile')
            .expect(200, done);
    });

    var new_company_name = '다음소프트' + Math.random(); //임시 이름을 하나 만든다.
    var data = {
        pk: user.id,
        name: 'company_name',
        value: new_company_name
    };

    it('사용자 정보 중 회사명이 수정되어야한다.', function(done) {
        agent.put('/models/users')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('수정된 회사 정보가 DB에 정확히 반영되어 있어야한다.', function(done) {
        getConnection(function(connection) {
            connection.query('select company_name from ercsb_cdss.users where username = ?', [user.username], function(err, rows, fields) {
                if (err) assert(false, err.code); //throw err;
                assert.equal(new_company_name, rows[0].company_name);
                done();
            });
        });
    });
    it('회사명을 원래대로 수정하는 요청(Put, /models/users)이 제대로 작동하여야한다.', function(done) {
        data.value = '다음소프트';
        agent.put('/models/users')
            .send(data)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});
