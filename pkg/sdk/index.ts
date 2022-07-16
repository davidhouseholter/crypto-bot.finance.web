import { Configuration, V0alpha2Api } from '@ory/client'
import { edgeConfig } from '@ory/integrations/next'
const api = process.env.NEXT_PUBLIC_API_ENDPOINT;
let config = new Configuration(edgeConfig);
if(true){
//if(process.env.PRODUCTION){
    config = new Configuration({...edgeConfig,
        basePath: "https://id.crypto-bot.finance",
        baseOptions: {
          withCredentials: true,
        }
      });
}

export default new V0alpha2Api(config)
  