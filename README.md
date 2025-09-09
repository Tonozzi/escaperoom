# Russian house – Escape Room

um jogo de texto em estilo **adventure** feito em **javascript + html + css**.  
o objetivo é explorar uma casa russa, encontrar pistas escondidas e decifrar a palavra secreta para escapar.

---

## requisitos

- **servidor local** simples (não abrir direto com `file://`, pois usei módulos es6).  

formas rápidas de rodar servidor local:

### opção 1 – live server no vs code
- abrir a pasta do projeto no **vs code**.  
- instalar a extensão **live server**.  
- clicar com botão direito no arquivo `scape_roomV3.html` → **open with live server**.  
- o jogo abre em `http://127.0.0.1:5500/scape_roomV3.html`.

### opção 2 – python
se tiver python 3 instalado:
```bash
cd pasta/do/projeto
python3 -m http.server 5500
