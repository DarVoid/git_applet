import { Action, ActionArgs } from "contracts/Action";
import { Context } from "config";
import { query } from "utils/graphql";
import openUrl from "actions/openUrl";

const gqlQuery = `
query fetchPRs {
    viewer {
        pullRequests(orderBy: {field: CREATED_AT, direction: ASC}, first: 100
          states: OPEN) {
            edges {
                node {
                    title
                    baseRefName
                    headRefName
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
}
`;

class PRInfo {
    title: string = '';
    baseRefName: string = '';
    headRefName: string = '';
    number: number = 0;
    permalink: string = '';
    reviewRequests: number = 0;
    reviews: number = 0;
    reviewDecision: string | null = null;
};

type PRList = Array<PRInfo>;

const fetchPRs: Action = async function(context: Context, args: ActionArgs): Promise<void> {
    const url: string = `https://api.${context.githubHost}/graphql`;
    try {
        const res = await query(url, gqlQuery, context.githubToken);
        const list: PRList = res.data.viewer.pullRequests.edges.map((prData: any) => {
            const pr: PRInfo = new PRInfo();
            pr.title = prData.node.title;
            pr.baseRefName = prData.node.baseRefName;
            pr.headRefName = prData.node.headRefName;
            pr.number = prData.node.number;
            pr.permalink = prData.node.permalink;
            pr.reviewRequests = prData.node.reviewRequests.totalCount;
            pr.reviews = prData.node.reviews.totalCount;
            pr.reviewDecision = prData.node.reviewDecision;
            return pr;
        });
        const totalRequests: number = list.reduce((prev: number, curr: PRInfo) => prev + curr.reviewRequests, 0);
        const totalReviews: number = list.reduce((prev: number, curr: PRInfo) => prev + curr.reviews, 0);
        console.log("Total Requests: %d", totalRequests);
        console.log("Total Reviews: %d", totalReviews);
        console.log(list);
        let submenuList = list.map((cada) => {
            return { checked: false, enabled: true, title: `[${cada.headRefName}]->[${cada.baseRefName}] ${cada.title}`, tooltip: `yes`,
            callback: {
                click:  openUrl(context, {url :cada.permalink})
            }    
            }
        });
       
        args.callthis(submenuList)
        
        
    } catch(err: any) {
        console.error(err.response?.data ?? err.message);
    }
}

export default fetchPRs;
