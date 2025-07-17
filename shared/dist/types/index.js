export var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["AUDIO"] = "audio";
    MessageType["FILE"] = "file";
    MessageType["SYSTEM"] = "system";
})(MessageType || (MessageType = {}));
export var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENDING"] = "sending";
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
    MessageStatus["FAILED"] = "failed";
})(MessageStatus || (MessageStatus = {}));
export var ReplyCategory;
(function (ReplyCategory) {
    ReplyCategory["AGREEMENT"] = "agreement";
    ReplyCategory["QUESTION"] = "question";
    ReplyCategory["RESPONSE"] = "response";
    ReplyCategory["GREETING"] = "greeting";
    ReplyCategory["FAREWELL"] = "farewell";
    ReplyCategory["EMOJI"] = "emoji";
})(ReplyCategory || (ReplyCategory = {}));
//# sourceMappingURL=index.js.map