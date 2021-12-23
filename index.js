//Forma trabalhhosa de egar os dados de cada campo,estamos selecunando um query do documento.
/*var name = document.querySelector("#exampleInputName");
var gender = document.querySelectorAll("#form-user-create [name=gender]:checked");
var birth = document.querySelector("#exampleInputBirth");
var country = document.querySelector("#exampleInputCountry");
var email = document.querySelector("#exampleInputEmail1");
var password = document.querySelector("#exampleInputPassword1");
var photo = document.querySelector("#exampleInputFile");
var admin = document.querySelector("#exampleInputAdmin");
*/
var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

function addLine(dataUser){
    //criamos um elemento do html chamdo tr
    var tr = document.createElement("tr");
    //adiconamor um codigo html para o tr
    document.querySelector("#table-users").innerHTML = `
  <tr>
    <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${dataUser.admin}</td>
    <td>${dataUser.birth}</td>
    <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  </tr>`;

}

document.querySelector("#form-user-create").addEventListener("submit", function(event){
    //estamos cancelando o metodo padrão do formulario que seria enviar para agum lgar e atualziar a pagina.
    event.preventDefault();
    //pegamos todos os dados que estavam no formularo e adiconamos a um json   
    fields.forEach(function(field,index){
        if(field.name === "gender"){
            if(field.checked){
                user[field.name] = field.value;
            }
        }else{
            user[field.name] = field.value;
        }
    });

    var objectUser = new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    )
    addLine(objectUser)    
});
