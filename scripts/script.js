let usuario = null;
let objetoUsuario = null;
const chat = document.querySelector('.chat');
const telaEntrada = document.querySelector('.entrada');
const telaLoading = document.querySelector('.loading');
const telaLogin = document.querySelector('.login');
let ultimaMensagem = null;
let intervaloUm = null;
let intervaloDois = null;
let to = 'Todos';
let type = 'message';

function entrarNaSala(){
    usuario = document.querySelector('.nome').value
    objetoUsuario = {
        name: usuario
    };
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', objetoUsuario);
    promessa.then(carregarMensagens);
    promessa.then(carregarParticipantes);
    promessa.then(permanecerNaSala);
    promessa.catch(checarUsuario);
    telaEntrada.classList.add('escondido');
    telaLoading.classList.remove('escondido');
}

function enviarUsuario(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', objetoUsuario);
    promessa.catch(sairDaSala);
}

function checarUsuario(erro){
    statusCode = erro.response.status;
    alert('Usuário já existe, insira outro.');
    telaEntrada.classList.remove('escondido');
}

function carregarMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(renderizarMensagens);
}

function renderizarMensagens(resposta){
    telaLogin.classList.add('escondido');
    chat.innerHTML = '';
    let mensagens = resposta.data;
    let tamanho = mensagens.length - 1;
    for (let i = 0; i < tamanho; i++){
        configurarMensagem(mensagens[i]);
        ultimaMensagem = document.querySelector('.chat > .mensagem:last-child');
        ultimaMensagem.scrollIntoView();
    }
    enviarPara();
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
    <li class="mensagem status">
        <p class="mensagem"><span class="time">(${mensagem.time}) </span><strong class="nome from">${mensagem.from}</strong> ${mensagem.text}</p>
    </li>
    `
}

function configurarMensagemNormal(mensagem){
    chat.innerHTML += `
        <li class="mensagem normal">
            <p class="mensagem"><span class="time">(${mensagem.time}) </span><strong class="nome from">${mensagem.from}</strong> para <strong class="nome to">${mensagem.to}</strong>: ${mensagem.text}</p>
        </li>
        `
}

function configurarMensagemPrivada(mensagem){
    if (mensagem.to === usuario || mensagem.from === usuario || mensagem.to === 'Todos'){
        chat.innerHTML += `
        <li class="mensagem reservada">
            <p class="mensagem"><span class="time">(${mensagem.time}) </span><strong class="nome from">${mensagem.from}</strong> reservadamente para <strong class="nome to">${mensagem.to}</strong>: ${mensagem.text}</p>
        </li>
        `
    }
}

function carregarParticipantes(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promessa.then(renderizarParticipantes);
}

function renderizarParticipantes(resposta){
    to = 'Todos';
    let participantes = document.querySelector('.participantes');
    participantes.innerHTML = `
    <div class="todos">
        <ion-icon name="people-sharp"></ion-icon>
        <p>Todos</p>
        <ion-icon name="checkmark-sharp" class="check"></ion-icon>
    </div>
    `
    for (let i = 0; i < resposta.data.length; i++){
        configurarParticipante(resposta.data[i]);
    }
}

function configurarParticipante(participante){
    let participantes = document.querySelector('.participantes');
    participantes.innerHTML += `
    <div class="participante" onclick="escolherParticipante(this)">
        <ion-icon name="person-circle"></ion-icon>
        <p>${participante.name}</p>
        <ion-icon name="checkmark-sharp" class="check escondido"></ion-icon>
    </div>
    `
}

function mostrarSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('escondido');
}

function ocultarSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('escondido');
}

function escolherParticipante(div){
    const participante = div.querySelector('p');
    to = participante.innerHTML;
    marcarCheck('participantes', div);
    enviarPara();
}

function escolherVisibilidade(div){
    const visibilidade = div.querySelector('p').innerHTML;
    if (visibilidade === 'Público'){
        type = 'message';
    } else if (visibilidade === 'Reservadamente'){
        type = 'private_message';
    }
    marcarCheck('visibilidade', div);
    enviarPara();
}

function marcarCheck(div, escolhido){
    let check = document.querySelectorAll(`.${div} .check`);
    for (let i = 0; i < check.length; i++){
        check[i].classList.add('escondido');
    }
    check = escolhido.querySelector('.check');
    check.classList.remove('escondido');
}

function enviarPara(){
    let aviso = document.querySelector('footer p');
    let visibilidade = null;
    if (type === 'message'){
        visibilidade = 'pública';
    } else if(type === 'private_message'){
        visibilidade = 'reservadamente'
    }
    aviso.innerHTML = `Enviando para ${to} (${visibilidade})`;
}

function enviarMensagem(){
    const texto = document.querySelector('footer input').value;
    
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
        clearInterval(intervaloTres);
        promessa.then(carregarMensagens);
        limparInput();
        promessa.catch(sairDaSala);
        promessa.then(permanecerNaSala);
    }
}

function limparInput(){
    let texto = document.querySelector('footer input');
    texto.value = '';
}

function permanecerNaSala(){
    intervaloUm = setInterval(enviarUsuario, 5000);
    intervaloDois = setInterval(carregarMensagens, 3000);
    intervaloTres = setInterval(carregarParticipantes, 10000);
}

function sairDaSala(){
    alert('Você foi desconectado, entre novamente.');
    clearInterval(intervaloUm);
    clearInterval(intervaloDois);
    window.location.reload(true);
}

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        let btn = document.querySelector(".submit");
      btn.click();
    }
  });