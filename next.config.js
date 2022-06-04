// const client = require('./client')


module.exports = {
  reactStrictMode: true,
  strictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'cdn.jsdelivr.net'],
  },
  // exportPathMap: async function (defaultPathMap) {
  //   const paths = await client
  //     .fetch('*[_type == "post" && defined(slug)].slug.current')
  //     .then(data =>
  //       data.reduce(
  //         (acc, slug) => ({
  //           '/': { page: '/' },
  //           ...acc,
  //           [`/post/${slug}`]: { page: '/post/[slug]', query: { slug } }
  //         }),
  //         defaultPathMap
  //       )
  //     )
  //     .catch(console.error)
  //     // const paths2 = await client
  //     // .fetch('*[_type == "project" && defined(slug)].slug.current')
  //     // .then(data =>
  //     //   data.reduce(
  //     //     (acc, slug) => ({
  //     //       ...acc,
  //     //       [`/projects/${slug}`]: { page: '/projects/[slug]', query: { slug } }
  //     //     }),
  //     //     defaultPathMap
  //     //   )
  //     // )
  //     // .catch(console.error)
  //     // console.log({paths, ...paths2})
  //     const paths3 = {...paths}
  //   return paths3
  // }
}
