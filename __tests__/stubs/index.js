function loadStubs(board) {
  const testData = require('./' + board);
  if (testData.jobParsed && testData.jobParsed.datePosted) testData.jobParsed.datePosted = new Date(testData.jobParsed.datePosted);
  if (testData.jobsParsed && testData.jobsParsed.length > 0) {
    testData.jobsParsed = testData.jobsParsed.map(j => {
      j.datePosted = new Date(j.datePosted);
      return j;
    });
  }
  if (testData.applicationsParsed && testData.applicationsParsed.length > 0) {
    testData.applicationsParsed = testData.applicationsParsed.map(j => {
      j.dateApplied = new Date(j.dateApplied);
      return j;
    });
  }
  return testData;
}

module.exports = {
  loadStubs
};
