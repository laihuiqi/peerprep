const { getResponse, getCache, exitSession } = require('../services/gptService');

jest.setTimeout(300000);

describe('Gpt Service', () => {
    
    const userId = 'Jgk9LsH3pRi2';
    const prompt = 'What is the difference between a stack and a queue?';
    let gptReply = '';

    it('should get response from GPT-3.5', async () => {
        const response = await getResponse(userId, prompt);
        gptReply = response.reply;

        expect(response.status).toBe('success');
        expect(response.reply).not.toBe('');

    });

    it('should get cache from session', () => {
        const response = getCache(userId);

        expect(response.status).toBe('success');
        expect(response.record[0].prompt).toBe(prompt);
        expect(response.record[0].reply).toBe(gptReply);
    });

    it('should exit session', () => {
        const response = exitSession(userId);

        expect(response).toBe(true);

        const cache = getCache(userId);
        
        expect(cache.status).toBe('error');
        expect(cache.message).toBe('No session found for this user.');

    });

});