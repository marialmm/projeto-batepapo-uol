let usuario = prompt('Qual seu nome?');
let objetoUsuario = null;
const chat = document.querySelector('main');
let ultimaMensagem = null;
let intervaloUm = null;
let intervaloDois = null;
let to = 'Todos';
let type = 'message';

function entrarNaSala(){
    objetoUsuario = {
        name: usuario
    };
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', objetoUsuario);
    promessa.then(carregarMensagens);
    promessa.then(permanecerNaSala);
    promessa.catch(checarUsuario);
}

function enviarUsuario(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', objetoUsuario);
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
    chat.innerHTML = '';
    let mensagens = resposta.data;
    let tamanho = mensagens.length - 1;
    for (let i = 0; i < tamanho; i++){
        configurarMensagem(mensagens[i]);
        ultimaMensagem = document.querySelector('main > .mensagem:last-child');
        ultimaMensagem.scrollIntoView();
    }
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
    window.location.reload();
}

function enviarMensagem(){
    const texto = document.querySelector('input').value;
    if (texto !== ''){
        mensagem = {
            from: usuario,
            to: to,
            text: texto,
            type: type
        };
        const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', mensagem);
        clearInterval(intervaloUm);
        clearInterval(intervaloDois);
        promessa.then(carregarMensagens);
        limparInput();
        promessa.catch(sairDaSala);
        promessa.then(permanecerNaSala);
    }
}

function limparInput(){
    let texto = document.querySelector('input');
    texto.value = '';
}

entrarNaSala();