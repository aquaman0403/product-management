// Change status of product
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")

            let statusChange = currentStatus == "active" ? "inactive" : "active"
            
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;

            formChangeStatus.submit();
        })
    })
}
// End change status of product


// Checkbox Multi
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector("input[name='check-all']");
    const inputsId = checkBoxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
}
// End Checkbox Multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn xoá những sản phẩm này không");
            
            if (!isConfirm) {
                return;
            }
        }

        console.log(typeChange);

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = document.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            })
            inputIds.value = ids.join(",");

            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm");
        }
    });
}
// End form change multi

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");
    
    buttonDelete.forEach(button => {
        button.addEventListener("click", (e) => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const action = path + `/${id}?_method=DELETE`;
                console.log(action);
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}
// End delete item