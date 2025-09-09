// ui.js
// integração dom + engine. todas as orientações e atalhos estão no infinitivo.

import { JogoRussianHouse } from './jogo-russian-house.js';

const outputEl = document.getElementById('output');
const inputEl = document.getElementById('input');
const submitBtn = document.getElementById('submit-btn');
const helpBtn = document.getElementById('help-btn');            // ajudar
const lookBtn = document.getElementById('look-btn');            // olhar
const inventoryBtn = document.getElementById('inventory-btn');  // inventariar
const diaryBtn = document.getElementById('diary-btn');          // exibir diário
const mapRooms = document.querySelectorAll('.map-room');

const inventoryItems = document.getElementById('inventory-items');
const diaryContentEl = document.getElementById('diary-content');

const REQUIRED = 6;
let diarySlots = Array(REQUIRED).fill('_');

function addOutput(text, className = '') {
  const p = document.createElement('p');
  p.textContent = text;
  if (className) p.className = className;
  outputEl.appendChild(p);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function updateInventory(mochila) {
  inventoryItems.innerHTML = '';
  const cap = mochila.capacidade ?? 5;
  const itens = mochila.inventariar();
  itens.forEach(nome => {
    const el = document.createElement('div');
    el.className = 'inventory-item';
    el.textContent = nome;
    inventoryItems.appendChild(el);
  });
  for (let i = itens.length; i < cap; i++) {
    const el = document.createElement('div');
    el.className = 'inventory-item';
    el.textContent = 'Vazio';
    inventoryItems.appendChild(el);
  }
  const title = document.querySelector('.inventory-title');
  if (title) title.textContent = `Mochila (${itens.length}/${cap} slots):`;
}

function updateMap(currentRoomName) {
  const mapIndex = {
    'Hall': 'map-sala1',
    'Sala de Chá': 'map-sala2',
    'Biblioteca': 'map-sala3',
    'Quarto': 'map-sala4',
    'Ático': 'map-sala5',
    'Jardim Invernal': 'map-sala6',
  };
  mapRooms.forEach(r => r.classList.remove('current'));
  const el = document.getElementById(mapIndex[currentRoomName]);
  if (el) el.classList.add('current');
}

function updateDiaryFromOutput(text) {
  // capturar tanto “a letra x foi registrada...” quanto a nova mensagem “registrar letra...”
  const m = text.match(/letra.*?:\s*([A-Za-z])/i);
  if (!m) return;
  const idx = diarySlots.indexOf('_');
  if (idx >= 0) {
    diarySlots[idx] = m[1].toUpperCase();
    diaryContentEl.textContent = diarySlots.join(' ');
  }
}

const jogo = new JogoRussianHouse({
  onOutput(text, cls) {
    addOutput(text, cls);
    updateDiaryFromOutput(text);
  },
  onEnd() {
    
    // inputEl.disabled = true; submitBtn.disabled = true;
  },
  onStateChange({ sala, mochila }) {
    updateInventory(mochila);
    updateMap(sala.nome);
  }
});

// listeners
submitBtn?.addEventListener('click', () => {
  const cmd = inputEl.value.trim();
  if (!cmd) return;
  inputEl.value = '';
  jogo.processarComando(cmd);
});

inputEl?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const cmd = inputEl.value.trim();
    if (!cmd) return;
    inputEl.value = '';
    jogo.processarComando(cmd);
  }
});

// atalhos no infinitivo
helpBtn?.addEventListener('click', () => jogo.processarComando('ajudar'));
lookBtn?.addEventListener('click', () => jogo.processarComando('olhar'));
inventoryBtn?.addEventListener('click', () => jogo.processarComando('inventariar'));
diaryBtn?.addEventListener('click', () => addOutput(`exibir diário: ${diarySlots.join(' ')}`, 'success'));

// clique no mapa: “sair [sala]”
mapRooms.forEach(room => {
  room.addEventListener('click', function () {
    const roomName = this.textContent.trim();
    if (roomName && roomName !== 'Vazio') {
      jogo.processarComando('sair ' + roomName);
    }
  });
});
