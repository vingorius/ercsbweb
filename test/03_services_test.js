var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

var user = {
    username: 'test@gmail.com',
    password: 'test',
};
var cancer_type = 'luad';
var sample_id = 'Sample3';

describe('서비스테스트', function() {
    var agent = request.agent(host);
    it('login ' + user.toString() + ' + 으로 로그인하여야 한다.', function(done) {
        agent.post('/login')
            .send(user)
            .expect(302) //Moved Temporarily
            .expect('Location', '/')
            .end(function(err, res) {
                if (err) return done(err); // 이부분이 빠지만, 위 expect 에러를 확인하지 못한다.
                done();
            });
    });

    it('Analysis > : should redirect to summary', function(done) {
        agent.get('/menus/analysis/first?cancer_type=' + cancer_type + '&sample_id=' + sample_id)
            .expect(302)
            .expect('Location', 'summary')
            .expect('Content-Type', /text\/plain/)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Analysis > : getSampleList', function(done) {
        agent.get('/models/patient/getSampleList')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                var data = res.body;
                assert.equal(true, Array.isArray(data));
                assert.equal(true, data.length > 1);
                done();
            });
    });

    it('Analysis > Summary', function(done) {
        agent.get('/menus/analysis/summary')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Analysis > Variants', function(done) {
        agent.get('/models/patient/getSampleVariantList?cancer_type=' + cancer_type + '&sample_id=' + sample_id + '&frequency=0&classification=All&cosmic=Y&filter_option=&driver=Y')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                var data = res.body;
                // console.log(data);
                assert.equal(true, Array.isArray(data));
                assert.equal(9, data.length);
                done();
            });
    });

    it('Analysis > Variants : needleplot: JSON Data Check', function(done) {
        agent.get('/rest/needleplot?cancer_type=' + cancer_type + '&sample_id=' + sample_id + '&gene=ABL1&transcript=ENST00000318560&classification=All&filter=')
            .expect(200)
            .expect('content-type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                // console.log(transfer_object.data.graph);
                assert.equal('OK', transfer_object.message);
                assert.equal('ABL1', transfer_object.data.name);
                assert.equal(17, transfer_object.data.public_list.length);
                assert.equal(1, transfer_object.data.patient_list.length);
                assert.equal(4, transfer_object.data.graph.length);
                done();
            });
    });

    it('Analysis > Pathways : pathwayplot: JSON Data Check', function(done) {
        agent.get('/rest/pathwayplot?cancer_type=' + cancer_type + '&sample_id=' + sample_id + '&filter=')
            .expect(200)
            .expect('content-type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                //console.log(transfer_object.data.graph);
                assert.equal('OK', transfer_object.message);
                assert.equal('luad', transfer_object.data.cancer_type);
                assert.equal(44, transfer_object.data.pathway_list.length);
                assert.equal(5, transfer_object.data.gene_list.length);
                done();
            });
    });

    it('Analysis > Theraphies : getDrugListByPatient: JSON Data Check', function(done) {
        agent.get('/models/drug/getDrugListByPatient?cancer_type=' + cancer_type + '&sample_id=' + sample_id)
            .expect(200)
            .expect('content-type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                var data = res.body;
                assert.equal(true, Array.isArray(data));
                assert.equal(46, data.length);
                done();
            });
    });

    it('Analysis > Theraphies : getDrugListByCancer: JSON Data Check', function(done) {
        agent.get('/models/drug/getDrugListByCancer?cancer_type=' + cancer_type + '&sample_id=' + sample_id)
            .expect(200)
            .expect('content-type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                var data = res.body;
                assert.equal(true, Array.isArray(data));
                assert.equal(213, data.length);
                done();
            });
    });

    it('Analysis > Cohort Selection', function(done) {
        agent.get('/models/patient/bg_filtered_public?cancer_type=' + cancer_type + '&filter_option=1')
            .expect(200)
            .expect('content-type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                var data = res.body;
                // console.log(data);
                assert.equal(76, data);
                done();
            });
    });
});
