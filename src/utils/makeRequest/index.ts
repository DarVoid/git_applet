import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

let result = '';
let PR_abertos_proprio = `
query MyQuery {
  viewer {
    pullRequests(orderBy: {field: CREATED_AT, direction: ASC}, first: 100
        states: OPEN) {
        edges {
            node {
                number
                permalink
                reviewRequests {
                    totalCount
                }
            reviews {
                totalCount
            }
            reviewDecision
            }
        }
  }
  }
}`

let url = 'https://graphql.github.com/graphql/proxy'

let options={}

// export const pedido = async (url:string, query:string , options: any): Promise<any> => {
        
//         return  graphql(
//                 query,
//                 options
//               );
// };

const client = new ApolloClient({
    uri:  url,
    cache: new InMemoryCache(),
  });

  client
  .query({
    query: gql`${PR_abertos_proprio}`,
  })
  .then((result) => console.log(result));