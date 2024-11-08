function sendMessage() {
    let sendBtn = document.querySelector('.send-message-btn')
    sendBtn.addEventListener('click', async function() {
        const newCommentText = document.querySelector('.new-message-input').value;
        const alias = document.querySelector('.username-input').value; 

        if (!newCommentText) {
            return;
        }

        const censoredMessage = await getCensoredMessage(newCommentText);
        sendCensoredMessage(alias, censoredMessage);
        addChatComment(alias, censoredMessage);
    })
}

async function getCensoredMessage(newCommentText) {
    const response = await fetch(`http://localhost:3014/censorMessage?message=${encodeURIComponent(newCommentText)}`);
    const responseData = await response.json();
    return responseData.censoredMessage;
}

function sendCensoredMessage(alias, censoredMessage) {
    fetch('http://localhost:3014', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            author: alias,
            message: censoredMessage
        })
    })
}

function addChatComment(alias, censoredMessage) {
    const chatContainer = document.querySelector('.chat-window');

    const chatEntry = document.createElement('div');
    chatEntry.classList.add('chat-entry');

    const authorSpan = document.createElement('span');
    authorSpan.classList.add('author');
    authorSpan.textContent = alias;

    const delimiterSpan = document.createElement('span');
    delimiterSpan.classList.add('delimiter');
    delimiterSpan.innerHTML = ':&nbsp;';

    const messageSpan = document.createElement('span');
    messageSpan.classList.add('message');
    messageSpan.textContent = censoredMessage;

    chatEntry.appendChild(authorSpan);
    chatEntry.appendChild(delimiterSpan);
    chatEntry.appendChild(messageSpan);

    chatContainer.appendChild(chatEntry);
}