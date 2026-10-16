const formularioPreCadastro = document.querySelector("#formulario-pre-cadastro");
const campoNome = document.querySelector("#nome");
const campoEmail = document.querySelector("#email");
const campoWhatsapp = document.querySelector("#whatsapp");
const botaoEnvio = document.querySelector("#botao-envio");
const mensagemFormulario = document.querySelector("#mensagem-formulario");

function obterNumeroWhatsapp(valor) {
  let numeros = valor.replace(/\D/g, "");

  if (numeros.startsWith("55") && (numeros.length === 12 || numeros.length === 13)) {
    numeros = numeros.slice(2);
  }

  return numeros;
}

function formatarWhatsapp(valor) {
  const numeros = obterNumeroWhatsapp(valor).slice(0, 11);

  if (numeros.length < 3) {
    return numeros.length > 0 ? `(${numeros}` : "";
  }

  const codigoArea = numeros.slice(0, 2);
  const numeroLocal = numeros.slice(2);
  const parteInicial = numeroLocal.length > 8 ? numeroLocal.slice(0, 5) : numeroLocal.slice(0, 4);
  const parteFinal = numeroLocal.length > 8 ? numeroLocal.slice(5) : numeroLocal.slice(4);

  return `(${codigoArea}) ${parteInicial}${parteFinal ? `-${parteFinal}` : ""}`;
}

function definirErro(campo, texto) {
  const campoErro = document.querySelector(`#erro-${campo.id}`);
  campo.setAttribute("aria-invalid", texto ? "true" : "false");
  campoErro.textContent = texto;
}

function validarFormulario() {
  let formularioValido = true;
  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  const whatsapp = obterNumeroWhatsapp(campoWhatsapp.value);

  definirErro(campoNome, "");
  definirErro(campoEmail, "");
  definirErro(campoWhatsapp, "");

  if (!nome) {
    definirErro(campoNome, "Informe seu nome.");
    formularioValido = false;
  }

  if (!email) {
    definirErro(campoEmail, "Informe seu e-mail.");
    formularioValido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    definirErro(campoEmail, "Informe um e-mail válido.");
    formularioValido = false;
  }

  if (!whatsapp) {
    definirErro(campoWhatsapp, "Informe seu WhatsApp.");
    formularioValido = false;
  } else if (!/^\d{10,11}$/.test(whatsapp)) {
    definirErro(campoWhatsapp, "Informe um número com DDD e 10 ou 11 dígitos.");
    formularioValido = false;
  }

  if (!formularioValido) {
    mensagemFormulario.textContent = "Confira os campos destacados para continuar.";
    const primeiroCampoInvalido = formularioPreCadastro.querySelector('[aria-invalid="true"]');
    primeiroCampoInvalido?.focus();
  }

  return formularioValido;
}

function confirmarRetornoDoWhatsapp() {
  try {
    if (sessionStorage.getItem("EVILINT-AI") !== "confirmada") {
      return;
    }

    sessionStorage.setItem("EVILINT-AI", "confirmada");
  } catch {
    mensagemFormulario.textContent = "Não foi possível confirmar o retorno do WhatsApp nesta sessão.";
    return;
  }

  window.location.replace("cadastro.html");
}

window.addEventListener("pageshow", confirmarRetornoDoWhatsapp);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    confirmarRetornoDoWhatsapp();
  }
});

campoWhatsapp.addEventListener("input", () => {
  campoWhatsapp.value = formatarWhatsapp(campoWhatsapp.value);
  if (campoWhatsapp.hasAttribute("aria-invalid")) {
    definirErro(campoWhatsapp, "");
  }
});

[campoNome, campoEmail].forEach((campo) => {
  campo.addEventListener("input", () => {
    if (campo.hasAttribute("aria-invalid")) {
      definirErro(campo, "");
    }
  });
});

formularioPreCadastro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  mensagemFormulario.textContent = "";

  if (!validarFormulario()) {
    return;
  }

  botaoEnvio.disabled = true;
  botaoEnvio.textContent = "Abrindo o WhatsApp…";

  try {
    sessionStorage.setItem("EVILINT-AI", "aguardando-whatsapp");
  } catch {
    botaoEnvio.disabled = false;
    botaoEnvio.textContent = "Quero minha demonstração gratuita";
    mensagemFormulario.textContent = "Não foi possível abrir o WhatsApp nesta sessão. Verifique as configurações do navegador e tente novamente.";
    return;
  }

  window.open("https://wa.me/554396159550", "_blank", "noopener,noreferrer");
});
