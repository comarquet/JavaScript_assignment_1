1. Write your code in the `frontendChat.js` file. You need to link this file to your HTML document, in order for it to run when the webpage loads in the web browser.

2. Specification of expected functionalities :

2.1 Send messages when clicking on the "send" button **or** when the user press
enter while being focused in the message input.

2.2 Sending a message workflow :
- the frontend must first use the censoring service provided by the server. It should call
`GET /censorMessage?message=Content of the message`
- the frontend should the take the censored message given as a reply
- the frontend now sends the message to the chat server, by calling `POST /message` and giving
the user alias and the message content (the censored version), in the body of the request
in JSON format. See the server API specification.
- the frontend updates the content of the chat with the response given by the server

2.3 Prevent sending empty messages or empty alias
- Disable the "Send" button, and don't react on the "Enter" keypress, if either the alias
  or the message input are empty

2.4 Display the error popup, in case one of your network requests fails.
- Anytime you make a network request, there is a possibility for failure. Take that
into account, and handle such cases. The best way to get a network error is
to stop your server program.
- When you get a network error, you should display the error message popup. You don't
need to change the message, the default message in place in the template is enough.

2.5 Make the "Close" button of the error popup work.

2.6 Poll regularly the server to get real time update on your chat.
- Use the API request `GET /chat` to get the whole content of the chat, and update
the content of the chat window with the result.
- Because we can't be updated by the server in case of updates, we need to poll it, 
that is making permanent requests on a fixed short delay. You will make a request 
every 500ms, for a good user experience. You can use the native JS function `setInterval()`.
- Once this work, you can open several tabs with your frontend (that is, making
several clients for your web server), and you will be able to make the clients communicate
between them.

2.7 Make the "Clear chat" button work
When clicking the button, use the server API endpoint `DELETE /chat`
