//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost';

describe('Tumorportal CMP Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/tumorportal_cmp')
            .expect(200, done);
    });
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/rest/tumorportal_cmp')
            .expect('content-type',/json/,done);
    });
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/tumorportal_cmp')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal('OK', transfer_object.message);
                assert.equal(39, transfer_object.data.symbol_list.length);
                assert.equal('PIK3CA', transfer_object.data.symbol_list[0].name);
                assert.equal(1.11022e-16, transfer_object.data.symbol_list[0].p);
                assert.equal(1, transfer_object.data.group_list.length);
                assert.equal('group', transfer_object.data.group_list[0]);
                assert.equal(721, transfer_object.data.sample_list.length);
                assert.equal('TCGA-EW-A1P5', transfer_object.data.sample_list[1].name);
                assert.equal(2, transfer_object.data.sample_list[1].gene_list.length);
                assert.equal("PIK3CA", transfer_object.data.sample_list[1].gene_list[0].name);
                assert.equal(2, transfer_object.data.sample_list[1].gene_list[0].aberration_list.length);
                assert.equal("FrameShiftIns: - --> G", transfer_object.data.sample_list[1].gene_list[0].aberration_list[0].value);
                done();
            });
    });
});
