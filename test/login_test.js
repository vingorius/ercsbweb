//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var pool = require('../routes/modules/mysql_connection');
var host = 'http://localhost:3000';

describe('Login Test Suite', function() {
    var user = {
        username: 'test@gmail.com',
        password: 'test',
        remember: false,
        toString: function() {
            return this.username + '/' + this.password;
        }
    };
    var wrong_user = {
        username: 'test@gmail.com',
        password: 'wrong',
        remember: false,
        toString: function() {
            return this.username + '/' + this.password;
        }
    };

    it('DB에서 테스트할 사용자가 있으면 삭제한다.', function(done) {
        pool.getConnection(function(err, connection) {
            connection.query('delete from users where username = ?', [user.username], function(err, rows, fields) {
                connection.release();
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
                done()
            });
    });
    it('login ' + wrong_user.toString() + ' 이면 로그인 오류가 나야 한다.', function(done) {
        request(host)
            .post('/login')
            .send(wrong_user)
            .expect(302, done)
            .expect('Location', '/login'); // "Unauthorized"
    });
    /*
    it('login ' + user.toString() + ' 으로 로그인하여야 한다.', function(done) {
        var req = request(host)
            .post('/login')
            .send(user)
            .expect(302) //Moved Temporarily
            .expect('Location', '/')
            .expect('set-cookie', /connect.sid=/)
            .end(function(err, res) {
                if (err) return done(err);
                cookie = res.headers['set-cookie'];
                //console.log("Test login:",res);
                done()
            });
    });
    it('login ' + user.toString() + ' restricted 페이지에 접근할 수 있어야 한다.', function(done) {
        var req = request(host)
            .get('/restricted')
            .set('Cookie', cookie)
            .expect(200) //Moved Temporarily
            .end(function(err, res) {
                if (err) return done(err);
                done()
            });
    });
    //제대로 테스트가 되려면 Logout 후에 restricted path에 접근하지 못하는 코드가 밑에 있어야 된다.
    it('logout이 정상적으로 이루어져야한다.', function(done) {
        var req = request(host)
            .get('/logout')
            .set('Cookie', cookie)
            .expect(302) //Moved Temporarily
            .expect('Location', '/')
            .expect('set-cookie', /connect.sid=/)
            .end(function(err, res) {
                if (err) return done(err);
                cookie = res.headers['set-cookie'];
                //console.log("Test logout:",res);
                done()
            });
    });
    it('logout이후에는  restricted 페이지에 접근할 수 없어야 한다.', function(done) {
        var req = request(host)
            .get('/restricted')
            .set('Cookie', cookie)
            .expect(302) //Moved Temporarily
            .end(function(err, res) {
                if (err) return done(err);
                done()
            });
    });
    */
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
        it('login ' + user.toString() + ' restricted 페이지에 접근할 수 있어야 한다.', function(done) {
            agent
                .get('/restricted')
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    // console.log("2",agent.jar.getCookie());
                    done()
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
                    done()
                });
        });

        it('logout이후에는  restricted 페이지에 접근할 수 없어야 한다.', function(done) {
            agent
                .get('/restricted')
                .expect(302) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    // console.log("4",agent.jar.getCookie());
                    done()
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
        it('login ' + user.toString() + ' restricted 페이지에 접근할 수 있어야 한다.', function(done) {
            agent
                .get('/restricted')
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    //console.log(res);
                    done()
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
        it('다른 Agent로 로그인 없이 restricted 페이지에 접근할 수 있어야 한다.', function(done) {
            request(host)
                .get('/restricted')
                .set('Cookie', cookie)
                .expect(200) //Moved Temporarily
                .end(function(err, res) {
                    if (err) return done(err);
                    console.log(res.headers['set-cookie']);
                    done()
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
})
