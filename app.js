// Substitua pela URL da sua implantação do Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyp2MffJ--fMhdoI68YI8bsg5-OteTLX5KzP1DHwSfPwo4tK_jg5QIulMiui6glFxeg0Q/exec";

// Mascarar campo de valor do lance para Moeda em Real
document.getElementById('valorLance').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value === '') {
    e.target.value = '';
    return;
  }
  value = (parseFloat(value) / 100).toFixed(2) + '';
  value = value.replace(".", ",");
  value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  e.target.value = 'R$ ' + value;
});

function nextStep(stepNumber) {
  // Validações por etapa
  if (stepNumber === 2) {
    if (!document.getElementById('valorCarta').value || !document.getElementById('estadoImovel').value) {
      alert('Por favor, preencha todas as opções da Etapa 1.');
      return;
    }
  }
  if (stepNumber === 3) {
    if (!document.getElementById('valorLance').value || !document.getElementById('parcela').value) {
      alert('Por favor, preencha o valor do lance e a parcela.');
      return;
    }
  }

  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById('step' + stepNumber).classList.add('active');

  const progressMap = { 1: '33.33%', 2: '66.66%', 3: '100%' };
  document.getElementById('progressBar').style.width = progressMap[stepNumber];
}

document.getElementById('leadForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const btnSubmit = document.getElementById('btnSubmit');
  btnSubmit.innerText = "Processando Estudo...";
  btnSubmit.disabled = true;

  const payload = {
    valorCarta: document.getElementById('valorCarta').value,
    estadoImovel: document.getElementById('estadoImovel').value,
    valorLance: document.getElementById('valorLance').value,
    parcela: document.getElementById('parcela').value,
    nome: document.getElementById('nome').value,
    whatsapp: document.getElementById('whatsapp').value,
    horarioContato: document.getElementById('horarioContato').value
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('stepSuccess').classList.add('active');
    document.querySelector('.progress-container').style.display = 'none';
  })
  .catch(error => {
    alert('Ocorreu um erro ao enviar a solicitação. Tente novamente.');
    btnSubmit.innerText = "Solicitar Estudo de Viabilidade";
    btnSubmit.disabled = false;
  });
});