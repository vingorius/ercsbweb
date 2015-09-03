//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var getConnection = require('../routes/modules/mysql_connection');
var host = 'http://localhost';

describe('Login Test Suite', function() {
    var user = {
        username: 'test@gmail.com',
        password: 'test',
        remember: false,
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
    var wrong_user = {
        username: 'test@gmail.com',
        password: 'wrong',
        remember: false,
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

    it('DB에서 테스트할 사용자가 있으면 삭제한다.', function(done) {
        getConnection(function(connection) {
            connection.query('delete from ercsb_cdss.users where username = ?', [user.username], function(err, rows, fields) {
                if (err) assert(false, err.code); //throw err;
                done();
            });
        });
    });
    it('login 화면 패스(get)가 존재하여야 한다.', function(done) {
        //request(host)
        request(host)
            .get('/login')
            .expect(200, done);
    });
    it('register ' + user.toString() + ' 으로 사용자 등록이 되어야한다.', function(done) {
        request(host)
            .post('/register')
            .send(user)
            .expect(302) //Moved Temporarily
            .expect('Location', '/')
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    it('login ' + wrong_user.toString() + ' 이면 로그인 오류가 나야 한다.', function(done) {
        request(host)
            .post('/login')
            .send(wrong_user)
            .expect(302, done)
            .expect('Location', '/login'); // "Unauthorized"
    });

    it('DB에서 사용자를 Enable한다.', function(done) {
        getConnection(function(connection) {
            connection.query('update ercsb_cdss.users set enable = 1 where username = ?', [user.username], function(err, rows, fields) {
                if (err) assert(false, err.code); //throw err;
                done();
            });
        });
    });

    describe('Remember = false test suit', function() {
        user.remember = false;
        var agent = request.agent(host);
        it('login ' + user.toString() + '으로 로그인하여야 한다.', function(done) {
            agent
                .post('/login')
                .send(user)
                .expect(302) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    assert.equal(res.header.location,'/');
                    done();
                });
        });
        it('login ' + user.toString() + ' /menus/ 페이지에 접근할 수 있어야 한다.', function(done) {
            agent
                .get('/menus/')
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    // console.log("2",agent.jar.getCookie());
                    done();
                });
        });
        it('logout이 정상적으로 이루어져야한다.', function(done) {
            agent
                .get('/logout')
                .expect(302) //Moved Temporarily
                .expect('Location', '/')
                .end(function(err, res) {
                    if (err) return done(err);
                    // console.log("3",agent.jar.getCookie());
                    done();
                });
        });

        it('logout이후에는  /menus/ 페이지에 접근할 수 없어야 한다.', function(done) {
            agent
                .get('/menus/')
                .expect(302) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    // console.log("4",agent.jar.getCookie());
                    done();
                });
        });
    });
    describe('Remember = true test suit', function() {
        user.remember = true;
        var cookie;
        var agent = request.agent(host);
        it('login ' + user.toString() + ' + 으로 로그인하여야 한다.', function(done) {
            agent
                .post('/login')
                .send(user)
                .expect(302) //Moved Temporarily
                .expect('Location', '/')
                .end(function(err, res) {
                    cookie = res.headers['set-cookie'];
                    //console.log(res.headers['set-cookie']);
                    done();
                });
        });
        it('login ' + user.toString() + ' /menus/ 페이지에 접근할 수 있어야 한다.', function(done) {
            agent
                .get('/menus/')
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    //console.log(res);
                    done();
                });
        });
        it('login ' + user.toString() + ' /admin 페이지는 권한없음 오류가 나야한다.', function(done) {
            agent
                .get('/admin')
                .expect(401) //"Unauthorized"
                .end(function(err, res) {
                    if (err) return done(err);
                    //console.log(res);
                    done();
                });
        });
        it('다른 Agent로 로그인 없이 /menus/ 페이지에 접근할 수 있어야 한다.', function(done) {
            request(host)
                .get('/menus/')
                .set('Cookie', cookie)
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });
});
