export class ClassEvent{
    constructor(){
        this._events = {

        };
    }

    on(eventName,fn){
        if (!this._events[eventName]) this._events[eventName] = new Array();
        this._events[eventName].push(fn);
    }
     trigger(){
         let args = [...arguments];
         //este metodo retira o primeiro parametro do array e reotna ele.
         let eventName = args.shift();
         //estamos readicionando o nome do evento para controle do que esta sendo executado.
         args.push( new Event(eventName));
         //estamos verificando se dentro de _events tem um array com o instanceof
         if(this._events[eventName] instanceof Array){
            this._events[eventName].forEach(fn => {
                //apply é uma funão nativa que executa uma função dentro de um elemento, sempre inicia com null
                fn.apply(null,args)
            });
         }
     }
}