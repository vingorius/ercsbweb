//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var getConnection = require('../routes/modules/mysql_connection');
var host = 'http://localhost:3000';

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
        zipcode: '324-133',
        address: '서울 이화여대',
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
        zipcode: '324-133',
        address: '서울 이화여대',
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
    describe('Remember = false test suit', function() {
        user.remember = false;
        var agent = request.agent(host);
        it('login ' + user.toString() + ' + 으로 로그인하여야 한다.', function(done) {
            agent
                .post('/login')
                .send(user)
                .expect(302) //Moved Temporarily
                .expect('Location', '/')
                .end(function(err, res) {
                    // console.log("1",agent.jar.getCookies());
                    done();
                });
        });
        it('login ' + user.toString() + ' admin 페이지에 접근할 수 있어야 한다.', function(done) {
            agent
                .get('/admin')
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

        it('logout이후에는  admin 페이지에 접근할 수 없어야 한다.', function(done) {
            agent
                .get('/admin')
                .expect(401) //Unauthorized
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
        it('login ' + user.toString() + ' admin 페이지에 접근할 수 있어야 한다.', function(done) {
            agent
                .get('/admin')
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    //console.log(res);
                    done();
                });
        });
        // it('logout이 정상적으로 이루어져야한다.', function(done) {
        //     agent
        //         .get('/logout')
        //         .expect(302) //Moved Temporarily
        //         .expect('Location', '/')
        //         .end(function(err, res) {
        //             if (err) return done(err);
        //             // console.log("3",agent.jar.getCookie());
        //             done()
        //         });
        // });
        it('다른 Agent로 로그인 없이 admin 페이지에 접근할 수 있어야 한다.', function(done) {
            request(host)
                .get('/admin')
                .set('Cookie', cookie)
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });


    /*
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
    */
});
