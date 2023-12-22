import { Client, GatewayIntentBits } from 'discord.js';
import { Database } from "bun:sqlite"
import chalk from 'chalk';

console.log(chalk.blueBright(`
             
 ░                   ░                           ░                    
 ███▄ ▄███▓▓█████   ██████   ██████  ▄▄▄        ▄████ ▓█████  ██▀███  
▓██▒▀█▀ ██▒▓█   ▀ ▒██    ▒ ▒██    ▒ ▒████▄     ██▒ ▀█▒▓█   ▀ ▓██ ▒ ██▒
▓██    ▓██░▒███   ░ ▓██▄   ░ ▓██▄   ▒██  ▀█▄  ▒██░▄▄▄░▒███   ▓██ ░▄█ ▒
▒██    ▒██ ▒▓█  ▄   ▒   ██▒  ▒   ██▒░██▄▄▄▄██ ░▓█  ██▓▒▓█  ▄ ▒██▀▀█▄  
▒██▒   ░██▒░▒████▒▒██████▒▒▒██████▒▒ ▓█   ▓██▒░▒▓███▀▒░▒████▒░██▓ ▒██▒
░ ▒░   ░  ░░░ ▒░ ░▒ ▒▓▒ ▒ ░▒ ▒▓▒ ▒ ░ ▒▒   ▓▒█░ ░▒   ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░
░  ░      ░ ░ ░  ░░ ░▒  ░ ░░ ░▒  ░ ░  ▒   ▒▒ ░  ░   ░  ░ ░  ░  ░▒ ░ ▒░
░      ░      ░   ░  ░  ░  ░  ░  ░    ░   ▒   ░ ░   ░    ░     ░░   ░ 
       ░      ░  ░      ░        ░        ░  ░      ░    ░  ░   ░     
                                                                      
`))

console.log("EZ Discord Message")
console.log("By elarle")

console.log(`
How to use:
  * To list all avalable server: list server / list s
  * To list all avalable channels from a serever: list server 1 / list s 1
`)

const db = new Database("data.sqlite", {create: true})
const _q1 = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='channels';")
const _r1 = _q1.get()
if(_r1 == null)db.run("CREATE TABLE channels (id INT, name TEXT, channel_id TEXT, server_name TEXT)")
//console.log(_r2)

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const cp = client.channels.cache.map((channel, string) => {
    const _q3 = db.query(`SELECT channel_id FROM channels WHERE channel_id='${string}';`)
    const res = _q3.get()
    if(res == null)if(channel.isTextBased())db.run(`INSERT INTO channels (name, channel_id, server_name) VALUES ("${channel.name}", ${string}, "${channel.guild.name}");`)
  })

  Promise.all(cp).then(() => {
    const _q2 = db.query("SELECT * FROM channels;")
    const _r2 = _q2.all()

    
  })

});

client.on('message', async msg => {
   console.log(msg)
});

function send_message(channel_id, message){
  const chan = client.channels.cache.get(channel_id)
  if(chan != undefined){
    chan.send("Hola!")
  }
}



client.login(process.env["DST"]);

import { Console } from "./console";

const term = new Console()

let map = new Map()
let servers = {}

const _q2 = db.query("SELECT * FROM channels;")

await Promise.all(_q2.all().map(val => {

    if(servers[val.server_name] == undefined){
      servers[val.server_name] = []
    }

    servers[val.server_name].push({name: val.name, id: val.channel_id})

}))

term.add_command("list", async (args) => {

  let i = 1

  for(const val in servers){
    map.set(i+"", val)
      i++
    }

  switch(args[0]){
    case "servers", "s": {

      if(args[1] != undefined){
        
        if(!map.has(args[1])){
          console.log("Not found that index")
          break
        }

        console.log(`\n * | Server (${map.get(args[1])}) Available channels:`)
        console.log("-----------------------")

        let e = 0;
        for(const channel of servers[map.get(args[1])]){
          console.log(` ${e} | ${channel.name}`)
          e++
        }

        break
      }

      console.log("\n i | Available servers:")
      console.log("-----------------------")
      for(const [key, val] of map){
        console.log(` ${key} | ${val}`)
      }
      
      
      break
    }
  }

})

term.add_command("send", async (args) => {
  const server = args[0]
  const channel = args[1]

  args.shift()
  args.shift()

  let rs = ""
  for(let i = 0; i < args.length; i++){
    rs+=args[i]+" "
  }

  if(client.channels.cache.has(servers[map.get(server)][(channel)].id)){

    console.log(`[${map.get(server)}](${servers[map.get(server)][(channel)].name}) ${client.user.tag}: ${rs}`)
    const chan = client.channels.cache.get(servers[map.get(server)][(channel)].id)
    chan.send(rs)

  }

})

/**
 * This is a personal implementation, please do not use it.
 * @deprecated
 */
term.add_command("ip", async (args) => {
  const server = "3"
  const channel = "5"

  if(client.channels.cache.has(servers[map.get(server)][(channel)].id)){

    console.log(`[${map.get(server)}](${servers[map.get(server)][(channel)].name}) ${client.user.tag}: IP:${args[0]}`)
    const chan = client.channels.cache.get(servers[map.get(server)][(channel)].id)
    chan.send(`
    \`\`\`
IP: ${args[0]}
\`\`\`
    `)

  } 

})

await term.listen()