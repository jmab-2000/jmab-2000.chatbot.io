const formEl = document.querySelector('.form');
const button = document.getElementById('submit');
const message_field = document.getElementById('message');
const chat = document.querySelector('.chat-display');

formEl.addEventListener('submit', event => {
    event.preventDefault();
    disable_button();

    const user_node = document.createElement('div');
    const user_par = document.createElement('p');
    user_par.className = "mw-75 text-bg-primary p-2 m-2 text-break";
    user_node.append(user_par)
    user_node.className = "user d-flex justify-content-end";
    console.log("Form-submitted");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);
    console.log(data);
    user_par.textContent = data.message;
    message_field.value = "";
    chat.appendChild(user_node);
    addLoadingAnimation();
    chat.scrollTop = chat.scrollHeight;

    // setTimeout(function(){
    //     reply_chatbot("INSERT REPLY HERE!!!");
    //     enable_button();
    //     removeLoadingAnimation();
    // },5000);

    const api_link = 'https://61c8-112-210-253-200.ngrok-free.app/aubchatbot/customer-service/threads/' + data.thread_id;
    try {
        fetch(api_link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
                return res.json();
              }
              return Promise.reject(res);
        })
            .then(data => {
                const reply_node = document.createElement('div');
                const reply_par = document.createElement('p');
                if (data.run_status === "completed") {
                    reply_node.className = "assistant d-flex justify-content-start text-break";
                    reply_par.className = "w-75 bg-dark-subtle p-2 m-2 ";
                    reply_par.textContent = data.reply;
                    reply_node.appendChild(reply_par);
                    document.getElementById('thread_id').value = data.thread_id;
                }
                else {
                    reply_node.className = "alert alert-danger";
                    reply_node.role = "alert";
                    reply_node.textContent = "Server Error. Pls. Try Again";
                }
                chat.appendChild(reply_node);
                chat.scrollTop = chat.scrollHeight;
                removeLoadingAnimation();
                if(data.run_status === "completed"){
                    enable_button();
                }
                
            })
            .catch(error => {
                console.log(error);
                const reply_node = document.createElement('div');
                reply_node.className = "alert alert-danger";
                reply_node.role = "alert";
                reply_node.textContent = "Error in Fetching Server. Refresh the page";
                chat.appendChild(reply_node);
                removeLoadingAnimation();

            })

    } catch (error) {
        console.log(error);
        const reply_node = document.createElement('div');
        reply_node.className = "alert alert-danger";
        reply_node.role = "alert";
        reply_node.textContent = error.message;
        chat.appendChild(reply_node);
        removeLoadingAnimation();
        enable_button();
    }


});


function disable_button() {
    button.disabled = true;
}

function enable_button() {
    button.disabled = false;
}

function reply_chatbot(message) {
    const reply_node = document.createElement('div');
    const reply_par = document.createElement('p');
    reply_node.className = "assistant d-flex justify-content-start text-break";
    reply_par.className = "bg-dark-subtle p-2 m-2 ";
    reply_par.textContent = message;
    reply_node.appendChild(reply_par);
    chat.appendChild(reply_node);
    chat.scrollTop = chat.scrollHeight;
}

// Function to append HTML before invocation
function addLoadingAnimation() {
    var loadingHtml = `
    <div class="typing-animation">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>`;
    chat.insertAdjacentHTML('beforeend', loadingHtml);
}

// Function to remove HTML after completion
function removeLoadingAnimation() {
    var loadingOverlay = document.querySelector('.typing-animation');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}