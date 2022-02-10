let usuario = prompt('Qual seu nome?');
const chat = document.querySelector('main');
let ultimaMensagem = null;
let intervaloUm = null;
let intervaloDois = null;

function entrarNaSala(){
    usuario = {
        name: usuario
    };
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', usuario);
    promessa.then(carregarMensagens);
    promessa.then(permanecerNaSala);
    promessa.catch(checarUsuario);
}

function enviarUsuario(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', usuario);
    promessa.catch(sairDaSala);
}

function checarUsuario(erro){
    statusCode = erro.response.status;
    usuario = prompt('Usuário já existe, insira outro.');
    entrarNaSala();
}

function carregarMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(renderizarMensagens);
}

function renderizarMensagens(resposta){
    let mensagens = resposta.data;
    let tamanho = mensagens.length - 1;
    for (let i = 0; i < tamanho; i++){
        configurarMensagem(mensagens[i]);
    }
    ultimaMensagem = document.querySelector('main > .mensagem:last-child');
    ultimaMensagem.scrollIntoView();
}

function configurarMensagem(mensagem){
    if (mensagem.type === 'status'){
        configurarMensagemStatus(mensagem);
    } else if (mensagem.type === 'message'){
        configurarMensagemNormal(mensagem);
    } else if (mensagem.type === 'private_message'){
        configurarMensagemPrivada(mensagem);
    }

}

function configurarMensagemStatus(mensagem){
    chat.innerHTML += `
    <div class="mensagem status">
        <p class="mensagem"><span class="time">(${mensagem.time}) </span><strong class="nome from">${mensagem.from}</strong> ${mensagem.text}</p>
    </div>
    `
}

function configurarMensagemNormal(mensagem){
    chat.innerHTML += `
        <div class="mensagem normal">
            <p class="mensagem"><span class="time">(${mensagem.time}) </span><strong class="nome from">${mensagem.from}</strong> para <strong class="nome to">${mensagem.to}</strong>: ${mensagem.text}</p>
        </div>
        `
}

function configurarMensagemPrivada(mensagem){
    if (mensagem.to === usuario){
        chat.innerHTML += `
        <div class="mensagem reservada">
            <p class="mensagem"><span class="time">(${mensagem.time}) </span><strong class="nome from">${mensagem.from}</strong> reservadamente para <strong class="nome to">${mensagem.to}</strong>: ${mensagem.type}</p>
        </div>
        `
    }
}

function permanecerNaSala(){
    intervaloUm = setInterval(enviarUsuario, 5000);
    intervaloDois = setInterval(carregarMensagens, 3000);
}

function sairDaSala(){
    alert('Você foi desconectado, entre novamente.');
    clearInterval(intervaloUm);
    clearInterval(intervaloDois);
    entrarNaSala();
}

entrarNaSala();