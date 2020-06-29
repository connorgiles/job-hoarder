"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var LeverParser = /** @class */ (function () {
    function LeverParser() {
        var _this = this;
        /**
         * Build description from lever job
         * @param {object} job Job to build description from
         * @returns {string} Job description
         */
        this.parseDescription = function (_a) {
            var desc = _a.desc, lists = _a.lists, additional = _a.additional;
            var description = '';
            description += desc;
            lists.forEach(function (l) {
                description += "<h3>" + l.text + "</h3>";
                description += "<ul>" + l.content + "</ul>";
            });
            description += additional;
            return description;
        };
        /**
         * Parse jobs from request result
         * @param {string} data String of jobs
         * @returns {array} List of parsed jobs
         */
        this.parseJobs = function (data) {
            if (!data)
                throw new Error('No jobs to parse');
            var jobs = utils_1.ensureJSON(data);
            return jobs.map(_this.parseJob);
        };
        /**
         * Parses job from request result
         * @param {string} data String of job result
         * @returns {object} Object of parsed job
         */
        this.parseJob = function (data) {
            if (!data)
                throw new Error('No job to parse');
            data = utils_1.ensureJSON(data);
            var id = data.id, title = data.text, url = data.hostedUrl, createdAt = data.createdAt, _a = data.categories, jobLocation = _a.location, dep = _a.department, team = _a.team, desc = data.description, lists = data.lists, additional = data.additional;
            var datePosted = new Date(createdAt);
            var department = [dep, team].filter(function (a) { return a; }).join(' - ');
            var description = _this.parseDescription({
                desc: desc,
                lists: lists,
                additional: additional,
            });
            return {
                id: id,
                url: url,
                title: title,
                jobLocation: jobLocation,
                datePosted: datePosted,
                department: department,
                description: description,
            };
        };
    }
    return LeverParser;
}());
exports.default = LeverParser;
