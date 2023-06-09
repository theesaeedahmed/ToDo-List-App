/*
Bugs :
    1. When refreshing page, the contents might get rearranged.
    2. Any checked item will get unchecked upon refreshing.
    3. Non-responsive.
    4. When you create a new item, you need to drag the mouse to the input text box in order to enter the item.

To Update :
    1. Upon clicking the `create new` button, the screen must scroll down to the position where the last item is being created and the 
        cursor / keyboard must already be ready to take input.
    2. Responsive for differnet screen layouts.
*/


let button = document.getElementById("addNewItem");
let newItem;
let i=0;
let alertId = 0;
let confirmId = 0;

let sleep = (time) => 
{
    return new Promise((resolve, reject) => {
        setTimeout( () => {
            resolve("1");
        }, time*1000);
    });
}

function removeDialogue(id) 
{
    let box=document.getElementById(id);
    box.remove();
}

let replaceAlert = (text) =>
{
    let div=document.createElement("div");
    div.setAttribute("class", "alert");
    div.setAttribute("id", `alert${alertId}`);
    div.innerHTML=`<p>${text}<p>`;
    document.body.appendChild(div);

    let okButton = document.createElement("button");
    okButton.setAttribute("type", "button");
    okButton.setAttribute("class", "okButton");
    okButton.innerHTML="Ok";
    okButton.setAttribute("id", `okButton${alertId}`);
    div.appendChild(okButton);
    alertId++;
    okButton.focus();
    okButton.setAttribute("onclick", `removeDialogue(this.parentElement.id)`);
};

let replaceConfirm = (task, todoContainerId) => 
{
    return new Promise((resolve, reject) => 
    {
        let div=document.createElement("div");
        div.setAttribute("class", "confirm");
        div.setAttribute("id", `confirm${confirmId}`);
        div.innerHTML=`<p>Are you sure about deleting Task : <br>"${task.slice(0, Math.min(task.length-1, 7))}..."<p>`;
        document.getElementById(todoContainerId).appendChild(div);
        div.setAttribute("onmouseleave", `removeDialogue(this.id)`);

        let okButton = document.createElement("button");
        okButton.setAttribute("type", "button");
        okButton.setAttribute("class", "okButton");
        okButton.innerHTML="Yes";
        okButton.setAttribute("id", `okButton${confirmId}`);
        div.appendChild(okButton);

        let cancelButton = document.createElement("button");
        cancelButton.setAttribute("type", "button");
        cancelButton.setAttribute("class", "cancelButton");
        cancelButton.innerHTML="No";
        cancelButton.setAttribute("id", `cancelButton${confirmId}`);
        div.appendChild(cancelButton);

        confirmId++;

        okButton.focus();

        let ret = () => {
            return new Promise((resolve) => {
                okButton.addEventListener("click", () => {
                    resolve(true);
                });
                cancelButton.addEventListener("click", () => {
                    removeDialogue(cancelButton.parentElement.getAttribute("id"));
                    document.getElementById(todoContainerId).getElementsByTagName("button")[0].removeAttribute("hidden");
                    resolve(false);
                });
            });
        };
        resolve(ret());
    });
}

let takeInput = (todoBox, key) =>
{
    return new Promise((resolve, reject) => {
        let form=document.createElement("form");
        let input=document.createElement("input");
        let submit=document.createElement("button");

        let item;
        
        input.setAttribute("type", "text");
        input.setAttribute("class", "inputItem");
        input.setAttribute("id", `inputItem${key}`);
        input.setAttribute("placeholder", `Enter To-Do item here.`);

        submit.setAttribute("type", "submit");
        submit.setAttribute("class", "submitItem");
        submit.setAttribute("id", `submitItem${key}`);
        submit.innerHTML="Submit";

        todoBox.appendChild(form);
        form.appendChild(input);
        form.appendChild(submit);

        input.focus();
        
        submit.addEventListener("click", (e) => {
            e.preventDefault();
            item = input.value;
            localStorage.setItem(`${key}`, `${item}`);
            form.remove();
            resolve(item);
        })
    });
}

let createTodo = async (item, key) => 
{
    let div=document.createElement("div");
    div.setAttribute("class", `container${key} container`);
    div.setAttribute("id", `container${key}`);
    document.body.getElementsByTagName("main")[0].appendChild(div);

    if(item == null)
    {
        if(document.getElementsByTagName("form").length > 0)
        {
            document.getElementsByClassName(`inputItem`)[0].focus();
            div.remove();
            return;
        }
        item = await takeInput(div, key);
        if(item == null || item == undefined || item == "")
        {
            div.remove();
            return;
        }
    }

    let checkbox=document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", `toDo${key}`);
    checkbox.setAttribute("class", "toDo");
    div.appendChild(checkbox);

    let label=document.createElement("label");
    label.setAttribute("for", `toDo${key}`);
    label.innerHTML=`${item}<br><br><hr>`;
    div.appendChild(label);

    let del=document.createElement("button");
    del.setAttribute("type", "button");
    del.setAttribute("class", "deleteItem");
    del.setAttribute("id", `deleteItem${key}`);
    del.setAttribute("hidden", "hidden");
    del.innerHTML=`Delete`;
    div.appendChild(del);

    del.setAttribute("onclick", `deleteTodo(this.id)`)

    checkbox.setAttribute("onclick", `strikeThrough(this.id)`);

    div.setAttribute("onmouseenter", `showButtons(this.id)`);
    div.setAttribute("onmouseleave", `hideButtons(this.id)`);
}

function findMax(arr) 
{
    let max=0;
    for(let i=0; i < arr.length; i++)
    {
        if(max < arr[i])
        {
            max = arr[i];
        }
    }
    return max;
}

function onPageReload()
{
    if(localStorage.length == 0 || document.getElementsByTagName("body")[0].getElementsByTagName("main")[0].getElementsByTagName("div").length != 0)
    {
        return;
    }

    let keys=Object.keys(localStorage);

    for(let j=0; j<keys.length; j++)
    {
        createTodo(localStorage.getItem(keys[j]), keys[j]);
    }

    i=findMax(Array.from(keys));
}

let callOnPageReload = () => {
    return new Promise((resolve, reject) => {
        setInterval(() =>{
            onPageReload();
            resolve("done");
        }, 500);
    });
}

let response = callOnPageReload();



function strikeThrough(id)
{
    let checkbox=document.getElementById(id);
    let label=document.getElementById(id).nextElementSibling;
    if(checkbox.checked)        //when checking the box -> checked=true
    {
        label.innerHTML=`<del>${label.innerHTML}</del>`;
    }
    else                       //when unchecking the box -> checked=false
    {
        label.innerHTML=`${label.getElementsByTagName("del")[0].innerHTML}`;
    }
}

function showButtons(id)
{
    let Buttons=document.getElementById(id).getElementsByTagName("button")[0];
    // for(let i=0; i < Buttons.length; i++)
    // {
    //     Buttons[i].removeAttribute("hidden");
    // }
    Buttons.removeAttribute("hidden");
}

function hideButtons(id)
{
    let Buttons=document.getElementById(id).getElementsByTagName("button")[0];
    // for(let i=0; i < Buttons.length; i++)
    // {
    //     Buttons[i].setAttribute("hidden", "hidden");
    // }
    Buttons.setAttribute("hidden", "hidden");
}

let deleteTodo = async (id) =>
{
    let key = id.slice(id.length-1);
    let dButton = document.getElementById(id);
    dButton.setAttribute("hidden", "hidden");
    let task = localStorage.getItem(`${key}`);
    let response = await replaceConfirm(task, `container${key}`);
    if(response)
    {
        localStorage.removeItem(key);
        dButton.parentElement.remove();
    }
    else
    {
        return;
    }
}

button.onclick=()=>
{
    createTodo(null, ++i);
}
