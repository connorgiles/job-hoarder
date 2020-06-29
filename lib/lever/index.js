"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = __importDefault(require("./parser"));
var axios_1 = __importDefault(require("axios"));
var Lever = /** @class */ (function () {
    function Lever(params) {
        // Allow string paramater to resolve
        if (typeof params === 'string') {
            params = {
                companyId: params,
            };
        }
        // Check valid params
        if (!params || !params.companyId)
            throw new Error('Client must have a company Id');
        this.companyId = params.companyId;
        this.parser = new parser_1.default();
    }
    /**
     * Gets jobs from job board
     * @returns {array} List of jobs
     */
    Lever.prototype.getJobs = function () {
        return axios_1.default
            .get("https://api.lever.co/v0/postings/" + this.companyId + "?mode=json")
            .then(function (res) { return res.data; })
            .then(this.parser.parseJobs);
    };
    /**
     * Gets job details from job board
     * @param {string} id Id of job to retrieve
     * @returns {object} Job assigned to Id
     */
    Lever.prototype.getJob = function (id) {
        return axios_1.default
            .get("https://api.lever.co/v0/postings/" + this.companyId + "/" + id)
            .then(function (res) { return res.data; })
            .then(this.parser.parseJob);
    };
    return Lever;
}());
exports.default = Lever;
