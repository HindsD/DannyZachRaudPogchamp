const apiKey = 'AIzaSyBtf0qOzBlIJ-h3Eiuq9KE7vrB3K9T57ec';
const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey;

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    displayMessage('user', userMessage);
    userInput.value = '';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: `{
                        "contents": [
                            {
                                "parts": [
                                    {
                                        "text": "As if you were a pokemon trainer that has a huge crush on me, answer: ${userMessage}"
                                    }
                                ]
                            }
                        ]
                    }`
        });

        const data = await response.json();
        console.log(data); // Debugging: Log the entire API response

        const apiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unexpected API response structure.';
        displayMessage('api', apiResponse);
    } catch (error) {
        console.error('Error:', error);
        displayMessage('api', 'An error occurred while fetching the response.');
    }
});

function displayMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const messageText = document.createElement('span');
    messageText.textContent = text;
    messageDiv.appendChild(messageText);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}