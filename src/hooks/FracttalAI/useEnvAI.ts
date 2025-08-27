import useEnviroment from 'hooks/useEnviroment';
import { AgentsType } from 'constants/FracttalAI';

const WORKFLOW_ID_DEV = 'b0a240b6-8e9d-459d-b400-0d2ae6912d7c';
const HOST_DEV = 'https://dev.fracttal.com';

const WORKFLOW_ID_PROD = '8f126224-3933-4e82-9c1c-dc518c299dfa';
const HOST_PROD =
  import.meta.env.VITE_APP_URL_API || 'https://one.fracttal.com';

const WORK_ORDER_DEV = '8f474b4f-3799-47e2-a5e4-904dd6a9153d';
const WORK_ORDER_PROD = '988f3c7b-c9f6-4073-a556-245ba3b7f4ee';

const METERS_DEV = '19ebf94b-0a49-4323-b7c4-96454ebb9dde';
const METERS_PROD = 'be5a2170-e7a8-4345-ac09-14728c9e153b';

const ASSETS_DEV = '08b2c47c-0a00-4352-9e40-49d32ac673f9';
const ASSETS_PROD = 'b19699d6-1f0b-4634-ae6c-76ded428d471';

const REQUESTS_DEV = 'b48d6052-0c7b-4597-82b4-331df827d81c';
const REQUESTS_PROD = '1115f6b6-2402-48a9-9169-320bbdd92458';

const PLAN_TASKS_DEV = 'cf31491d-b716-44bd-a205-6828b899dbed';
const PLAN_TASKS_PROD = '8c19850c-d555-4bf2-a528-2bea88a9789d';

export default function useEnvAI(agentType?: AgentsType) {
  const { isDevelop } = useEnviroment();
  let workflowID = isDevelop ? WORKFLOW_ID_DEV : WORKFLOW_ID_PROD;

  if (agentType === 'WORK_ORDERS') {
    workflowID = isDevelop ? WORK_ORDER_DEV : WORK_ORDER_PROD;
  } else if (agentType === 'METERS') {
    workflowID = isDevelop ? METERS_DEV : METERS_PROD;
  } else if (agentType === 'ASSETS') {
    workflowID = isDevelop ? ASSETS_DEV : ASSETS_PROD;
  } else if (agentType === 'REQUESTS') {
    workflowID = isDevelop ? REQUESTS_DEV : REQUESTS_PROD;
  } else if (agentType === 'PLAN_TASKS') {
    workflowID = isDevelop ? PLAN_TASKS_DEV : PLAN_TASKS_PROD;
  }

  return {
    host: isDevelop ? HOST_DEV : HOST_PROD,
    workflowID,
  };
}
