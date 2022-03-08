const DEPLOY_TIME = process.env.DEPLOY_TIME;
console.log(`I was deployed at: ${DEPLOY_TIME}`);

export async function handler (event: any) {
    console.debug("Received event: ", event);
    console.log("### Environment:", JSON.stringify(process.env));
    console.log("### Event:", event);
    return {
        statusCode: 200,
        body: {
            'Deploy_time': DEPLOY_TIME,
            'Environment': JSON.stringify(process.env),
        }
    };
}