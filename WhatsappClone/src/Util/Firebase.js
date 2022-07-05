const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor(){
        this._config  = {
            apiKey: "AIzaSyAKPnMF6zqLGmRWLLvGIH2ITxKOJdr03BY",
            authDomain: "wpp-clone-br.firebaseapp.com",
            projectId: "wpp-clone-br",
            storageBucket: "wpp-clone-br.appspot.com",
            messagingSenderId: "697594727829",
            appId: "1:697594727829:web:43bd314045b4e645b73a9c",
            measurementId: "G-9XDST8S0HF"
          };
        this.init();
    }
    
        //metodo para inicializar o firebase
    init(){
        if(!window._initializedFirebase){
            firebase.initializeApp(this._config);            
            firebase.firestore().settings({
                timestampsInSnapshots:true
            });
            window._initializedFirebase = true;
        }};//close init

        //metodo estatico para retona banco
    static db(){
        return firebase.firestorage();
    }
    
        //metodo estatico para retona armazenamento na nuvem
    static hd(){
        return firebase.storage();
    }

    initAuth(){
        return new Promise((s,f)=>{
            // metodo que vai abrir um popo perguntando qual conta vamos usar; OBG habilitar noprojeto no firebase.
            let provider = new  firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(result =>{                
                    let token =  result.credential.accessToken;
                    let user = result.user;
                    s({
                        user,
                        token
                    });
                }).catch(err=>{
                    f(err);
            })
        })
    }

    //const app = initializeApp(firebaseConfig);

}