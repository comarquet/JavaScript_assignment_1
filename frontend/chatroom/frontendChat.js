// frontendChat.js

// Function to fetch the censored message from the server
async function fetchCensoredMessage(messageContent) {
    try {
        const response = await fetch(`http://localhost:3014/censorMessage?message=${encodeURIComponent(messageContent)}`);
        const result = await response.json();
        return result.censoredMessage; // Return the censored message
    } catch (error) {
        console.error("Error fetching censored message:", error);
        showErrorPopup(); // Display error popup on failure
    }
}

// Function to send the message to the chat server
async function sendMessage(author, messageContent) {
    try {
        const response = await fetch('http://localhost:3014/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: author,
                message: messageContent
            })
        });
        return await response.json(); // Return the updated chat content
    } catch (error) {
        console.error("Error sending message:", error);
        showErrorPopup(); // Display error popup on failure
    }
}

// Function to update the chat window with the latest messages
function updateChatWindow(messages) {
    const chatWindow = document.querySelector('.chat-window');
    chatWindow.innerHTML = ''; // Clear current chat content
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-entry');
        messageElement.innerHTML = `<span class="author">${msg.author}:</span> <span class="message">${msg.message}</span>`;
        chatWindow.appendChild(messageElement);
    });
}

// Function to display error popup
function showErrorPopup() {
    const errorPopup = document.querySelector('.error-message-popup');
    errorPopup.classList.add('active');
}

// Function to hide error popup
function hideErrorPopup() {
    const errorPopup = document.querySelector('.error-message-popup');
    errorPopup.classList.remove('active');
}

// Function to handle the "Send" button click or Enter key press
async function handleSendButton() {
    const authorInput = document.querySelector('.username-input');
    const messageInput = document.querySelector('.new-message-input');

    const author = authorInput.value.trim();
    const messageContent = messageInput.value.trim();

    // Prevent sending empty messages or empty alias
    if (!author || !messageContent) {
        return;
    }

    // Step 1: Fetch the censored message
    const censoredMessage = await fetchCensoredMessage(messageContent);
    if (!censoredMessage) return; // Exit if censoring fails

    // Step 2: Send the censored message to the chat server
    const updatedMessages = await sendMessage(author, censoredMessage);
    if (!updatedMessages) return; // Exit if sending fails

    // Step 3: Update the chat window with the new content
    updateChatWindow(updatedMessages);

    // Clear the message input after sending
    messageInput.value = '';
    updateSendButtonState(); // Update the send button state to be disabled if input is empty
}

// Polling function to get real-time updates
function startPolling() {
    setInterval(async () => {
        try {
            const response = await fetch('http://localhost:3014/chat');
            const messages = await response.json();
            updateChatWindow(messages); // Update the chat window with new messages
        } catch (error) {
            console.error("Error polling messages:", error);
            showErrorPopup(); // Display error popup if there's an issue
        }
    }, 500); // Poll every 500ms
}

// Function to clear the chat
async function clearChat() {
    try {
        const response = await fetch('http://localhost:3014/chat', {
            method: 'DELETE'
        });
        const clearedMessages = await response.json();
        updateChatWindow(clearedMessages); // Display an empty chat after clearing
    } catch (error) {
        console.error("Error clearing chat:", error);
        showErrorPopup();
    }
}

// Function to disable or enable the "Send" button based on input values
function updateSendButtonState() {
    const authorInput = document.querySelector('.username-input');
    const messageInput = document.querySelector('.new-message-input');
    const sendButton = document.querySelector('.send-message-btn');

    // Disable the send button if either the author or message input is empty
    if (sendButton) {
        sendButton.disabled = !(authorInput.value.trim() && messageInput.value.trim());
    }
}

// Initialize event listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.querySelector('.send-message-btn');
    const messageInput = document.querySelector('.new-message-input');
    const clearChatButton = document.querySelector('.clear-chat-btn');
    const errorPopupCloseButton = document.querySelector('.error-message-popup .close-btn');
    const authorInput = document.querySelector('.username-input');

    // Trigger message sending on button click
    if (sendButton) {
        sendButton.addEventListener('click', handleSendButton);
    }

    // Trigger message sending on Enter key press while focused in the message input
    if (messageInput) {
        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // Prevent newline in textarea
                
                // Only send if both author and message fields are filled
                if (authorInput.value.trim() && messageInput.value.trim()) {
                    handleSendButton();
                }
            }
        });

        // Enable or disable the send button based on input values
        messageInput.addEventListener('input', updateSendButtonState);
    }

    // Enable or disable the send button based on input values for alias
    if (authorInput) {
        authorInput.addEventListener('input', updateSendButtonState);
    }

    // Add click event listener to the "Clear Chat" button
    if (clearChatButton) {
        clearChatButton.addEventListener('click', clearChat);
    }

    // Add click event listener to the "Close" button of the error popup
    if (errorPopupCloseButton) {
        errorPopupCloseButton.addEventListener('click', hideErrorPopup);
    }

    // Start polling for real-time updates
    startPolling();

    // Initial call to update the Send button state if inputs are empty
    updateSendButtonState();
});
