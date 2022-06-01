import { Configuration, V0alpha2Api } from '@ory/client'

export default new V0alpha2Api(new Configuration({
    basePath: process.env.ORY_SDK_URL,
    baseOptions: {
      withCredentials: true,
    }
  }))
  