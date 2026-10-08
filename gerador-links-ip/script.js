// Serviços que abrem no navegador: [nome, protocolo, porta, caminho opcional]
const SERVICOS_WEB = [
  ["HTTP", "http", 80],
  ["HTTPS", "https", 443],
  ["HTTP alternativo", "http", 8080],
  ["HTTPs alternativo", "https", 8080],
  ["HTTP alternativo", "http", 55270],
  ["HTTPs alternativo", "https", 55270],
  // Atlas: mesmas portas, mas com o caminho /superadmin
  ["Atlas", "http", 8080, "/superadmin"],
  ["Atlas", "https", 8080, "/superadmin"],
  ["Atlas", "http", 55270, "/superadmin"],
  ["Atlas", "https", 55270, "/superadmin"],
];

// Serviços que precisam de outro programa: [nome, função que monta o comando]
const SERVICOS_CMD = [
  ["SSH", (ip) => `ssh usuario@${ip}`],
  ["Área de Trabalho Remota", (ip) => `mstsc /v:${ip}:3389`],
  ["VNC", (ip) => `vnc://${ip}:5900`],
  ["Testar porta (nc)", (ip) => `nc -zv ${ip} 22`],
];

// Regex de IPv4: cada octeto vai de 0 a 255, separados por ponto
const octeto = "(25[0-5]|2[0-4]\\d|1?\\d?\\d)";
const REGEX_IPV4 = new RegExp(`^${octeto}(\\.${octeto}){3}$`);

// Atalho para document.getElementById
const $ = (id) => document.getElementById(id);

// Retorna true se o texto for um IPv4 válido
function validarIP(valor) {
  return REGEX_IPV4.test(valor);
}

// Monta um link <a> para o serviço; omite a porta se for a padrão (80/443)
function criarLink([nome, proto, porta, caminho = ""], ip) {
  const portaPadrao =
    (proto === "http" && porta === 80) || (proto === "https" && porta === 443);
  const url = `${proto}://${ip}${portaPadrao ? "" : ":" + porta}${caminho}`;
  const a = document.createElement("a");
  a.className = "link" + (nome === "Atlas" ? " atlas" : ""); // destaque visual do Atlas
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer"; // segurança ao abrir em nova aba
  const b = document.createElement("b");
  b.textContent = nome;
  const s = document.createElement("span");
  s.textContent = url;
  a.append(b, s);
  return a;
}

// Monta a linha do comando com o botão "Copiar"
function criarComando(nome, texto) {
  const div = document.createElement("div");
  div.className = "cmd";
  const code = document.createElement("code");
  code.textContent = texto; // textContent evita injeção de HTML
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Copiar";
  btn.setAttribute("aria-label", `Copiar comando: ${nome}`);
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(texto);
      btn.textContent = "Copiado";
    } catch {
      btn.textContent = "Falhou"; // ex.: sem permissão ou sem HTTPS
    }
    // Volta o texto original do botão após 1,5 s
    setTimeout(() => (btn.textContent = "Copiar"), 1500);
  });
  div.append(code, btn);
  return div;
}

// Lê o IP, valida e preenche os resultados
function gerar() {
  const ip = $("ip").value.trim();
  const erro = $("erro");
  const resultado = $("resultado");

  // IP inválido: mostra erro e esconde os resultados
  if (!validarIP(ip)) {
    erro.textContent = "Digite um IPv4 válido, por exemplo 100.66.8.144.";
    resultado.hidden = true;
    return;
  }
  erro.textContent = "";

  // Substitui o conteúdo anterior pelos novos links e comandos
  $("web").replaceChildren(...SERVICOS_WEB.map((s) => criarLink(s, ip)));
  $("cmds").replaceChildren(
    ...SERVICOS_CMD.map(([nome, fn]) => criarComando(nome, fn(ip))),
  );
  resultado.hidden = false;
}

// Gera ao clicar no botão ou ao apertar Enter no campo
$("gerar").addEventListener("click", gerar);
$("ip").addEventListener("keydown", (e) => {
  if (e.key === "Enter") gerar();
});