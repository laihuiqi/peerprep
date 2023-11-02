const gptService = require('../services/gptService');

async function getResponse(req, res, next) {
    try {
        const prompt = req.body.prompt;
        
        console.log(`Received prompt: ${prompt}`);

        const response = await gptService.getResponse(prompt);

        switch (response.status) {
            case 'success':
                await res.status(200).json(response);
                break;
            case 'error':
                await res.status(500).json(response);
                break;
            default:
                await res.status(500).json({ message: 'Unknown error. Please try again!' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get response from gpt. Please try again!' })
    }
}

module.exports = {
    getResponse,
};