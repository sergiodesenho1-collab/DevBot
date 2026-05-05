const textarea = document.querySelector("textarea");

const initialTextareaHeight = textarea.scrollHeight;

//Botão para abrir o chat
async function createBotReplay(content) {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "sua chave";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content,
        },
      ],
    }),
  });

  const data = await response.json();

  return data.choices[0].message.content;
}

//função para criar um elemento de mensagem no chat
function createChatMessage(message, type) {
  const li = document.createElement("li");
  li.classList.add("message", type);

  const p = document.createElement("p");

  if (type === "bot") {
    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-robot", "fa-xl");
    li.appendChild(i);
  }

  p.textContent = message;
  li.appendChild(p);

  return li;
}

// função para lidar com envir da mensagem do uúario e respossta do bot

function handleClosechat() {
  document.body.classList.remove("open-chat");
}

function handleToggleChat() {
  document.body.classList.toggle("open-chat");
}

// função que controla o Enter para enviar mensagem
function handleChatonKeyDown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleChat();
  }
}

// função para lidar com redimensionamento automatico do testarea
function handleAutoSize() {
  textarea.style.height = `${initialTextareaHeight}px`;
  textarea.style.height = `${textarea.scrollHeight}px`;
}

//adicionando os events listeners aos elementos
async function handleChat() {
  const textareaValue = textarea.value.trim();

  if (!textareaValue) return;

  const main = document.querySelector("main");
  const messageHistory = document.querySelector("ul");

  const userMessage = createChatMessage(textareaValue, "user");

  messageHistory.appendChild(userMessage);
  main.scrollTo(0, main.scrollHeight);

  textarea.value = "";

  const botMessage = createChatMessage("Digitando...", "bot");

  setTimeout(() => {
    messageHistory.appendChild(botMessage);
    main.scrollTo(0, main.scrollHeight);
  }, 500);

  try {
    const botReplay = await createBotReplay(textareaValue);

    botMessage.querySelector("p").textContent = botReplay;
    messageHistory.scrollTo(0, messageHistory.scrollHeight);
  } catch (error) {
    botMessage.querySelector("p").textContent =
      "Ops! Algo deu errado. Por favor tente novamente.";
    botMessage.querySelector("p").classList.add("error");
  }
}
