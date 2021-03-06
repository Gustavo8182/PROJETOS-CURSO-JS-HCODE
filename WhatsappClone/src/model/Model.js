import { ClassEvent } from "../Util/ClassEvent";

export class Model extends ClassEvent{

    constructor(){
        super();
        this._data = {};
    }
    fromJSON(json){
        this._data = Objetc.assign(this._data,json);
        this.trigger('datachange',this.toJSON());
    }
    toJSON(){
        return this._data;
    }
}