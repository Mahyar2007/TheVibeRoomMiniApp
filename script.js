// =========================
// TheVibeRoom Mini App
// =========================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const textarea = document.getElementById("message");
const button = document.getElementById("sendBtn");
const loader = document.getElementById("loader");
const status = document.getElementById("status");

// گرفتن اطلاعات کاربر تلگرام
const user = tg.initDataUnsafe?.user || {};

const userId = user.id || "Unknown";

// ساخت ذرات نور
for (let i = 0; i < 35; i++) {

    const p = document.createElement("div");

    p.className = "particle";

    p.style.left = Math.random() * 100 + "%";

    p.style.animationDuration = (6 + Math.random() * 8) + "s";

    p.style.animationDelay = Math.random() * 8 + "s";

    document.body.appendChild(p);
// =========================
// ارسال پیام
// =========================

button.addEventListener("click", async () => {

    const message = textarea.value.trim();

    if (!message) {

        status.innerHTML = "⚠️ لطفاً پیام خود را بنویسید.";

        return;

    }

    loader.classList.add("show");

    button.disabled = true;

    status.innerHTML = "";

    try {

        const response = await fetch("/api/send", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                user_id: userId,

                message: message

            })

        });

        const result = await response.json();

        loader.classList.remove("show");

        button.disabled = false;

        if (result.success) {

            textarea.value = "";

            status.innerHTML = "✅ پیام شما با موفقیت ارسال شد.";

        } else {

            status.innerHTML = "❌ " + (result.error || "خطا در ارسال پیام");

        }

    } catch (error) {

        loader.classList.remove("show");

        button.disabled = false;

        status.innerHTML = "❌ ارتباط با سرور برقرار نشد.";

        console.error(error);

    }

});
