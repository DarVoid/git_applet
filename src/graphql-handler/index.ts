import axios from "axios";
// const fetch = require('node-fetch');
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

function makeGraphQLCall() {
        try {
            let a = pedido(url, PR_abertos_proprio).then((res:any)=>{
                    console.log(res);
            })
        } catch (error) {
            console.error("Erro: ",error);
        }
    
    }
    
const {GITHUB_ACCESS_TOKEN} = process.env;
import { graphql } from "@octokit/graphql";
let result = '';
export const pedido = async (url:string, query:string ): Promise<any> => {
        
        return  graphql(
                query,
                {
                  headers: {
                    authorization: `token ${GITHUB_ACCESS_TOKEN}`,
                  },
                }
              );
};
//   .then(body => console.log(body)) // {"data":{"repository":{"issues":{"totalCount":247}}}}
//   .catch(error => console.error(error));