//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var getConnection = require('../routes/modules/mysql_connection');
var host = 'http://localhost:3000';

describe('Profile Test Suite', function() {
    var user = {
        username: 'test@gmail.com',
        password: 'test',
        fullname: '김종호',
        gender: 'M',
        birth: '01/01/1970',
        mobile: '01047017956',
        country: 'South Korea (대한민국)',
        company_name: '다음소프트',
        company_address: '서울 한남동',
        company_position: '부장',
        toString: function() {
            return this.username + '/' + this.password;
        }
    };
    var cookie;
    var agent = request.agent(host);
    it('login ' + user.toString() + ' + 으로 로그인하여야 한다.', function(done) {
        agent.post('/login')
            .send(user)
            .expect(302) //Moved Temporarily
            .expect('Location', '/')
            .end(function(err, res) {
                cookie = res.headers['set-cookie'];
                //console.log(res.headers['set-cookie']);
                done();
            });
    });
    it('로그인을 했으면 profile 화면 패스(get)가 존재하여야 한다.', function(done) {
        //request(host)
        agent.get('/profile')
            .expect(200, done);
    });

    var daumsoft = '다음소프트';
    user.company_name = daumsoft + Math.random(); //임시 이름을 하나 만든다.
    it(user.toString() + ' 사용자 정보 중 회사명이 수정되어야한다.', function(done) {
        agent.post('/profile')
            .send(user)
            .expect(302) //Moved Temporarily
            .expect('Location', '/message')
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    it('수정된 회사 정보가 DB에 정확히 반영되어 있어야한다.', function(done) {
        getConnection(function(connection) {
            connection.query('select company_name from ercsb_cdss.users where username = ?', [user.username], function(err, rows, fields) {
                if (err) assert(false, err.code); //throw err;
                assert.equal(user.company_name, rows[0].company_name);
                done();
            });
        });
    });
    it('회사명을 원래대로 수정하는 요청(POST, profile)이 제대로 작동하여야한다.', function(done) {
        user.company_name = daumsoft;
        agent.post('/profile')
            .send(user)
            .expect(302) //Moved Temporarily
            .expect('Location', '/message')
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});
