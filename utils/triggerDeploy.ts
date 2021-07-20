export const triggerDeploy = async () => {
  if (process.env.DEPLOY_HOOK) {
    return fetch(process.env.DEPLOY_HOOK, { method: 'POST' })
      .then((response) => {
        if (response.ok) {
          return response.json() as Promise<{
            job: { id: string; state: string; createdAt: number };
          }>;
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((response) => {
        console.log(`Deploy job ${response.job.id} triggered`);
      })
      .catch((error) => {
        console.log('Failed to trigger deploy:');
        console.log(error);
      });
  } else {
    console.log('No deploy trigger specified, skipping deploy.');
  }
};
