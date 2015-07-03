//var express = require('express');
var request = require('supertest');
var assert = require('assert');
var host = 'http://localhost:3000';

describe('Co Mutation Plot Test Suite', function() {
    it('path가 존재하여야 한다.', function(done) {
        request(host)
            .get('/rest/comutationplot')
            .expect(200, done);
    })
    it('Content Type이 application/json 여야한다.', function(done) {
        request(host)
            .get('/rest/comutationplot')
            .expect('content-type',/json/,done)
    })
    it('JSON Data Format Check', function(done) {
        request(host)
            .get('/rest/comutationplot')
            .end(function(err, res) {
                if (err) return done(err);
                var transfer_object = res.body;
                assert.equal('OK', transfer_object.message)
                assert.equal(98, transfer_object.data.symbol_list.length)
                assert.equal('ANKRD20A1', transfer_object.data.symbol_list[0].name)
                assert.equal(0.0990834, transfer_object.data.symbol_list[0].p)
                assert.equal(5, transfer_object.data.group_list.length)
                assert.equal('subtype1', transfer_object.data.group_list[0])
                assert.equal(98, transfer_object.data.sample_list.length)
                assert.equal('Pat08', transfer_object.data.sample_list[5].name)
                assert.equal(5, transfer_object.data.sample_list[5].gene_list.length)
                assert.equal("FOXI1", transfer_object.data.sample_list[5].gene_list[0].name)
                assert.equal(2, transfer_object.data.sample_list[5].gene_list[0].aberration_list.length)
                assert.equal("Missense_Mutation", transfer_object.data.sample_list[5].gene_list[0].aberration_list[0].value)
                done()
            })
    })
})
