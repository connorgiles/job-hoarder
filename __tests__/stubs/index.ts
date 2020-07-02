import fs from 'fs';
import path from 'path';

export const loadStubs = (board: string) => {
  const testData = require('./' + board);
  if (testData.jobsResponsePage) {
    testData.jobsResponsePage = fs.readFileSync(path.join(__dirname, testData.jobsResponsePage));
  }
  if (testData.jobResponsePage) {
    testData.jobResponsePage = fs.readFileSync(path.join(__dirname, testData.jobResponsePage));
  }
  if (testData.jobParsed && testData.jobParsed.datePosted)
    testData.jobParsed.datePosted = new Date(testData.jobParsed.datePosted);
  if (testData.jobsParsed && testData.jobsParsed.length > 0) {
    testData.jobsParsed = testData.jobsParsed.map((j: any) => {
      j.datePosted = new Date(j.datePosted);
      return j;
    });
  }
  if (testData.applicationsParsed && testData.applicationsParsed.length > 0) {
    testData.applicationsParsed = testData.applicationsParsed.map((j: any) => {
      j.dateApplied = new Date(j.dateApplied);
      return j;
    });
  }
  return testData;
};
