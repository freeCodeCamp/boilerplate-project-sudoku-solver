const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

const validPuzzle = puzzlesAndSolutions[0][0];
const solution = puzzlesAndSolutions[0][1];

const tooShort = validPuzzle.slice(1);
const invalidChar = tooShort.concat('x');
const unsolvable = "?";

suite('Functional Tests', () => {

  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, solution);
        done();
      })
  })

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      })
  })

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidChar })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
    })
  })

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: tooShort })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
    })
  })

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    const invalidPuzzle = "269..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
    })
  })

  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: "A1", value: "7" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      })
  })

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: "B2", value: "1" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.conflict.length, 1);
        done();
      })
  })

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: "B2", value: "6" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        done();
      })
  })

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: "B2", value: "9" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
      })
  })

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, value: "1" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      })
  })

  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: invalidChar, coordinate: "A1", value: "7" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      })
  })

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: tooShort, coordinate: "C1", value: "6" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
    })
  })

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: "J1", value: "7" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      })
  })

  test("Check a puzzle placement with invalid placement value: POST request to / api / check", function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: "A1", value: "0" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      })
  })


});
