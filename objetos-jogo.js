// objetos-jogo.js
// aqui ficam os objetos e como eles reagem às ferramentas
// cada objeto conhece a engine o suficiente pra sinalizar letras, vitória ou derrota

import { Objeto } from './basicas-oo.js';
import { Lanterna, ChaveDourada, Dicionario } from './ferramentas-jogo.js';

export class Xicara extends Objeto {
  constructor(engine) { super('xícara', 'uma xícara com pintura apagada.', 'a pintura revelou algo.'); this.engine = engine; }
  usar(f) {
    if (f instanceof Lanterna) { this.acaoOk = true; this.engine?.adicionarLetra('C'); return true; }
    return false;
  }
}

export class LivroRasgado extends Objeto {
  constructor(engine) { super('livro rasgado', 'as páginas estão escuras.', 'as páginas mostram rabiscos.'); this.engine = engine; }
  usar(f) {
    if (f instanceof Lanterna) { this.acaoOk = true; this.engine?.adicionarLetra('B'); this.engine?.adicionarLetra('O'); return true; }
    return false;
  }
}

export class EspelhoRachado extends Objeto {
  #revelou;
  constructor(engine) { super('espelho', 'um espelho rachado.', 'o espelho já mostrou o que podia.'); this.engine = engine; this.#revelou = false; }
  ler() {
    if (this.#revelou) return { ok:false, msg:'nada novo aparece.' };
    this.#revelou = true;
    this.engine?.adicionarLetra('A');
    return { ok:true, msg:'entre as rachaduras, surge a letra a. o diário registra automaticamente.' };
  }
}

export class CaixaDeMusica extends Objeto {
  #aberta;
  constructor(engine) { super('caixa de música', 'uma caixa antiga fechada.', 'a caixa já foi aberta.'); this.engine = engine; this.#aberta = false; }
  ouvir() {
    if (this.#aberta) return { ok:false, msg:'a caixa de música já foi aberta.' };
    this.#aberta = true;
    this.acaoOk = true;
    this.engine?.desbloquearDicionarioEGerarChave();
    return { ok:true, msg:'a tampa range e se abre. a melodia ecoa e o dicionário se desfaz das fitas; uma chave dourada aparece.' };
  }
  abrir() { return this.ouvir(); }
}

export class BauTrancado extends Objeto {
  #aberto;
  constructor(engine) { super('baú trancado', 'um baú robusto trancado.', 'o baú foi aberto.'); this.engine = engine; this.#aberto = false; }
  usar(f) {
    if (!(f instanceof ChaveDourada)) return false;
    if (this.#aberto) return false;
    this.#aberto = true;
    this.acaoOk = true;
    this.engine?.adicionarLetra('O');
    this.engine?.adicionarLetra('D');
    return true;
  }
}

export class PortaCongelada extends Objeto {
  constructor(engine) { super('porta congelada', 'uma porta selada por gelo.', 'o gelo se partiu e a passagem está livre.'); this.engine = engine; }
  usar(f) {
    if (!(f instanceof Dicionario)) return false;
    if (!f.desbloqueado) { this.engine?.out('o caderno não responde, é como se as palavras estivessem presas ainda', 'error'); return false; }
    if (!this.engine?.temTodasLetras()) { this.engine?.out('o dicionário mostra letras faltando', 'error'); return false; }
    this.acaoOk = true;
    this.engine?.vitoria();
    return true;
  }
}

export class Samovar extends Objeto {
  constructor() { super('samovar', 'um samovar antigo com inscrições.', 'nada mais novo por aqui.'); }
  ler() { return { ok:true, msg:'uma inscrição em russo: “paciência é um chá doce”.' }; }
}

export class Pires extends Objeto {
  #quebrou;
  constructor() { super('pires', 'um pires muito fino.', 'o pires se quebrou todo.'); this.#quebrou = false; }
  abrir() {
    if (this.#quebrou) return { ok:false, msg:'já está em cacos.' };
    this.#quebrou = true; this.acaoOk = true;
    return { ok:false, msg:'você tenta tocar no pires e ele se quebra em pedaços.' };
  }
}

export class MalaAntiga extends Objeto {
  #aberta;
  constructor(engine) { super('mala antiga', 'uma mala pesada.', 'a mala já está aberta.'); this.engine = engine; this.#aberta = false; }
  abrir() {
    if (this.#aberta) return { ok:false, msg:'nada além de roupas velhas.' };
    // derrota se abrir com a chave no inventário (perde a única chance de abrir o baú)
    if (this.engine?.mochila.tem('chave')) {
      this.engine.mochila.descartar('chave');
      this.#aberta = true; this.acaoOk = true;
      this.engine.derrota('a chave se quebra na sua mão! agora não poderá abrir o baú...');
      return { ok:false, msg:'fim de jogo - você não pode mais abrir o baú trancado.' };
    }
    this.#aberta = true; this.acaoOk = true;
    return { ok:true, msg:'dentro há roupas velhas e papéis rasgados.' };
  }
}

export class EstatuaDeGelo extends Objeto {
  constructor() { super('estátua de gelo', 'uma estátua translúcida.', 'a estátua continua fria e silenciosa.'); }
}
