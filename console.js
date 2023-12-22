export class Console{

   PREFIX = '> '
   INPUT_CB = ()=>{}
   COMMANDS = new Map()

   constructor(){
      this.COMMANDS.set("clear", () => {console.clear()})
   }

   /**
    * 
    * @param {string} command 
    * @param {(args: Array<string>) => {}} cb 
    */
   add_command(command, cb){
      this.COMMANDS.set(command, cb)
   }

   /**
    * 
    * @param {"message"} type 
    * @param {(msg: string) => {}} cb 
    */
   on(type, cb){
      switch(type){
         case "message": {this.INPUT_CB = cb; break}
      }
   }

   async listen(){

      console.write(this.PREFIX)
      for await (const line of console){
         
         this.INPUT_CB(line)
         const _s = line.split(" ")
         const _fcb = this.COMMANDS.get(_s[0])
         _s.shift()
         _fcb ? await _fcb(_s) : null

         console.write("\n"+this.PREFIX)
      }
   }
}