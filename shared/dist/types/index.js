"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyCategory = exports.MessageStatus = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["AUDIO"] = "audio";
    MessageType["FILE"] = "file";
    MessageType["SYSTEM"] = "system";
})(MessageType || (exports.MessageType = MessageType = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENDING"] = "sending";
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
    MessageStatus["FAILED"] = "failed";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
var ReplyCategory;
(function (ReplyCategory) {
    ReplyCategory["AGREEMENT"] = "agreement";
    ReplyCategory["QUESTION"] = "question";
    ReplyCategory["RESPONSE"] = "response";
    ReplyCategory["GREETING"] = "greeting";
    ReplyCategory["FAREWELL"] = "farewell";
    ReplyCategory["EMOJI"] = "emoji";
})(ReplyCategory || (exports.ReplyCategory = ReplyCategory = {}));
//# sourceMappingURL=index.js.map