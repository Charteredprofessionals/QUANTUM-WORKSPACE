"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMRouter = void 0;
exports.createLLMRouter = createLLMRouter;
class LLMRouter {
    constructor(config) {
        this.config = config;
    }
    // Stub method - actual implementation pending
    async route(params) {
        return { content: 'LLM response placeholder', model: 'default' };
    }
    async complete(prompt) {
        return 'Completion placeholder';
    }
}
exports.LLMRouter = LLMRouter;
function createLLMRouter(config) {
    return new LLMRouter(config);
}
