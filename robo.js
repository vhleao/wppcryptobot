
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect.create({
    session: 'whatsbot',
    autoClose: false,
    puppeteerOptions: { args: ['--no-sandbox'] }
})
    .then((client) =>
        client.onMessage((message) => {
            const msg = message.body;
            console.log(message.body);
            const cmd = '/p'
            //const config = require('./config')

            if (msg.startsWith(cmd)){
                const coin2 = msg.substring(3)
                console.log(coin2)
                const https = require('https');
                var coin = 'bcoin'
                const options = 
                    {hostname: 'pro-api.coinmarketcap.com',
                    path: `/v2/cryptocurrency/quotes/latest?symbol=${coin2}` ,
                    //headers: {"X-CMC_PRO_API_KEY":config.key} #changed for heroku env
                    headers: {"X-CMC_PRO_API_KEY":process.env.key}
                    }

                https.get(options, (resp) => {
                    var code = resp.statusCode;
                    console.log('statusCode:', code);
                let data = '';

                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                data += chunk;
                });

                // The whole response has been received. Print out the result.
                if(resp.statusCode == 200){
                resp.on('end', () => {
                    
                    var adata = data.split('price')[1]
                    var price = adata.substring(2, 7);

                    
                    //console.log(JSON.parse(data).data.BCOIN[0].quote.USD.price);
                    console.log(price);
                    sendWppMessage(client, message.from, `Preço da ${coin2}: $${price} USD`); 
                   
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    });
                }else{
                    sendWppMessage(client, message.from, `REQUISIÇÃO INVÁLIDA (${code}) `); 
                }
                }).on("error", (err) => {
                console.log("Error: " + err.message);
                });
                
                            }
                            
                            
                        }))
                    .catch((error) =>
                        console.log(error));


function sendWppMessage(client, sendTo, text) {
    client.sendText(sendTo, text)
        .then((result) => {
            // console.log('SUCESSO: ', result); 
        })
        .catch((erro) => {
            console.error('ERRO: ', erro);
        });
}
