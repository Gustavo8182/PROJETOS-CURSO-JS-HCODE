export class DocumentPreviewController{
    constructor(file){
        this._file = file;
    }

    getPreviewData(){
        return new Promise((s,f)=>{
            switch (this._file){
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':    
                let reader = new FileReader();
                reader.onload = e=>{
                    s({
                        src:reader.result,
                        infor: this._file.name

                    });
                }
                reader.onerror = e=>{
                    f(e);
                };
                reader.readAsDataURL(file);
                break
                case 'aplication/pdf':
                break
                default:
                    f();
            }
        })    
    }
}
