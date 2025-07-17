export declare const API_CONFIG: {
    readonly DEFAULT_BASE_URL: "http://localhost:8000/api";
    readonly PRODUCTION_BASE_URL: "https://synapse-backend.rahul-msft.github.io/api";
    readonly TIMEOUT: 30000;
    readonly getBaseUrl: () => string;
};
export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly LOGOUT: "/auth/logout";
        readonly REFRESH: "/auth/refresh";
        readonly PROFILE: "/auth/profile";
    };
    readonly CHAT: {
        readonly LIST: "/chat";
        readonly CREATE: "/chat";
        readonly GET: (id: string) => string;
        readonly MESSAGES: (id: string) => string;
        readonly SEND_MESSAGE: (id: string) => string;
        readonly TYPING: (id: string) => string;
    };
    readonly AVATAR: {
        readonly GENERATE: "/avatar/generate";
        readonly UPLOAD_PHOTO: "/avatar/upload-photo";
        readonly LIST: "/avatar";
        readonly GET: (id: string) => string;
        readonly DELETE: (id: string) => string;
    };
    readonly SMART_REPLY: {
        readonly SUGGESTIONS: "/smart-reply/suggestions";
    };
    readonly TTS: {
        readonly SYNTHESIZE: "/tts/synthesize";
        readonly VOICES: "/tts/voices";
    };
    readonly USER: {
        readonly PROFILE: "/user/profile";
        readonly UPDATE_STATUS: "/user/status";
        readonly SEARCH: "/user/search";
    };
};
export declare const SOCKET_EVENTS: {
    readonly CONNECTION: "connection";
    readonly DISCONNECT: "disconnect";
    readonly JOIN_CHAT: "join_chat";
    readonly LEAVE_CHAT: "leave_chat";
    readonly MESSAGE_SENT: "message_sent";
    readonly MESSAGE_RECEIVED: "message_received";
    readonly MESSAGE_UPDATED: "message_updated";
    readonly TYPING_START: "typing_start";
    readonly TYPING_STOP: "typing_stop";
    readonly USER_ONLINE: "user_online";
    readonly USER_OFFLINE: "user_offline";
    readonly ERROR: "error";
};
export declare const AVATAR_CONFIG: {
    readonly HAIR_COLORS: readonly ["#000000", "#654321", "#FFD700", "#FF4500", "#696969", "#FFFFFF"];
    readonly SKIN_COLORS: readonly ["#FDBCB4", "#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#A0522D"];
    readonly EYE_COLORS: readonly ["#8B4513", "#87CEEB", "#90EE90", "#708090", "#DDA0DD", "#000000"];
    readonly HAIR_STYLES: readonly ["short", "medium", "long", "curly", "wavy", "straight", "buzz", "bald"];
    readonly FACIAL_HAIR: readonly ["none", "mustache", "beard", "goatee", "stubble"];
    readonly ACCESSORIES: readonly ["glasses", "sunglasses", "earrings", "hat", "headband"];
};
export declare const TTS_CONFIG: {
    readonly DEFAULT_SPEED: 1;
    readonly DEFAULT_PITCH: 1;
    readonly MIN_SPEED: 0.5;
    readonly MAX_SPEED: 2;
    readonly MIN_PITCH: 0.5;
    readonly MAX_PITCH: 2;
    readonly VOICES: readonly [{
        readonly id: "en-us-female-1";
        readonly name: "Sarah";
        readonly language: "en-US";
        readonly gender: "female";
    }, {
        readonly id: "en-us-male-1";
        readonly name: "David";
        readonly language: "en-US";
        readonly gender: "male";
    }, {
        readonly id: "en-us-neutral-1";
        readonly name: "Alex";
        readonly language: "en-US";
        readonly gender: "neutral";
    }];
};
export declare const SMART_REPLY_CONFIG: {
    readonly MAX_SUGGESTIONS: 3;
    readonly MIN_CONFIDENCE: 0.5;
    readonly CONTEXT_WINDOW: 10;
    readonly COMMON_REPLIES: {
        readonly AGREEMENT: readonly ["Yes", "Absolutely", "I agree", "Sounds good"];
        readonly QUESTION: readonly ["What do you think?", "How about you?", "Really?"];
        readonly RESPONSE: readonly ["Thanks", "Got it", "Understood", "Perfect"];
        readonly GREETING: readonly ["Hello", "Hi there", "Good morning", "Hey"];
        readonly FAREWELL: readonly ["Goodbye", "See you later", "Take care", "Bye"];
        readonly EMOJI: readonly ["👍", "😊", "❤️", "😂", "🎉", "👏"];
    };
};
export declare const UI_CONFIG: {
    readonly CHAT: {
        readonly MESSAGE_PAGE_SIZE: 50;
        readonly TYPING_TIMEOUT: 3000;
        readonly MESSAGE_MAX_LENGTH: 1000;
        readonly ATTACHMENT_MAX_SIZE: number;
    };
    readonly THEME: {
        readonly COLORS: {
            readonly PRIMARY: "#007AFF";
            readonly SECONDARY: "#5856D6";
            readonly SUCCESS: "#34C759";
            readonly WARNING: "#FF9500";
            readonly ERROR: "#FF3B30";
            readonly BACKGROUND: "#F2F2F7";
            readonly SURFACE: "#FFFFFF";
            readonly TEXT_PRIMARY: "#000000";
            readonly TEXT_SECONDARY: "#8E8E93";
        };
    };
};
export declare const ERROR_CODES: {
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INVALID_INPUT: "INVALID_INPUT";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly ALREADY_EXISTS: "ALREADY_EXISTS";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
    readonly CHAT_NOT_FOUND: "CHAT_NOT_FOUND";
    readonly MESSAGE_SEND_FAILED: "MESSAGE_SEND_FAILED";
    readonly AVATAR_GENERATION_FAILED: "AVATAR_GENERATION_FAILED";
    readonly PHOTO_PROCESSING_FAILED: "PHOTO_PROCESSING_FAILED";
    readonly TTS_SYNTHESIS_FAILED: "TTS_SYNTHESIS_FAILED";
    readonly VOICE_NOT_AVAILABLE: "VOICE_NOT_AVAILABLE";
};
//# sourceMappingURL=index.d.ts.map