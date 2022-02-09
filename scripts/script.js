const usuario = prompt('Qual seu nome?');
const chat = document.querySelector('main');
let ultimaMensagem = null;


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
    // if (mensagem.to === usuario){
        chat.innerHTML += `
        <div class="mensagem reservada">
            <p class="mensagem"><span class="time">(${mensagem.time}) </span><strong class="nome from">${mensagem.from}</strong> reservadamente para <strong class="nome to">${mensagem.to}</strong>: ${mensagem.type}</p>
        </div>
        `
    // }
}

carregarMensagens();
setInterval(carregarMensagens, 3000);