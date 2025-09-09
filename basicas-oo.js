// basicas-oo.js
// aqui ficam as classes base do jogo: ferramenta, mochila, objeto, sala e engine
// todos os comandos e orientações estão no infinitivo

const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assert falhou'); };

export class Ferramenta {
  #nome;
  constructor(nome) {
    assert(typeof nome === 'string', 'nome inválido');
    this.#nome = nome;
  }
  get nome() { return this.#nome; }
  usar() { return true; }
}

export class Mochila {
  #itens;
  #capacidade;
  constructor(capacidade = 5) {
    this.#itens = [];
    this.#capacidade = capacidade;
  }
  get capacidade() { return this.#capacidade; }
  get itens() { return [...this.#itens]; }

  guardar(ferramenta) {
    assert(ferramenta instanceof Ferramenta, 'inserir somente ferramentas');
    if (this.#itens.length >= this.#capacidade) return false;
    this.#itens.push(ferramenta);
    return true;
  }
  pegar(nome) {
    return this.#itens.find(f => f.nome === nome) || null;
  }
  tem(nome) {
    return this.#itens.some(f => f.nome === nome);
  }
  inventariar() {
    return this.#itens.map(f => f.nome);
  }
  descartar(nome) {
    const i = this.#itens.findIndex(f => f.nome === nome);
    if (i >= 0) { this.#itens.splice(i, 1); return true; }
    return false;
  }
}

export class Objeto {
  #nome;
  #descricaoAntes;
  #descricaoDepois;
  #acaoOk;
  constructor(nome, descricaoAntes, descricaoDepois) {
    assert(typeof nome === 'string', 'nome inválido');
    this.#nome = nome;
    this.#descricaoAntes = descricaoAntes ?? '';
    this.#descricaoDepois = descricaoDepois ?? '';
    this.#acaoOk = false;
  }
  get nome() { return this.#nome; }
  get acaoOk() { return this.#acaoOk; }
  set acaoOk(v) { this.#acaoOk = !!v; }
  get descricao() { return this.#acaoOk ? this.#descricaoDepois : this.#descricaoAntes; }

  usar(/*ferramenta*/) { return false; }

  // ganchos opcionais
  ler()    { return { ok:false, msg:'não há nada para ler aqui.' }; }
  abrir()  { return { ok:false, msg:'não é possível abrir isso.' }; }
  ouvir()  { return { ok:false, msg:'não há som aqui.' }; }
  sentar() { return { ok:false, msg:'não é possível sentar aqui.' }; }
}

export class Sala {
  #nome;
  #objetos;
  #ferramentas;
  #portas;
  #engine;
  constructor(nome, engine) {
    assert(typeof nome === 'string', 'nome de sala inválido');
    this.#nome = nome;
    this.#engine = engine;
    this.#objetos = new Map();
    this.#ferramentas = new Map();
    this.#portas = new Map();
  }

  get nome() { return this.#nome; }
  get objetos() { return this.#objetos; }
  get ferramentas() { return this.#ferramentas; }
  get portas() { return this.#portas; }
  get engine() { return this.#engine; }

  pegar(nome) {
    const fer = this.#ferramentas.get(nome);
    if (!fer) return false;
    const guardou = this.#engine.mochila.guardar(fer);
    if (!guardou) return false;
    this.#ferramentas.delete(nome);
    return true;
  }

  sair(nomeSala) {
    return this.#portas.get(nomeSala) || null;
  }

  textoDescricao() {
    const objs = [...this.#objetos.values()].map(o => `${o.nome}:${o.descricao}`).join(', ') || 'nenhum';
    const fers = [...this.#ferramentas.values()].map(f => f.nome).join(', ') || 'nenhuma';
    const portas = [...this.#portas.values()].map(s => s.nome).join(', ') || 'nenhuma';
    return `você está em ${this.#nome}\nobjetos: ${objs}\nferramentas: ${fers}\nportas: ${portas}`;
  }

  usar(nomeFer, nomeObj) {
    const fer = this.#engine.mochila.pegar(nomeFer);
    const obj = this.#objetos.get(nomeObj);
    if (!fer || !obj) return { ok:false, msg:'não é possível usar isso aqui.' };
    const okFer = fer.usar(obj);
    if (!okFer) return { ok:false, msg:`${fer.nome} não pode funcionar agora.` };
    const ok = obj.usar(fer);
    return { ok, msg: ok ? 'executar ação com sucesso.' : `não foi possível usar ${fer.nome} em ${obj.nome}` };
  }

  ler(nomeObj)    { const o = this.#objetos.get(nomeObj); return o? o.ler():    {ok:false,msg:'localizar objeto antes de ler.'}; }
  abrir(nomeObj)  { const o = this.#objetos.get(nomeObj); return o? o.abrir():  {ok:false,msg:'localizar objeto antes de abrir.'}; }
  ouvir(nomeObj)  { const o = this.#objetos.get(nomeObj); return o? o.ouvir():  {ok:false,msg:'localizar objeto antes de ouvir.'}; }
  sentar(nomeObj) { const o = this.#objetos.get(nomeObj); return o? o.sentar(): {ok:false,msg:'localizar objeto antes de sentar.'}; }
}

export class Engine {
  #mochila;
  #salaCorrente;
  #fim;
  #io;

  constructor(io = {}) {
    this.#mochila = new Mochila(5);
    this.#salaCorrente = null;
    this.#fim = false;
    this.#io = io;
    this.criaCenario();
  }

  get mochila() { return this.#mochila; }
  get salaCorrente() { return this.#salaCorrente; }
  set salaCorrente(s) { this.#salaCorrente = s; this.emitState(); }

  out(t, cls) { if (this.#io.onOutput) this.#io.onOutput(t, cls); }
  emitState() { if (this.#io.onStateChange) this.#io.onStateChange({ sala: this.#salaCorrente, mochila: this.#mochila }); }
  indicaFimDeJogo() { this.#fim = true; if (this.#io.onEnd) this.#io.onEnd(); }

  criaCenario() {}

  processarComando(cmd) {
    if (this.#fim) { this.out('encerrar sessão de jogo. reiniciar para jogar novamente.', 'error'); return; }
    const raw = (cmd || '').trim();
    if (!raw) return;

    this.out('> ' + raw, 'player-input');

    const [acao, ...rest] = raw.split(' ');
    const alvo = rest.join(' ').trim();

    switch ((acao||'').toLowerCase()) {
      case 'sair': {
        const prox = this.#salaCorrente.sair(alvo);
        if (!prox) this.out('informar uma sala válida para sair.', 'error');
        else { this.#salaCorrente = prox; this.olhar(); }
        break;
      }
      case 'pegar': {
        if (this.#salaCorrente.pegar(alvo)) { this.out(`adicionar ${alvo} à mochila.`, 'success'); this.emitState(); }
        else this.out('verificar se a ferramenta está disponível na sala antes de pegar.', 'error');
        break;
      }
      case 'usar': {
        const [item, ...resto] = alvo.split(' ');
        const target = resto.join(' ').trim();
        const r = this.#salaCorrente.usar(item, target);
        this.out(r.msg, r.ok ? 'success' : 'error');
        this.emitState();
        break;
      }
      case 'ler': {
        const r = this.#salaCorrente.ler(alvo);
        this.out(r.msg, r.ok ? 'success' : 'error');
        this.emitState();
        break;
      }
      case 'abrir': {
        const r = this.#salaCorrente.abrir(alvo);
        this.out(r.msg, r.ok ? 'success' : 'error');
        this.emitState();
        break;
      }
      case 'ouvir': {
        const r = this.#salaCorrente.ouvir(alvo);
        this.out(r.msg, r.ok ? 'success' : 'error');
        this.emitState();
        break;
      }
      case 'sentar': {
        const r = this.#salaCorrente.sentar(alvo);
        this.out(r.msg, r.ok ? 'success' : 'error');
        break;
      }
      case 'inventariar': {
        const inv = this.#mochila.inventariar();
        this.out(inv.length ? 'listar itens da mochila: ' + inv.join(', ') : 'manter mochila vazia até pegar itens.', inv.length ? 'success' : 'error');
        break;
      }
      case 'descartar': {
        const ok = this.#mochila.descartar(alvo);
        this.out(ok ? `remover ${alvo} da mochila.` : 'informar um item existente para descartar.', ok ? 'success' : 'error');
        this.emitState();
        break;
      }
      case 'ajudar': {
        this.out(`utilizar comandos no infinitivo:
- sair [nome da sala]
- pegar [nome da ferramenta]
- usar [ferramenta] [objeto]
- ler [objeto]
- abrir [objeto]
- ouvir [objeto]
- sentar [objeto]
- inventariar
- descartar [ferramenta]
- olhar
- ajudar
- finalizar`, 'success');
        break;
      }
      case 'olhar': { this.olhar(); break; }
      case 'finalizar': { this.out('finalizar jogo. obrigado por jogar.', 'success'); this.indicaFimDeJogo(); break; }
      default: this.out("comando não reconhecido. para visualizar a lista, digitar 'ajudar'.", 'error');
    }
  }

  olhar() {
    this.out('='.repeat(50));
    this.out(this.#salaCorrente.textoDescricao(), 'room-desc');
    this.out('='.repeat(50));
    this.emitState();
  }
}
