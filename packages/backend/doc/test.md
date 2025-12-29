for test in postman

query http://localhost:3001/trpc/test?batch=1&input={"0":{"name":"Bilbo"}}

mutation

import { createTRPCClient, httpBatchLink } from '@trpc/client';
// import type { AppRouter } from '../../../backend/src/app/server/app-routes';

// const client = createTRPCClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: 'http://localhost:3000/trpc',
//       // You can pass any HTTP headers you wish here
//       // async headers() {
//       //   return {
//       //     authorization: getAuthCookie(),
//       //   };
//       // },
//     }),
//   ],
// });



// await client.login.query({ email: "Bilbo", password: "Bilbo" });
