"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var ApiCache = /** @class */ (function () {
    function ApiCache(apiEndpoint, httpClient) {
        this.httpClient = httpClient;
        this.ok = false;
        this.requested = false;
        this.retrieved = false;
        this.apiEndpoint = apiEndpoint;
        this.payload = new rxjs_1.ReplaySubject(1);
    }
    ApiCache.prototype.getData = function () {
        var _this = this;
        if (this.ok === false) {
            //TODO: if any errors have ocurred, we need to create a new payload stream
        }
        //if the resource has not been requested yet, request it.
        if (!this.requested) {
            this.httpClient.get(this.apiEndpoint)
                .subscribe(function (response) {
                _this.retrieved = true; //the resource has been successfully retrieved
                _this.payload.next(response);
            }, function (error) {
                //TODO: handle this error better
                console.error(error);
                _this.ok = false;
            });
            this.requested = true; //we have made the request
        }
        return this.payload;
    };
    return ApiCache;
}());
exports.ApiCache = ApiCache;
