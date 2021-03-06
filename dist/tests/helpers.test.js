"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLASS = exports.NONE = exports.BOOL = exports.NUM = exports.run = exports.typeCheck = void 0;
var import_object_test_1 = require("./import-object.test");
var parser_1 = require("../parser");
var compiler_1 = require("../compiler");
var wabt_1 = __importDefault(require("wabt"));
var tc_1 = require("../tc");
// Modify typeCheck to return a `Type` as we have specified below
function typeCheck(source) {
    var parsed = parser_1.parse(source);
    var program = parser_1.toprogram(parsed);
    var typedprogram = tc_1.typeCheckProgram(program);
    if (typedprogram.stmts.length == 0) {
        return "none";
    }
    else {
        return typedprogram.stmts[typedprogram.stmts.length - 1].a;
    }
}
exports.typeCheck = typeCheck;
// Modify run to use `importObject` (imported above) to use for printing
function run(source) {
    return __awaiter(this, void 0, void 0, function () {
        var program, parsed, returnType, returnExpr, lastExpr, compiled, wasmSource, wabtApi, parsedWat, binary, memory, importObjectPlus, wasmModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = source;
                    parsed = parser_1.parse(program);
                    returnType = "";
                    returnExpr = "";
                    lastExpr = parsed[parsed.length - 1];
                    if (lastExpr.tag === "expr") {
                        returnType = "(result i32)";
                        returnExpr = "(local.get $scratch)";
                    }
                    compiled = compiler_1.compile(program);
                    wasmSource = "(module\n    (import \"mem\" \"heap\" (memory 1))\n    (func $print_num (import \"imports\" \"print_num\") (param i32) (result i32))\n    (func $print_none (import \"imports\" \"print_none\") (param i32) (result i32))\n    (func $print_bool (import \"imports\" \"print_bool\") (param i32) (result i32))\n    (func $Checkinit (import \"imports\" \"Checkinit\") (param i32) (result i32))\n    (func $abs (import \"imports\" \"abs\") (param i32) (result i32))\n    (func $max (import \"imports\" \"max\") (param i32 i32) (result i32))\n    (func $min (import \"imports\" \"min\") (param i32 i32) (result i32))\n    (func $pow (import \"imports\" \"pow\") (param i32 i32) (result i32))\n    " + compiled.funcdef + "\n    " + compiled.varinits + "\n    " + compiled.methoddef + "\n    (func (export \"_start\") " + returnType + "\n      (local $scratch i32 )\n      " + compiled.wasmSource + "\n      " + returnExpr + "\n    )\n  )";
                    return [4 /*yield*/, wabt_1.default()];
                case 1:
                    wabtApi = _a.sent();
                    parsedWat = wabtApi.parseWat("example", wasmSource);
                    binary = parsedWat.toBinary({});
                    memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });
                    importObjectPlus = import_object_test_1.importObject;
                    importObjectPlus.mem = { heap: memory };
                    importObjectPlus.imports.Checkinit = function (obj) {
                        if (obj == 0) {
                            throw new Error("RUNTIME ERROR: object must be initialized first");
                        }
                        return obj;
                    };
                    return [4 /*yield*/, WebAssembly.instantiate(binary.buffer, importObjectPlus)];
                case 2:
                    wasmModule = _a.sent();
                    wasmModule.instance.exports._start();
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
exports.NUM = "int";
exports.BOOL = "bool";
exports.NONE = "none";
function CLASS(name) {
    return { tag: "object", class: name };
}
exports.CLASS = CLASS;
;
//# sourceMappingURL=helpers.test.js.map