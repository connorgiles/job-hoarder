const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

const ats = require('../lib/ats/greenhouse');
const parser = require('../lib/ats/greenhouse/parser');

describe('Greenhouse', function () {

  it('should fail to create instance without company', function () {
    should.Throw(() => new ats(), Error);
  });

  it('should create valid instance', function () {
    should.not.Throw(() => new ats('test'));
  });

  it('should parse valid job', function () {
    const testJob = '{"test": {"test2": "test3"}}';
    const testJobResult = {
      test: {
        test2: 'test3'
      }
    };
    expect(parser.parseJob(testJob)).to.deep.equal(testJobResult);
  });

});
