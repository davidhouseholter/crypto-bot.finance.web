import { Configuration, V0alpha2Api } from '@ory/client'
import { edgeConfig } from '@ory/integrations/next'

// export default new V0alpha2Api(new Configuration(edgeConfig))
// console.log(process.env.ORY_SDK_URL)
export default new V0alpha2Api(new Configuration({
    basePath: process.env.ORY_SDK_URL,
    baseOptions: {
      withCredentials: true,
    }
  }))
  