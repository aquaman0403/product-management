import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


// Client send message
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value.trim();
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden")
        }
    })
}

socket.on("SERVER_RETURN_MESSAGE", (data) => {
    console.log(`Data:`,data);
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxtyping = document.querySelector(".chat .inner-list-typing");


    const div = document.createElement("div");

    let htmlFullName = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }

    div.classList.add("inner-incoming");
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.insertBefore(div, boxtyping);
    body.scrollTop = body.scrollHeight;
})

// Show typing
var timeOut
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")

    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }
    , 3000)
}

// Scroll to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

// Emoji
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle("shown")
    })
}


const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (event) => {
        const emoji = event.detail.unicode;
        inputChat.value = inputChat.value + emoji;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping()
    });

    inputChat.addEventListener("keyup", () => {
        showTyping()
    })
}


const elementsListTyping = document.querySelector(".chat .inner-list-typing");
if (elementsListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if(data.type =="show") {
            const existTyping = document.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxtyping = document.createElement("div");
                boxtyping.classList.add("box-typing");
                boxtyping.setAttribute("user-id", data.userId);

                boxtyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                `;
                elementsListTyping.appendChild(boxtyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const existTyping = document.querySelector(`[user-id="${data.userId}"]`);
            if (existTyping && elementsListTyping.contains(existTyping)) {
                elementsListTyping.removeChild(existTyping);
            }
        }
    })
}
