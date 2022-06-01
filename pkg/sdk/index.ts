import { Configuration, V0alpha2Api } from '@ory/client'
import { edgeConfig } from '@ory/integrations/next'
const api = process.env.NEXT_PUBLIC_API_ENDPOINT;

// export default new V0alpha2Api(new Configuration(edgeConfig))
// console.log(process.env.ORY_SDK_URL)
export default new V0alpha2Api(new Configuration({...edgeConfig,
    basePath: "https://id.crypto-bot.finance",
    baseOptions: {
      withCredentials: true,
    }
  }))
  