import axios from "axios";
// const fetch = require('node-fetch');
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