// Client send message
const formSendData = document.querySelector(".chat .inner-form");

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value.trim();
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = "";
        }
    })
}

socket.on("SERVER_RETURN_MESSAGE", (data) => {
    console.log(`Data:`,data);
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    console.log(myId);
    const body = document.querySelector(".chat .inner-body");
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

    body.appendChild(div);
})