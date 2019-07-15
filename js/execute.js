

//Ao iniciar a página, carregar o tabuleiro
document.addEventListener("DOMContentLoaded", function(event) {// INICIA TUDO
    
    // Inicia e cria o tabuleiro com o nome do container que receberá o mesmo
    new Tabuleiro('tabuleiro'); 
});


function Tabuleiro(div){
    this.matriz = [];
    this.rainhas = []
    this.bloqueantes = []; 
    this.table = document.createElement('table');
    this.table.border = "1";
    document.getElementById(div).appendChild(this.table);
    this.init();
}


// Inicializador do tabuleiro
Tabuleiro.prototype.init = function(){
    self = this; 
    // Construção da Tabela na interface
    for (let x = 0; x < 8; x++) {
        tr = document.createElement('tr');  // Constrói linha
        this.matriz.push([0,0,0,0,0,0,0,0]); // Inicializa matriz com todas as colunas
        for (let y = 0; y < 8; y++) {

            td = document.createElement('td');
            
            // Adiciona o ícone da rainha, o CSS se preocupa em ocultar ou não
            td.innerHTML += ' <i class="fas fa-chess-queen"></i>';

            // Adiciona o veento de click na célula.
            td.addEventListener('click',function(){
                x = this.getAttribute('x');
                y = this.getAttribute('y');
                self.adicionarRemoverRainha(x,y,this);
            });

            // Define os atributos da célula na interface
            td.setAttribute('value','0');
            td.setAttribute('x',x);
            td.setAttribute('y',y);
            tr.appendChild(td);
        }
        this.table.appendChild(tr);
    }
}

// Adiciona ou remove a rainha do tabuleiro
Tabuleiro.prototype.adicionarRemoverRainha = function(x,y,td){
    permiteAdicionar = this.bloqueantes.length == 0;
    for (let i = 0; i < this.bloqueantes.length; i++) {
        const element = this.bloqueantes[i];

        // se a posição que estou informando for igual a um elemento bloqueante, remover indice
        if (element[0] == x && element[1] == y ){
            permiteAdicionar = true;
            break;
        }
    }
    if (permiteAdicionar){
        this.bloqueantes = [];

        // Se o valor na posição X e Y for igual a '1' quer dizer que estou removendo-o
        if (this.matriz[x][y] == 1){ 
            this.matriz[x][y] = 0;
            td.setAttribute('value',0);

            //remove a rainha da lista
            for (let index = 0; index < this.rainhas.length; index++) {
                if (this.rainhas[index][0] == x && this.rainhas[index][1] == y ){
                    this.rainhas.splice(index,1);
                    break;
                }
            }
        }else{
            this.matriz[x][y] = 1;
            td.setAttribute('value',1);
            this.rainhas.push([x,y])
        }
    }

    // Cada rainha passa por uma verificação, permitindo assim excluir ela ou outras raínhas bloqueantes
    this.rainhas.forEach(element => {
        this.analisar(element[0],element[1]);
    });

    // Mensagem de vitória mais broxante do mundo
    if (this.rainhas.length == 8 && this.bloqueantes.length == 0){
        alert('Você venceu! EEeee...')
    }
}

Tabuleiro.prototype.analisar = function(x,y){
    
    possuiBloqDiagonalSuperiorEsquerda = function(){
        let diagX = x;
        let diagY = y;
        
        // Identifica o primeiro index diagonal superior esquerda
        while(diagX != 0 && diagY != 0){
            diagX--; diagY--;
        }

        // Percorre a diagonal ignorando a própria posição
        while(diagX != 8 && diagY != 8){
            if (self.matriz[diagX][diagY] != 0 && diagX != x && diagY != y){
                return true;
            }
            diagX++; diagY++;
        }
        return false;
    }

    possuiBloqDiagonalInferiorEsquerda = function(){
        let diagX = x;
        let diagY = y;

        // Identifica o primeiro index diagonal inferior esquerda
        while(diagX != 7 && diagY != 0){
            diagX++; diagY--;
        }

        // Percorre a diagonal ignorando a própria posição
        while(diagX != -1 && diagY != 8){
            if (self.matriz[diagX][diagY] != 0 && diagX != x && diagY != y){
                return true;
            }
            diagX--; diagY++;
        }
        return false;
    }

    possuiBloqHorizontal = function(){
        let yMat = y;
        // Percorre a horizontal ignorando a própria posição
        for (yMat = 0; yMat <=7; yMat++){
            if (self.matriz[x][yMat] != 0 && yMat != y){
                return true;
            }
        }
        return false;
    }

    possuiBloqVertical = function(){
        let xMat = x;
        // Percorre a vertical ignorando a própria posição
        for (xMat = 0; xMat <=7; xMat++){
            if (self.matriz[xMat][y] != 0 && xMat != x){
                return true;
            }
        }
        return false;
    }

    // Caso seja identificado alguma rainha bloqueante, ele adiciona a si mesmo na lista.
    if (possuiBloqDiagonalInferiorEsquerda() ||
        possuiBloqDiagonalSuperiorEsquerda() ||
        possuiBloqHorizontal() ||
        possuiBloqVertical())
    {
        this.bloqueantes.push([x,y])
        document.querySelectorAll('[x="'+x+'"][y="'+y+'"]')[0].className = 'bloqueante';
    }else{
        document.querySelectorAll('[x="'+x+'"][y="'+y+'"]')[0].className = '';
    }
    
    // imprime matriz
    //console.log(this.matriz);
}