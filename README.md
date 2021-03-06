# Job Hoarder

![Node.js CI](https://github.com/connorgiles/job-hoarder/workflows/Node.js%20CI/badge.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/connorgiles/job-hoarder/badge.svg?branch=master)](https://coveralls.io/github/connorgiles/job-hoarder?branch=master) [![npm version](https://badge.fury.io/js/job-hoarder.svg)](https://badge.fury.io/js/job-hoarder)

One interface to access jobs posted on various job boards.

## Getting Started

### Installing

In order to install the package simply install it from the NPM registry.

Using npm:

```
npm install --save job-hoarder
```

Using yarn:

```
yarn add job-hoarder
```

### Usage

To use the library, simply import the desired client for your target job board.

```node
const { Lever } = require('job-hoarder');

const client = new Lever('wealthsimple');

// Get list of posted jobs
const jobs = client.getJobs();

/* EXPECTED RESULT
[{
    "id": "9a112f05-1fee-4f63-bddf-69d9cdde570f",
    "title": "W4A Account Manager",
    "datePosted": "2019-06-20T18:30:21.210Z",
    "jobLocation": "Toronto",
    "url": "https://jobs.lever.co/wealthsimple/9a112f05-1fee-4f63-bddf-69d9cdde570f",
    "description": "...", // Job description
    "department": "Business Teams - Wealthsimple for Advisors (W4A)"
  }]
*/

// Get details of a specific job
const job = client.getJob('9a112f05-1fee-4f63-bddf-69d9cdde570f');

/* EXPECTED RESULT
{
    "id": "9a112f05-1fee-4f63-bddf-69d9cdde570f",
    "title": "W4A Account Manager",
    "datePosted": "2019-06-20T18:30:21.210Z",
    "jobLocation": "Toronto",
    "url": "https://jobs.lever.co/wealthsimple/9a112f05-1fee-4f63-bddf-69d9cdde570f",
    "description": "...", // Job description
    "department": "Business Teams - Wealthsimple for Advisors (W4A)"
  }
*/
```

## Testing

To test the application simply run the test command.

```
npm test
```

In order to get a code coverage report and update coveralls with coverage details.

```
npm coveralls
```

## Supported Job Boards

- Greenhouse
- Lever
- Indeed
- JazzHR
  - JazzAPI
  - JazzScrape
- Workable

To request support for a new job board please open an issue with tag "requested board".

[View requested boards](https://github.com/connorgiles/job-hoarder/labels/requested%20board)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Connor Giles**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
