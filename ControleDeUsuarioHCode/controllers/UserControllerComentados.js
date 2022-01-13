class UserController{

    // estamos pegando o id do formulario e da tabela onde vamos inserir o novo usuario.
    constructor(formIdCreate, formUpdateId, tableId ){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formUpdateId);
        this.tableEl = document.getElementById(tableId);
        
        //estamos inicializando o metodo que vai pegr dados do formulario e adiconar a tabela de novos usuarios logo no construct.
        this.onSubmit();
        //estamos ativando no construtor a fiunção do botão celar do formulario de adição.
        this.onEdit();
    }//fechando metoto construtor

    // paramos o evento padrão do submite e adicionamos o novo evento que é o nosso metodo getvalues;
    onSubmit(){
         /* outra forma de resolver isso é usar as erofunction onde não teremos mais o conflito de escopo.*/
        
         this.formEl.addEventListener("submit", event => {
         //estamos cancelando o metodo padrão do formulario que seria enviar para agum lgar e atualziar a pagina.
            event.preventDefault()
            //aqui estamos pegando o elemento do botão para deixalo desabilitado quando clicar
            let btn = this.formEl.querySelector("[type=submit]");
            btn.disabled = true
            // estamos criando um array com os valores do formulario
            let values = this.getValues(this.formEl);

            //caso tenhamos algum erro no formulario ele retorna um boolean false, e aqu estamos parando o resto da execução para não ter erro no metodo getphoto.
            if (!values) return false
            //estamos chamndo o metodo de pegar foto ler e guardar como base64
            this.getPhotos().then(
                (content)=>{
                    //aqui estams subistituindo o conteudo que vira no array depois do metodo getvalues
                values.photo = content;
                //apos este conteudo da foto esta subtiruido vamos enfim adicionar os elementos do array na tabela.
                // tem que ser feito aqui dentro por questão de escopo.
                this.addLine(values);
                this.formEl.reset();
                btn.disabled = false;

                },
                 (e)=> {
                    console.error(e)

                });            
        });
        
    }//fechando metodo onSubimit

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click',e =>{
            this.showPanelCreate();
            
        });
        
        this.formUpdateEl.addEventListener("submit", event =>{

            event.preventDefault();
            let btn = this.formUpdateEl.querySelector("[type=submit]")
            btn.disabled = true;
            let values = this.getValues(this.formUpdateEl);
                
            //aqui estou pegando o linha que foi clicada na tabela 
            let index = this.formUpdateEl.dataset.trIndex;
            let tr =  this.tableEl.rows[index];
            // estou jogando os dados do meu dataset.user dentro de userold
            let userOld = JSON.parse(tr.dataset.user);
            //estou fazendo uma substituiação de ifnormações com este metoso assing da class Objetc
            // eu recebo o jsom que vem do meu formulario de update e recebo os valores que vem da sobresescrisão desse formulario ou seja oq foi atualizado. 
            // e ai inves de carrega o values  na minha tabela com os novos valores eu carrego a sobre escrisão assim oq não fou alterado permanece
            let result = Object.assign({}, userOld,values);
            if(!values.photo) result._photo = userOld._photo;
            tr.dataset.user = JSON.stringify(values);
            tr.innerHTML =
            `
                <td><img src=${result._photo}alt="User Image" class="img-circle img-sm"></td>
                <td>${result._name}</td>
                <td>${result._email}</td>
                <td>${(result._admin)? 'Sim' : 'Não'}</td>
                <td>${Utils.dataFormat(result._register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;
            this.addEventsTr(tr);
            this.updateCount(); 
            btn.disabled = false;
            this.formUpdateEl.reset();
            this.showPanelCreate();       
        });
        
    }//fechando onEdit   

    getPhotos(){
        //a partir e agora usaremos uma promise para consegui trbalhar com o processamento asicrono
        return  new Promise((resovle, reject )=>{
                
            //para o tratamento da foto usaremos um biblioteca nativa de arquivos que será filereaders.
            let fileReader = new FileReader();
            // com o metodo filter, iremos vacular o array do formulario procurando o elemento com o nome photo e iremos retorna o mesmo.
            let elements = [...this.formEl.elements].filter(item =>{
                if(item.name === 'photo'){
                    return item
                };
            } )

            //adicionamos a foto que esta no array elements, pegamos  o file de dentro deste array, pois ele separa por tipo, e adcionamos a variavel file.
            //isso para conseguimos filtrar nossa foto em um arquivi só.
            let file = elements[0].files[0];

            fileReader.onload = () =>{
                resovle(fileReader.result);
            };

            fileReader.onerror = (e)=>{
                reject(e)
            }
            
            if(file){
                fileReader.readAsDataURL(file);

            }else{
                resovle('dist/img/boxed-bg.jpg');
            }

        });

    } //fechamento metodo getphotos


 //pegamos todos os dados que estavam no formularo e adiconamos a um json   
   
    getValues(formEl){

        let user = {};
        //esta variavel é para validar se os campos obrigatorios estão prenchidos
        let isvalid =  true;
        //com o [... this] estamos transformando um objeto de elemtentos html em um arrey assim não teremos o erro do forech não conseguir ser executado.
        [...formEl.elements].forEach(function(field,index) {
           //aqui estamos verficando se dentro do field tem os campos que falamos no array antes do indesof, depois fazedo validação se o value do field tem algum valor.
            if (['name','email','password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isvalid = false;

            }

        if(field.name == "gender"){
            if(field.checked){
                user[field.name] = field.value;
            }
        }else if (field.name == "admin"){
                user[field.name]= field.checked
        }else{
                user[field.name] = field.value;
            }
        });
        //aqui validamos  estando tudo ok nos campos obrigatorios estão preenchido caso não  ele faz um break aqui e não insere na tabela as informações.
        if (!isvalid) {
            return false;            
        }
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
          );
    } //fechando o metodo getValues
    
    
    addLine(dataUser){
        
        //estamos criando um elemente em html que é o tr
        let tr = document.createElement('tr');
        // aqui estamos criando um dataset que é uma maneira de guarda alguma informação dentro de uma variavel 
        //estamos usando de um biblioteca nativa JSON.strify para covnerter tudo em string pois o dataset acaba tranformando tudo em objeto.
        //agora os dados vindos do json no metodo e o html são string, chamado isso de serilializar informação.
        tr.dataset.user = JSON.stringify(dataUser);

        //Aqui estamos pegando nosso elemento e unindo ele com um html completo, o tr no caso.
        tr.innerHTML =
        `
            <td><img src=${dataUser.photo}alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)? 'Sim' : 'Não'}</td>
            <td>${Utils.dataFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.addEventsTr(tr);
        //aqui nos substitumos a criação direito o innner por um apendchild no id do formulario, pegamos o id, e fazenmos um adição do tr.
        this.tableEl.appendChild(tr);
        
        this.updateCount();    
    } //fechando o metodo addLine

    // este metodo adiciona o evento no botão edite de uma tr que for enviada para ele com um innerHTML
    addEventsTr(tr){
        console.log(tr)
        //aqui estamos usando o botão editar e pegando o dataset da respectiva linha para editar.
        tr.querySelector(".btn-edit").addEventListener("click", e =>{
            let json = JSON.parse(tr.dataset.user);
            //para ajudar na edição, estamos guarando o numero da linha dentro de um dataset, assim podemos saber qual linha foi selecionada para editar, estamos guarando dentro do formulario de update.
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex   ;
            //estamos vendo se dentro do formulario temos os campos que temos no nosso json
            for (let name in json){
                let field = this.formUpdateEl.querySelector("[name="+name.replace("_","")+"]");
                if(field){
                    //verificando se o que esta em field é um do tipo file se for ele pula
                        switch (field.type) {
                            case 'file':
                                continue
                            break;
                            case 'radio':
                                field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                               // field.checked = true;
                            break;
                            case "checkbox":
                                field.checked = json[name];
                            break;
                            default:
                                // se não for do tipo file ele adiciona na tag value do form
                            field.value = json[name];
                            }

                            //field.value = json[name];
                        }
                        
                    }
                    //aqui estamos pegando a nova tag que criamos dentro do formulario de update
                    //onde ficara a foto que vem da tabela para edição.   
                this.formUpdateEl.querySelector(".photo").src = json._photo
                this.showPanelUpdate();
            });
    }
     //este metodo esconde o formulario de edição e habilita o de criação
     showPanelCreate(){
        document.querySelector("#box-user-create").style.display ="block"; 
        document.querySelector("#box-user-update").style.display ="none"; 


    }//fehcando metodo showPanelCreate

    //este metodo esconde o formulario de criação de novo usuario e habilita o de edição.
    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display ="none";
        document.querySelector("#box-user-update").style.display ="block";

    }//fehcando metodo showPanelupdate
    
    //Este metodo irá contar quantas linhas temos na tabela de usuarios, e verificar se é admin ou não para fazermos a contagem geral de admin e usuarios.
    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableId.children].forEach(tr => {
            numberUsers++;
            //como convertemos tudo em string não conseguimos ler aqui e fazer validação, então convertemos tudo de volta para objeto usando
            // um metodo da mesma biblioteca nativa o parse que ira traduzir e interpretar as informações.
            let user = JSON.parse(tr.dataset.user);
            //confirmamos se tem o campo admin e se ele pe verdadeiro
            if(user.admin) numberAdmin++;

        })

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
        
        

    }//fechando metodo updatacount
    
}//fechando class UserController
