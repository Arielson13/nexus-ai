const form = document.getElementById("form");
const input = document.getElementById("user-input");
const chat = document.getElementById("chat");

// FUNÇÃO PARA ADICIONAR MENSAGEM
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const content = document.createElement("div");
  content.classList.add("content");
  content.textContent = text;

  message.appendChild(content);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

// INDICADOR "IA PENSANDO"
function showThinking() {
  const thinkingMessage = document.createElement("div");
  thinkingMessage.classList.add("message", "bot");
  thinkingMessage.id = "thinking";

  const content = document.createElement("div");
  content.classList.add("content");

  const dots = document.createElement("div");
  dots.classList.add("dot-typing");
  dots.innerHTML = "<span></span>"; // bolinha central

  content.appendChild(dots);
  thinkingMessage.appendChild(content);
  chat.appendChild(thinkingMessage);

  chat.scrollTop = chat.scrollHeight;
}

function removeThinking() {
  const thinking = document.getElementById("thinking");
  if (thinking) thinking.remove();
}

// EFEITO DE DIGITAÇÃO (RESPOSTA DA IA)
function showTypingEffect(htmlText) {
  return new Promise((resolve) => {
    const message = document.createElement("div");
    message.classList.add("message", "bot");

    const content = document.createElement("div");
    content.classList.add("content");
    content.innerHTML = ""; // começa vazio

    message.appendChild(content);
    chat.appendChild(message);

    let index = 0;

    function typeChar() {
      if (index < htmlText.length) {
        content.innerHTML = htmlText.slice(0, index + 1);
        index++;
        chat.scrollTop = chat.scrollHeight;
        setTimeout(typeChar, 8);
      } else {
        resolve();
      }
    }

    typeChar();
  });
}

// EVENTO DE ENVIO
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage("user", prompt);
  input.value = "";

  // Mostra o efeito de "IA pensando"
  showThinking();

  try {
    const res = await fetch("http://localhost:3000/perguntar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    removeThinking(); // remove o indicador antes de digitar a resposta

    if (!data.resposta) {
      await showTypingEffect("Não foi possível entender a resposta da IA.");
      return;
    }

    const formatted = formatTextToHTML(data.resposta);
    await showTypingEffect(formatted);
  } catch (error) {
    removeThinking();
    await showTypingEffect("Erro ao obter resposta.");
    console.error("Erro:", error);
  }
});

// FORMATAÇÃO DE TEXTO PARA HTML
function formatTextToHTML(text) {
  let html = text;

  // Blocos de código com linguagem
  html = html.replace(/```(\w+)\s*([\s\S]*?)```/g, '<pre><code class="$1">$2</code></pre>');
  // Blocos de código sem linguagem
  html = html.replace(/```\s*([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Citações
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Cabeçalhos
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Linha horizontal
  html = html.replace(/^[*-]{3,}\s*$/gm, '<hr>');

  // Listas
  html = html.replace(/^(?:[ \t]*)[*-] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\n<ul>/g, '\n');

  // Negrito, Itálico e Código Inline
  html = html.replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>');
  html = html.replace(/(\*|_)(.+?)\1/g, '<em>$2</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Parágrafos e quebras de linha
  html = html.replace(/<\/p><p>/g, '\n\n');
  html = html.replace(/(\r?\n){2,}/g, '</p><p>');
  html = html.replace(/<\/p><p>([ \t]*[<]?(h[1-6]|ul|ol|blockquote|pre))/g, '\n$1');
  html = html.replace(/([<]?\/?(h[1-6]|ul|ol|blockquote|pre)[> ]?)\n<p>/g, '$1\n');

  if (!html.startsWith('<p>')) html = '<p>' + html;
  if (!html.endsWith('</p>')) html += '</p>';

  return html;
}

// ENVIO COM ENTER
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});
