var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

var user = {
    username: 'test@gmail.com',
    password: 'test',
    remember: true,
};
describe('서비스테스트', function() {
    var agent = request.agent(host);
    it('login ' + user.toString() + ' + 으로 로그인하여야 한다.', function(done) {
        agent
            .post('/login')
            .send(user)
            .expect(302) //Moved Temporarily
            .expect('Location', '/')
            .end(function(err, res) {
                done();
            });
    });
    it('Analysis >', function(done) {
        agent
            .get('/models/patient/getSampleList')
            .expect(200)
            .end(function(err, res) {
                var data = res.body;
                assert.equal(true, Array.isArray(data));
                assert.equal(true, data.length > 1);
                done();
            });
    });
    it('Analysis > Summary', function(done) {
        agent
            .get('/menus/analysis/summary')
            .expect(200)
            .end(function(err, res) {
                var data = res;
                done();
            });
    });
    it('Analysis > Variants', function(done) {
        agent
            .get('/models/patient/getSampleVariantList?sample_id=Sample3&cancer_type=luad&frequency=0&classification=All&cosmic=Y&filter_option=&driver=Y')
            .expect(200)
            .end(function(err, res) {
                var data = res.body;
                // console.log(data);
                assert.equal(true, Array.isArray(data));
                assert.equal(9, data.length);
                done();
            });
    });
    it('Analysis > Theraphies', function(done) {
        agent
            .get('/models/drug/getDrugListByPatient?cancer_type=luad&sample_id=Sample3')
            .expect(200)
            .end(function(err, res) {
                var data = res.body;
                assert.equal(true, Array.isArray(data));
                assert.equal(46, data.length);
                done();
            });
    });
    it('Analysis > Theraphies(2)', function(done) {
        agent
            .get('/models/drug/getDrugListByCancer?cancer_type=luad&sample_id=Sample3')
            .expect(200)
            .end(function(err, res) {
                var data = res.body;
                assert.equal(true, Array.isArray(data));
                assert.equal(213, data.length);
                done();
            });
    });
    it('Analysis > Cohort Selection', function(done) {
        agent
            .get('/models/patient/bg_filtered_public?cancer_type=luad&filter_option=1')
            .expect(200)
            .end(function(err, res) {
                var data = res.body;
                // console.log(data);
                assert.equal(76, data);
                done();
            });
    });
});
