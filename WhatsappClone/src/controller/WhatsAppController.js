import {Format} from './../Util/Format';
import {CameraController} from './CameraController';
import {MicrophneController} from './MicrophneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { Firebase} from './../Util/Firebase';
import { User } from '../model/User';


export  class WhatsAppController{
    constructor(){
        console.log("WhatsAppController teste")
        
        this._firebase = new Firebase();
        this.initAuth();
        this.elementsPrototypes();
        this.loadElement();
        this.initEvents(); 

    }

    initAuth(){
        this._firebase.initAuth().then(
            response=>{
                this._user = new User(response.user.email);
                this._user.on("datachange",data=>{                   
                    document.querySelector('title').innerHTML = data.name+" - WhatsApp Clone";
                    this.el.inputNamePanelEditProfile.innerHTML = data.name;
                    if (data.photo) {
                        let photo = this.el.imgPanelEditProfile;
                        photo.src = data.photo;
                        photo.show();

                        this.el.imgDefaultPanelEditProfile.hide();
                        let photo2 = this.el.myPhoto.querySelector('img');
                        photo2.src = data.photo;
                        photo2.show();                    
                    }
                });
                this._user.name = response.user.displayName;
                this._user.email = response.user.email;
                this._user.photo = response.user.photoURL;
                this._user.save();
            }
        ).catch(err =>{
                console.log(err);
        });
    }

    loadElement(){
        this.el = {};
        document.querySelectorAll('[id]').forEach(element =>{
            this.el[Format.getCamelCase(element.id)] = element
        });
    }//Close loadElement

     elementsPrototypes(){
        Element.prototype.hide = function(){
            this.style.display = "none";  
            return this;
        }

        Element.prototype.show = function(){
            this.style.display = "block";  
            return this;
        }

        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === "none") ? 'block' : "none" ;
            return this;
        }

        Element.prototype.on = function(events, fn){
            events.split(' ').forEach(event => {
                this.addEventListener(event,fn);
            });
            return this;
        }

        Element.prototype.css = function(styles){
            for(let name in styles){
                this.style[name] = styles[name]
            };
            return this;
        }

        Element.prototype.addClass = function(name){
            this.classList.add(name);
            return this;
        }

        Element.prototype.removeClass = function(name){
            this.classList.remove(name);
            return this;
        }

        Element.prototype.toggleClass = function(name){
            this.classList.toggle(name);
            return this;
        }

        Element.prototype.hasClass = function(name){
            return this.classList.contains(name);
        }

        HTMLFormElement.prototype.getForm = function(){
            return new FormData(this);
        }

        HTMLFormElement.prototype.toJSON = function(){
            let json = {};
            this.getForm().forEach((value,key)=>{
                json[key]=value;
            })
            return json;
        }
        
    }//Close elementsPrototypes

    initEvents(){
        this.el.myPhoto.on('click', e=>{
            this.closeAllLeftPanel();      
            this.el.panelEditProfile.show();      
            setTimeout(()=>{
                this.el.panelEditProfile.addClass('open');
            },300);
        });

        this.el.btnNewContact.on('click',e=>{
            this.closeAllLeftPanel();
            this.el.panelAddContact.show();        
            setTimeout(()=>{
                this.el.panelAddContact.addClass('open');
            }, 300);
        });

        this.el.btnClosePanelEditProfile.on('click',e=>{
            this.el.panelEditProfile.removeClass('open');
        });

        this.el.btnClosePanelAddContact.on('click',e=>{
            this.el.panelAddContact.removeClass('open');
        });

        this.el.photoContainerEditProfile.on('click',()=>{
            this.el.inputProfilePhoto.click();
        });

        this.el.inputNamePanelEditProfile.on('keypress',(e)=>{
            if (e.key === 'Enter'){
                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }
        });

        this.el.btnSavePanelEditProfile.on('click',(e)=>{

            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item =>{
            item.on('click',e=>{
                this.el.home.hide();
                this.el.main.css({
                    display: "flex"
                });
            });
        });

        //aqui estou pegando cada botão e criando eventos para eles.
        this.el.btnAttach.on('click',e=>{
            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click',this.closeMenuAttach.bind(this));
        })//close btnAttach


        this.el.btnAttachPhoto.on('click',e=>{
            this.el.inputPhoto.click();
        });//close btnAttachPhoto

        //aqui estou criando um novo evento o inputphoto criado no btnattchphoto
        this.el.inputPhoto.on("change", e=>{
            console.log(this.el.inputPhoto.files);
            [...this.el.inputPhoto.files].forEach(file =>{
                console.log(file);
            })
        });// close inputePhoto

        this.el.btnAttachCamera.on('click',e=>{
            this.closseAllMainPanel();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'heigth':'calc(100% - 120px)'
            })  
            
            this. _camera = new CameraController(this.el.videoCamera);

        });// close btnAttachCamera

        this.el.btnClosePanelCamera.on('click', e=>{
            this.closseAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();
        });// close btnClosePanelCamera


        this.el.btnTakePicture.on('click', e=>{
            let dataUrl = this._camera.takePicture();

            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerSendPicture.hide();
            this.el.containerSendPicture.show();


        });// close btnTakePicture

        this.el.btnReshootPanelCamera.on('click',e=>{

            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerSendPicture.show();
            this.el.containerSendPicture.hide();
        })
        this.el.btnSendPicture.on('click',e=>{
            console.log(this.el.pictureCamera.src)

        });//close btnReshootPanelCamera

        this.el.btnAttachDocument.on('click',e=>{
            this.closseAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                'heigth':'calc(100% - 120px)'
            });

            this.el.inputDocument.click();
        });// close btnAttachDocument

        this.el.inputDocument.on('change', e=>{            
            if (this.el.inputDocument.files.length) {
                let file = this.el.inputDocument.files[0];
                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result=>{
                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();
                    

                }).catch (err =>{
                    switch (file.type) {
                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;
                    }
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                });
                
            }

        });// close inputDocument


        this.el.btnClosePanelDocumentPreview.on('click', e =>{
            this.closseAllMainPanel();
            this.panelMessagesContainer.show();
        });// close btnClosePanelDocumentPreview

        this.el.btnSendDocument.on('click', e =>{
            console.log('send docment')

        });

        this.el.btnAttachContact.on('click',e=>{            
            this.el.modalContacts.show();
        })// close btnAttachContact


        this.el.btnCloseModalContacts.on('click', e =>{            
            this.el.modalContacts.hide();
        });// close btnCloseModalContacts


        this.el.btnSendMicrophone.on('click', e=>{
            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();

            this._microphoneController = new MicrophneController();
            this._microphoneController.on('ready',audio=>{
                this._microphoneController.startRecorder();
            });

            this._microphoneController.on('recordtime',timer=>{
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            })
        });//closse btnSendMicrophone

        
        this.el.btnCancelMicrophone.on('click', e=>{

            this._microphoneController.startRecorder();
            this.closeRecordMicrophone();
            

        });//closse btnCancelMicrophone

        
        this.el.btnFinishMicrophone.on('click', e=>{
            this._microphoneController.startRecorder();
            this.closeRecordMicrophone();
        });//closse btnFinishMicrophone

        this.el.inputText.on('keypress', e=>{
            if (e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault();
                this.el.btnSend.click();
            }
        });//close inputText keypress

        this.el.inputText.on('keyup', e=>{
            if (this.el.inputText.innerHTML.length){
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
            }else {
                this.el.inputPlaceholder.show();                
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();
            };

        })//close inputText keyup
        
        this.el.btnSend.on('click', e=>{
            console.log(this.el.inputText.innerHTML);
        });//close inputText send
        
        this.el.btnEmojis.on('click', e=>{
            this.el.panelEmojis.toggleClass('open');
        })//close panelEmojis open

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji=>{
            emoji.on('click', e=>{
                //console.log(emoji.dataset.unicode);
                let img = this.el.imgEmojiDefault.cloneNode();
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name =>
                    img.classList.add(name));
                
                // tiramos o apendChild pois ele sempre add o emoji no fim do texto
                //this.el.inputText.appendChild(img);

                //vamos usar  window.getSelection para pegar o local do cursor
                //verificar se esta dentro da caixa de msg se n tiver colocalo la
                let cursor = window.getSelection();
                if (!cursor.focusNode || !cursor.focusNode.id == "input-text" ) {
                    this.el.inputText.focus();
                    cursor = window.getSelection();                    
                }

                //aqui estamos colcoando os emotiosn exatamente onde esta o curso
                let range = document.createRange();
                range = cursor.getRangeAt(0);
                range.deleteContents();

                //criamos um fragmento para manipular a string
                let frag = document.createDocumentFragment();
                //inserimos o imojin dentro do frag
                frag.appendChild(img);
                //insere o emijin
                range.insertNode(frag);
                //curso vai pra depois do emijin
                range.setStartAfter(img);
                 
                //dispatchEvent força que um evento aconteça
                this.el.inputText.dispatchEvent(new Event('keyup'));
            })
        })//close Emojis Select emoji e insert 





    }//Close initEvents

  /*Metodo trnafeirdo para a cassl microphonecontrole
    startRecordMicroPhoneTime(){
        let start = Date.now();
        this._recordMicroPhoneInterval = setInterval(() =>{
            this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);
        }, 100);
    };// close startRecordMicroPhoneTime*/


    closeRecordMicrophone(){
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();                
    };//close closeRecordMicrophone

    closseAllMainPanel(){
        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');
    }//Close closseAllMainPanel

    closeMenuAttach(e){
        document.removeEventListener('click',this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');



    }//close closeMenuAttach

    closeAllLeftPanel(){
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();

    }//close closeAllLeftPanel
    
}