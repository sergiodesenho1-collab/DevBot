const textarea = document.querySelector("textarea");

const initialTextareaHeight = textarea.scrollHeight;

//Botão para abrir o chat
async function createBotReplay(content) {
  const response = await fetch(
    "http://localhost:3000/chat",

    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content,
      }),
    },
  );

  const data = await response.json();

  if (response.ok) {
    return data.reply;
  } else {
    throw new Error(data.error || "Error ao obter resposta");
  }
}

//Função para criar um elemento de mensagem no chat
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

// Função para lidar com o envir da mensagem do usúario e a resposta do bot

function handleCloseChat() {
  document.body.classList.remove("open-chat");
}

function handleToggleChat() {
  document.body.classList.toggle("open-chat");
}

//Função que controla o Enter para enviar mensagem
function handleChatOnKeyDown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleChat();
  }
}

//função para lidar com o redimensionamento automatico do textarea
function handleAutoSize() {
  textarea.style.height = `${initialTextareaHeight}px`;
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// adicionando os events listeners aos elementos
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
    main.scrollTo(0, main.scrollHeight);
  } catch (error) {
    botMessage.querySelector("p").textContent =
      "ops! Algo deu errado. Por favor tente novamente.";
    botMessage.querySelector("p").classList.add("error");
    main.scrollTo(0, main.scrollHeight);
  }
}
