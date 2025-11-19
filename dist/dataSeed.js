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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
// ...existing code...
var mongoose_1 = require("mongoose");
var Permission_1 = require("./src/lib/models/Permission");
var Role_1 = require("./src/lib/models/Role");
var MONGO_URI = process.env.MONGO_URI;
var permissions = [
    "create_course",
    "edit_course",
    "delete_course",
    "view_course",
    "assign_teacher",
    "enroll_student",
    "grade_student",
    "view_results",
];
// Define role permission mapping
var rolePermissions = {
    Admin: [
        "create_course",
        "edit_course",
        "delete_course",
        "assign_teacher",
        "enroll_student",
        "view_results",
    ],
    Teacher: ["view_course", "grade_student", "view_results"],
    Student: ["view_course", "view_results"],
    Parent: ["view_results"],
};
var seedData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1, allPermissions, _loop_1, _i, _a, roleName, error_1, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!MONGO_URI) {
                    console.error("MONGO_URI is not set. Aborting seed.");
                    process.exit(1);
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 15, , 20]);
                return [4 /*yield*/, mongoose_1.default.connect(MONGO_URI, {
                        // options are optional depending on mongoose version, kept for compatibility
                        // useNewUrlParser and useUnifiedTopology are safe to include
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    })];
            case 2:
                _d.sent();
                console.log("DB connected.");
                _d.label = 3;
            case 3:
                _d.trys.push([3, 5, , 6]);
                return [4 /*yield*/, Permission_1.default.insertMany(permissions.map(function (p) { return ({ name: p }); }), { ordered: false })];
            case 4:
                _d.sent();
                console.log("Permissions seeded ✔");
                return [3 /*break*/, 6];
            case 5:
                err_1 = _d.sent();
                // BulkWriteError likely due to duplicates; warn but continue
                if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.code) === 11000 || (err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === "BulkWriteError") {
                    console.warn("Some permissions already existed. Continuing...");
                }
                else {
                    console.warn("Permission insert warning:", err_1);
                }
                return [3 /*break*/, 6];
            case 6: return [4 /*yield*/, Permission_1.default.find().lean()];
            case 7:
                allPermissions = _d.sent();
                if (!(!allPermissions || allPermissions.length === 0)) return [3 /*break*/, 8];
                console.warn("No permissions found after seeding. Aborting role seeding.");
                return [3 /*break*/, 13];
            case 8:
                _loop_1 = function (roleName) {
                    var permNames, rolePerms;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                permNames = (_c = rolePermissions[roleName]) !== null && _c !== void 0 ? _c : [];
                                rolePerms = allPermissions
                                    .filter(function (p) { return permNames.includes(p.name); })
                                    .map(function (p) { return p._id; });
                                return [4 /*yield*/, Role_1.default.findOneAndUpdate({ name: roleName }, { $set: { permissions: rolePerms } }, { upsert: true, new: true, setDefaultsOnInsert: true })];
                            case 1:
                                _e.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = Object.keys(rolePermissions);
                _d.label = 9;
            case 9:
                if (!(_i < _a.length)) return [3 /*break*/, 12];
                roleName = _a[_i];
                return [5 /*yield**/, _loop_1(roleName)];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 9];
            case 12:
                console.log("Roles seeded ✔");
                _d.label = 13;
            case 13: 
            // Disconnect cleanly
            return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 14:
                // Disconnect cleanly
                _d.sent();
                process.exit(0);
                return [3 /*break*/, 20];
            case 15:
                error_1 = _d.sent();
                console.error("Seeding failed:", error_1);
                _d.label = 16;
            case 16:
                _d.trys.push([16, 18, , 19]);
                return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 17:
                _d.sent();
                return [3 /*break*/, 19];
            case 18:
                _b = _d.sent();
                return [3 /*break*/, 19];
            case 19:
                process.exit(1);
                return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); };
seedData();
// ...existing code...
