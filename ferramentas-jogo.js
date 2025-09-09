

import { Ferramenta } from './basicas-oo.js';

export class Lanterna extends Ferramenta {
  #usos;
  constructor() {
    super('lanterna');
    this.#usos = 3; // requisito de energia/uso limitado
  }
  get usosRestantes() { return this.#usos; }
  usar() {
    if (this.#usos <= 0) return false;
    this.#usos -= 1;
    return true;
  }
}

export class ChaveDourada extends Ferramenta {
  #usos;
  constructor() {
    super('chave');
    this.#usos = 1; // se usar onde não deveria, vai acabar e causar derrota indireta
  }
  usar() {
    if (this.#usos <= 0) return false;
    this.#usos -= 1;
    return true;
  }
}

export class Dicionario extends Ferramenta {
  #desbloqueado;
  constructor() {
    super('dicionário');
    this.#desbloqueado = false;
  }
  get desbloqueado() { return this.#desbloqueado; }
  desbloquear() { this.#desbloqueado = true; }
  usar() { return true; }
}

export class Diario extends Ferramenta {
  constructor() { super('diário'); }
  usar() { return true; }
}
