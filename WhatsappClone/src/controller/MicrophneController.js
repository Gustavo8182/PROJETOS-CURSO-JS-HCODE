import { ClassEvent } from "../Util/ClassEvent";

export class MicrophneController extends ClassEvent{
    constructor(){

        //chama o construtor da classe pai
        super();
        let _available = false;
        this._mimeType = 'audio/webm';
        navigator.mediaDevices.getUserMedia({
            audio:true
        }).then(straem =>{
            
            this._straem = straem;
            this._available = true;           
            this.trigger('ready', this._straem);

        }).catch(err =>{
            console.log(err);
        })
    }


    isAvailable(){
        return this._available;
    };
     
    stop(){
        this._straem.getTracks().forEach(track => {
            track.stop();            
        });
    }

    startRecorder(){
        if(this.isAvailable()){
            this._mediaRecorder =  new MediaRecorder(this._straem,{
                mimeType: this._mimeType
            });
            this._recordedChunks = [];
            this._mediaRecorder.addEventListener('dataavailable',e=>{
                if(e.data,size>0){
                    this._recordedChunks.push(e.data);
                }
            });

            this._mediaRecorder.addEventListener('stop', e=>{
                let blob = new Blob(this._recordedChunks,{
                    type: this._mimeType
                });
                let filename = `rec${Date.now()}.webm`;
                let file = new File([blob],filename,{
                    type: this._mimeType,
                    lastModified : Date.now()
                });

                console.log('file',file);
            });
            this._mediaRecorder.start();
            this.startTimer();
        }
    };
    stopRecorder(){
        this._mediaRecorder.stop();       
        this.stop();
        this.stopTimer();

    }
    startTimer(){
        let start = Date.now();
        this._recordMicroPhoneInterval = setInterval(() =>{
            //trigger é um catilho sempre que ele é chamado ele verifica se alguemchamou aquela catilho
            this.trigger('recordtime', Date.now() - start);
        }, 100);
    }
    stopTimer(){         
        clearInterval(this._recordMicroPhoneInterval);
    }

    // para saber o tipo de midas que o navegador suport use o 
    //MediaRecorder.isTypeSupported('audio/tipodemida') no console do navegador
}