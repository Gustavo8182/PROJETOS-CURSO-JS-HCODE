const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor(){
        this._confg  = {
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
        if(!this._initialized){
            firebase.initializeApp(this._confg);            
            firebase.firestore().settngs({
                timestampsInSnapshorts:true
            })
            this._initialized = true;
        }};//close init

        //metodo estatico para retona banco
    static bd(){
        return firebase.firestorage();
    }
    
        //metodo estatico para retona armazenamento na nuvem
    static hd(){
        return firebase.storage();
    }

    //const app = initializeApp(firebaseConfig);

}