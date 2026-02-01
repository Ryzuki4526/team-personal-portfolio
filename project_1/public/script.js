document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById("chatMessages");
    const input = document.getElementById("userInput");
    const btn = document.getElementById("sendButton");

        function escapeHTML(str) {
        return str.replace(/[&<>"']/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '',
            "'": '&#39;'
        }[tag]));
    }

        async function typeMessage(text, speed = 35) {  
        const div = document.createElement("div");
        div.className = "message bot";
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;

        const safeText = escapeHTML(text);

        let i = 0;
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (i >= safeText.length) {
                    clearInterval(interval);
                    resolve();
                    return;
                }

                if (safeText[i] === "\n") {
                    div.innerHTML += "<br>";
                } else {
                    div.innerHTML += safeText[i];
                }

                i++;
                chat.scrollTop = chat.scrollHeight;
            }, speed);
        });
    }


    function addMessage(text, user = false) {
        const div = document.createElement("div");
        div.className = "message " + (user ? "user" : "bot");
        div.innerHTML = escapeHTML(text).replace(/\n/g, "<br>");
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    async function sendMessage() {
        const msg = input.value.trim();
        if (!msg) return;

        addMessage(msg, true);
        input.value = "";
        btn.disabled = true;

        const loading = document.createElement("div");
        loading.className = "message bot";
        loading.textContent = "خمسايه كدا افكر....";
        loading.id = "loading";
        chat.appendChild(loading);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ message: msg })
            });

            const data = await res.json();
            document.getElementById("loading")?.remove();

            await typeMessage(data.response || "فيه خطا حاول تاني");
        } catch {
            document.getElementById("loading")?.remove();
            addMessage("خطأ في الاتصال بالسيرفر.");
        }

        btn.disabled = false;
        input.focus();
    }

    btn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    input.focus();
});
