"use strict";
// DO NOT EDIT THIS FILE
// This file has been generated by gen-api-models
// tslint:disable:max-union-size
// tslint:disable:no-identical-functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerInfoDefaultDecoder = exports.getServerInfoDecoder = exports.getServerInfoDefaultResponses = void 0;
const r = require("italia-ts-commons/lib/requests");
const ServerInfo_1 = require("./ServerInfo");
exports.getServerInfoDefaultResponses = {
    200: ServerInfo_1.ServerInfo
};
function getServerInfoDecoder(overrideTypes = {}) {
    const isDecoder = (d) => typeof d["_A"] !== "undefined";
    const type = Object.assign(Object.assign({}, exports.getServerInfoDefaultResponses), (isDecoder(overrideTypes) ? { 200: overrideTypes } : overrideTypes));
    const d200 = (type[200].name === "undefined"
        ? r.constantResponseDecoder(200, undefined)
        : r.ioResponseDecoder(200, type[200]));
    return d200;
}
exports.getServerInfoDecoder = getServerInfoDecoder;
// Decodes the success response with the type defined in the specs
exports.getServerInfoDefaultDecoder = () => getServerInfoDecoder();
//# sourceMappingURL=requestTypes.js.map