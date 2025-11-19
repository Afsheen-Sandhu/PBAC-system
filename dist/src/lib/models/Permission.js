"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var permissionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
});
var Permission = mongoose_1.models.Permission || (0, mongoose_1.model)("Permission", permissionSchema);
exports.default = Permission;
