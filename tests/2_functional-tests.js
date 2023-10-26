const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { getGoodPuzzles, badPuzzles } = require('./unit-test-data');
chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve with valid puzzle', () => {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0]
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'solution', 'response should return a solution');
                    assert.isTrue(res.body.solution === getGoodPuzzles()[1])
                    done();
                });
        });
    })

    suite('POST /api/solve missing puzzle string', () => {
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
            const errorMsg = "Required field missing"
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: ''
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
            const errorMsg = "Invalid characters in puzzle"
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: badPuzzles[2].str
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
            const errorMsg = "Expected puzzle to be 81 characters long"
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: badPuzzles[0].str
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
            const errorMsg = "Puzzle cannot be solved"
            chai.request(server)
                .post('/api/solve')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[10]
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        
    })

    suite('POST /api/check with valid fields', () => {
        test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0],
                    coordinate: 'A2',
                    value: '3'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'valid', 'response should return valid boolean');
                    assert.isTrue(res.body.valid)
                    done();
                });
        });
    })

    suite('POST /api/books with invalid fields', () => {

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
            const errorMsg = '["row"]'
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0],
                    coordinate: 'A2',
                    value: '4'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'valid', 'response should return valid boolean');
                    assert.property(res.body, 'conflict', 'response should return conflict array');
                    const isConflicts = JSON.stringify(res.body.conflict) === errorMsg
                    assert.isTrue(isConflicts, `Returned conflict should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            const errorMsg = '["column","region"]'
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0],
                    coordinate: 'A2',
                    value: '6'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'valid', 'response should return valid boolean');
                    assert.property(res.body, 'conflict', 'response should return conflict array');
                    const isConflicts = JSON.stringify(res.body.conflict) === errorMsg
                    assert.isTrue(isConflicts, `Returned conflict should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            const errorMsg = '["row","column","region"]'
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0],
                    coordinate: 'A1',
                    value: '3'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'valid', 'response should return valid boolean');
                    assert.property(res.body, 'conflict', 'response should return conflict array');
                    const isConflicts = JSON.stringify(res.body.conflict) === errorMsg
                    assert.isTrue(isConflicts, `Returned conflict should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
            const errorMsg = "Required field(s) missing"
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0],
                    coordinate: 'A1',
                    value: ''
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
            const errorMsg = "Invalid characters in puzzle"
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: badPuzzles[2].str,
                    coordinate: 'A1',
                    value: '3'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
            const errorMsg = "Expected puzzle to be 81 characters long"
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: badPuzzles[0].str,
                    coordinate: 'A1',
                    value: '3'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
            const errorMsg = "Invalid coordinate"
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0],
                    coordinate: 'Z1',
                    value: '3'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
            const errorMsg = "Invalid value"
            chai.request(server)
                .post('/api/check')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    puzzle: getGoodPuzzles()[0],
                    coordinate: 'A1',
                    value: 'a'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response should be an object');
                    assert.property(res.body, 'error', 'response should return an error');
                    assert.isTrue(res.body.error === errorMsg, `Returned Error should be equal to ${errorMsg}`)
                    done();
                });
        });
    })
});

// after(function() {
//   chai.request(server)
//     .get('/')
// });

teardown(function() {
    chai.request(server)
      .get('/')
  });