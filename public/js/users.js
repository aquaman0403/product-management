// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add")
      
      const userId = button.getAttribute("btn-add-friend");

      socket.emit("CLIENT_ADD_FRIEND", userId)
    })
  })
}


// Chức năng hủy gửi yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add")
      
      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userId)
    })
  })
}

// Chức năng từ chối yêu cầu kết bạn
const listBtnRefuseFriend  = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse")
      
      const userId = button.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId)
    })
  })
}

// Chức năng chấp nhận yêu cầu kết bạn
const listBtnAcceptFriend  = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted")
      
      const userId = button.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId)
    })
  })
}

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
  const badgeUsersAccept = document.querySelector("[badge-users-accept]")
  const userId = badgeUsersAccept.getAttribute("badge-users-accept")

  if (userId === data.userId) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends
  }
})

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {
  const dataUsersAccept = document.querySelector("[data-users-accept]")
  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept")

    if (userId === data.userId) {
      const newBoxUser = document.createElement("div")
      newBoxUser.classList.add("col-6")
      newBoxUser.setAttribute("user-id", data.infoUserA._id)

      newBoxUser.innerHTML = 
      `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="https://robohash.org/ecaefdd8febabb14cacab434b2457736?set=set4&bgset=&size=400x400" alt="Avatar">
          </div>
          <div class="inner-info">
            <div class="inner-name mb-1">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-primary btn-sm mb-1 me-1" btn-accept-friend="${data.infoUserA._id}">
                Chấp nhận
              </button>
              <button class="btn btn-secondary btn-sm mb-1" btn-refuse-friend="${data.infoUserA._id}">
                Xoá
              </button>
              <button class="btn btn-secondary btn-sm mb-1" btn-deleted-friend="${data.infoUserA._id}" disabled>
                Đã xoá
              </button>
              <button class="btn btn-primary btn-sm mb-1 me-1" btn-accepted-friend="${data.infoUserA._id}" disabled>
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `

      dataUsersAccept.appendChild(newBoxUser)

      // Xoá lời mời kết bạn
      const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]")
      btnRefuseFriend.addEventListener("click", () => {
        btnRefuseFriend.closest(".box-user").classList.add("refuse")
        
        const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIEND", userId)
      })

      // Chấp nhận lời mời kết bạn
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]")
      btnAcceptFriend.addEventListener("click", () => {
        btnAcceptFriend.closest(".box-user").classList.add("accepted")
        
        const userId = btnAcceptFriend.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", userId)
      })
    }
  }

  const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
  if (dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute("data-users-not-friend")

    if (userId === data.userId) {
      const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`)
      if (boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove)
      }
    }
  }

})

socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector("[data-users-accept]")
  const userId = dataUsersAccept.getAttribute("data-users-accept")

  if (userId === data.userId) {
    const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`)
    dataUsersAccept.removeChild(boxUserRemove)
  }
})