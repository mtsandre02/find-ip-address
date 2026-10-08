# Links de acesso por IP
 
Aplicação web simples, criada voluntariamente para facilitar pesquisas de endereço de IP no setor de Suporte Técnico.
 
Você informa um IPv4 e a página gera, na hora, os links para abrir no navegador e os comandos prontos para copiar.
 
## Funcionalidades
 
- Validação de IPv4 (cada octeto de 0 a 255) antes de gerar qualquer coisa
- Links clicáveis, abertos em nova aba, para:
  - HTTP e HTTPS (portas 80 e 443)
  - HTTP e HTTPS alternativos (portas 8080 e 55270)
  - Atlas (`/superadmin`) nas portas 8080 e 55270
- Comandos com botão **Copiar**:
  - SSH: `ssh usuario@IP`
  - Área de Trabalho Remota: `mstsc /v:IP:3389`
  - VNC: `vnc://IP:5900`
  - Teste de porta: `nc -zv IP 22`
- Funciona com o botão **Gerar links** ou com a tecla **Enter**
- Tema claro e escuro automático, conforme a preferência do sistema
- Layout responsivo e com atenção à acessibilidade (`aria-label`, `role="alert"`, foco visível)
## Estrutura do projeto
 
```
.
├── index.html   # estrutura da página
├── style.css    # estilos e temas claro/escuro
└── script.js    # validação e geração dos links e comandos
```
 
## Como usar
 
1. Baixe ou clone o projeto.
2. Abra o `index.html` no navegador (não precisa de servidor nem de instalação).
3. Digite um IPv4, por exemplo `100.66.8.144`.
4. Clique em **Gerar links** ou aperte Enter.
5. Clique em um link para abrir o serviço ou em **Copiar** para usar o comando no terminal.
> O botão **Copiar** usa a API de área de transferência do navegador, que pode exigir HTTPS ou `localhost`. Se não funcionar abrindo o arquivo direto, rode um servidor local, por exemplo: `python -m http.server`.
 
## Como personalizar
 
Os serviços ficam no início do `script.js`:
 
```javascript
// Links do navegador: [nome, protocolo, porta, caminho opcional]
const SERVICOS_WEB = [
  ["HTTP", "http", 80],
  ["Atlas", "http", 8080, "/superadmin"],
];
 
// Comandos: [nome, função que recebe o IP e devolve o comando]
const SERVICOS_CMD = [
  ["SSH", (ip) => `ssh usuario@${ip}`],
];
```
 
Para adicionar um serviço, inclua uma nova linha em uma das listas. As cores e o visual ficam nas variáveis CSS no topo do `style.css`.
 
## Segurança
 
- O IP é validado antes de montar links e comandos, o que evita que texto arbitrário vá parar em um comando copiado.
- O conteúdo é inserido com `textContent`, nunca com `innerHTML`.
- Os links usam `rel="noopener noreferrer"` ao abrir em nova aba.
## Limitações
 
- Aceita apenas IPv4 (IPv6 não é suportado).
- Os comandos usam valores fixos (usuário `usuario`, portas 22, 3389 e 5900); ajuste conforme o seu ambiente.
- `vnc://` é uma URL e não um comando de terminal; o resultado depende do sistema e do cliente VNC instalado.
## Autor
 
Matheus André da Silva
