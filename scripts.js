const Modal = { //Criando a funcionalidade dentro do onjeto Modal
        open(){
            //Abrir o Modal
            //Adicionar a class active ao modal
            //alert('Abri o modal') //Funcionalidade (Funcao) ALERT
            document
                .querySelector('.modal-overlay')
                .classList
                .add('active')
        },
        close(){ //Funcionalidade que remove o nome da classe
            //Fechar o Modal
            //Remover a class active do modal
            document
                .querySelector('.modal-overlay')
                .classList
                .remove('active')
        }
}

const Storage = {
    get() { //get the informations and...
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] //PARSE transforma de STRING para ARRAY ou para OBJETO - Caso nao tenha a chave ("dev.finances:transactions") no localStorage OU=||) devolve um ARRAY vazio([]) no get 
    }, 
    set(transactions) { //put the informations (transactions) in LocalStorages
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))//Transformar o ARRAY para uma STRING usando um objeto chamado JSON
    }
}

const Transaction = { //Criando o objeto Transaction (constante) e atribuindo a ele o valor de um outro objeto. CONST RESPONSAVEL PELO CALCULO MATEMATICO DA APLICACAO
    all: Storage.get(),//Os valores do ARRAY abaixo foram trocados pelo LocalStorage

//all: [//Um array
//{
//description: 'Luz',
//amount: -50000,
//date: '23/01/2021',
//},
//{
//    description: 'Website',
//amount: 500000,
//date: '23/01/2021',
//},
//{
//description: 'Internet',
//amount: -20000,
//date: '23/01/2021',
//},
//{
//description: 'App',
//amount: 200000,
//date: '23/01/2021',
//},
//],

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0;//criacao da variavel
        //pegar todas as transações
        //para cada transacao
        Transaction.all.forEach(transaction => {
            //se ela for maior que 0
            if(transaction.amount > 0 ) {
                //somar a uma variavel e retornar a variavel
                income += transaction.amount;//atribuicao da variavel income + o amount
            }
        })
        return income;//retornar a variavel
    },

    expenses(){
        let expense = 0;//criacao da variavel
        //pegar todas as transações
        //para cada transacao
        Transaction.all.forEach(transaction => {
            //se ela for menor que 0
            if(transaction.amount < 0 ) {
                //somar a uma variavel e retornar a variavel
                expense += transaction.amount;//atribuicao da variavel income + o amount
            }
        })
        return expense;//retornar a variavel
    },

    total(){
        return Transaction.incomes() + Transaction.expenses(); //Operacao matematica realizada com INCOMES e EXPENSES
    }
}
//Substituir os dados do HTML com os dados do JS
//Pegar as transações do objeto no JS e colocar no HTML
const DOM = { //Criacao da funcionalida abaixo para substituicao da tabela no html
    transactionsContainer: document.querySelector('#data-table tbody'),//Variavel (transaciotnsContainer)
    addTransaction(transaction, index) { //Criando o tr da CONST HTML em formato de objeto
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)//O "tr.innerHTML" esta capturando o retorno. <br/> DOM e a variavel transactionsContainer e adicionando uma funcionalidade (appendChild)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) { //html interno de uma transacao, e uma funcionalidade
        // `` chama-se template littles, aceita colocar variaveis dentro dela (Chamado de interpolacao)
        const CSSclass = transaction.amount > 0 ? "income": "expense"//Se o transaction.amount for maior que 0 ele preenche com "income" se não "expense"

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html
    },

    updateBalance() { //responsible for formatting INCOMES, EXPENSES and TOTAL. Visual part of HTML (part of DOM)
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}
//OBS: na CONST html ele não permite string normal ("") por isso o erro. Strings normais não permitem quebras de linhas no codigo

const Utils = {
    formatAmount(value) {//Formata os valores inseridos no segundo campo 
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")//split: está procurando todos os '-' e quando achar retorma um array com as posicoes. (SPLIT like SEPARAR)
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`//retornando com a formatacao certa (dia/mes/ano) montando o array e invertendo ele separndo por barra. Usando tambem o Template litres ($) para transformar em uma string
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "" //Trabalha o sinal da formatacao

        value = String(value).replace(/\D/g, "") //g de GLOBAL. Trabalha a remocao de quaisquer caracteres especiais

        value = Number(value) /100 //Multiply by 100 to have decimal places

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL" //Formatting off values
        })

        return signal + value //Return of values (minus "-" or plus "+")
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues (){//Pegar os valores
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {//Validacao dos campos
        const {description, amount, date } = Form.getValues()
        
        if( description.trim() === "" || //Checking if description, amount or date is empity
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor preencha todos os campos!")
            }
    },

    formatValues(){//formatacao dos valores amount e date. Descripition nao tem necessidade de formatacao
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {//return de um objeto (dos valores da variavel let)
            description,
            amount,
            date
        }
    },

    clearFields() {//limpando os campos
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {//tente:
            //Check if all informations are filled, if they're validate
            Form.validateFields()
            //Format data to save it
            const transaction = Form.formatValues()
            //save (add infomation)
            Transaction.add(transaction)//salvando
            //delet formulary data (clear fields)
            Form.clearFields()
            //close modal
            Modal.close()
        } catch (error) {
            alert(error.message)
        } 
    }
}

const App = {// where feed transactions - Initializating App
    init(){

        //Funcao:
        Transaction.all.forEach(DOM.addTransaction)//funcionalidade executada para cada transacao - Corrigindo e Adicionando Transactions na DOM
        
        DOM.updateBalance()//Atualizando a parte dos cartoes

        Storage.set(Transaction.all)//Atualizando o local storage (onde estao os dados estao sendo armazenados)

    },

    reload(){ //Reload da aplicacao
        DOM.clearTransactions()//Limpando todas as transacoes
        App.init()//Iniciando novamente a aplicacao e indo para o init()
    },
}

App.init()

//A inteligencia que adicionamos ao HTML e CSS.
//21 fevereiro 23:59 prazo se inscrever bolsa.
//Concluir todas as aulas do Maratona,  aulas do discover na plataforma, terminar a aplicação.
//dia 10/02 formulario de inscrição. Concluir28/02 anunciar os vencedores.

//1:07:55
//29.03.2021  2:18:50 (feito a parte de erros do modal para quando for deixar os campos dele em vazio)
//04.04.2021 2:47:00 (excluindo uma transacao)