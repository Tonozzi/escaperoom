

import { Engine } from './basicas-oo.js';
import { Hall, SalaDeCha, Biblioteca, Quarto, Atico, JardimInvernal } from './salas-jogo.js';
import { ChaveDourada } from './ferramentas-jogo.js';

export class JogoRussianHouse extends Engine {
  #letras;
  #requeridas;

  constructor(io) {
    super(io);
    this.#letras = [];
    this.#requeridas = 6;
  }

  criaCenario() {
    const hall = new Hall(this);
    const cha = new SalaDeCha(this);
    const bib = new Biblioteca(this);
    const quarto = new Quarto(this);
    const atico = new Atico(this);
    const jardim = new JardimInvernal(this);

    hall.portas.set(cha.nome, cha);

    cha.portas.set(hall.nome, hall);
    cha.portas.set(bib.nome, bib);
    cha.portas.set(quarto.nome, quarto);
    cha.portas.set(atico.nome, atico);

    bib.portas.set(cha.nome, cha);
    quarto.portas.set(cha.nome, cha);

    atico.portas.set(cha.nome, cha);
    atico.portas.set(jardim.nome, jardim);

    jardim.portas.set(atico.nome, atico);

    this.salaCorrente = hall;

    
    this.out('iniciar exploração usando comandos', 'success');
    this.out('exemplos: "pegar lanterna", "sair Sala de Chá", "usar lanterna xícara".', 'success');
    this.out('para visualizar a lista completa, digitar "ajudar".', 'success');

    this.olhar();
  }

  adicionarLetra(l) {
    this.#letras.push(l);
    this.out(`registrar letra no diário: ${l}.`, 'success');
    this.emitState();
  }

  temTodasLetras() { return this.#letras.length >= this.#requeridas; }

  desbloquearDicionarioEGerarChave() {
    const dic = this.mochila.pegar('dicionário');
    if (dic && typeof dic.desbloquear === 'function') {
      dic.desbloquear();
      this.out('desbloquear dicionário no inventário.', 'success');
    }
    const ok = this.mochila.guardar(new ChaveDourada());
    if (ok) this.out('adicionar chave dourada à mochila.', 'success');
    else this.out('liberar espaço na mochila para receber a chave dourada.', 'error');
    this.emitState();
  }

  vitoria() {
    this.out('formar a palavra correta e abrir passagem de gelo.', 'success');
    this.out('concluir objetivo com sucesso.', 'success');
    this.indicaFimDeJogo();
  }

  derrota(msg) {
    this.out(msg || 'encerrar partida sem concluir objetivo.', 'error');
    this.indicaFimDeJogo();
  }
}
