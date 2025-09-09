// salas-jogo.js
// aqui eu monto cada sala com seus objetos e ferramentas

import { Sala } from './basicas-oo.js';
import { Lanterna, Dicionario, Diario } from './ferramentas-jogo.js';
import { Xicara, LivroRasgado, CaixaDeMusica, BauTrancado, EspelhoRachado, PortaCongelada, Samovar, Pires, MalaAntiga, EstatuaDeGelo } from './objetos-jogo.js';

export class Hall extends Sala {
  constructor(engine) {
    super('Hall', engine);
    // ferramentas iniciais colocadas aqui
    this.ferramentas.set('diário', new Diario());
    this.ferramentas.set('dicionário', new Dicionario());
    this.ferramentas.set('lanterna', new Lanterna());
  }
}

export class SalaDeCha extends Sala {
  constructor(engine) {
    super('Sala de Chá', engine);
    this.objetos.set('xícara', new Xicara(engine));
    this.objetos.set('samovar', new Samovar());
    this.objetos.set('pires', new Pires());
  }
}

export class Biblioteca extends Sala {
  constructor(engine) {
    super('Biblioteca', engine);
    this.objetos.set('livro rasgado', new LivroRasgado(engine));
  }
}

export class Quarto extends Sala {
  constructor(engine) {
    super('Quarto', engine);
    this.objetos.set('caixa de música', new CaixaDeMusica(engine));
    this.objetos.set('espelho', new EspelhoRachado(engine));
  }
}

export class Atico extends Sala {
  constructor(engine) {
    super('Ático', engine);
    this.objetos.set('baú trancado', new BauTrancado(engine));
    this.objetos.set('mala antiga', new MalaAntiga(engine));
  }
}

export class JardimInvernal extends Sala {
  constructor(engine) {
    super('Jardim Invernal', engine);
    this.objetos.set('porta congelada', new PortaCongelada(engine));
    this.objetos.set('estátua de gelo', new EstatuaDeGelo());
  }
}
