import { useState } from 'react';
import JWT from 'core/services/JWT';
import useEnvAI from './useEnvAI';

export const fetchApiAI = async ({
  url,
  method = 'GET',
  body,
}: {
  url: string;
  method?: string;
  body?: any;
}): Promise<Response> => {
  const token = JWT.getToken();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let requestBody;
  if (body instanceof FormData) {
    requestBody = body;
  } else if (body) {
    requestBody = JSON.stringify(body);
  } else {
    requestBody = undefined;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  return response;
};

function useRequestAI({ endpoint, method = 'GET' }) {
  const { host: HOST } = useEnvAI();
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const onExec = async ({
    body,
    query,
  }: {
    body?: any;
    query?: Record<string, any>;
  }) => {
    let url = `${HOST}/chat/${endpoint}`;
    if (query && typeof query === 'object') {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }

    setLoading(() => true);

    try {
      const response = await fetchApiAI({
        url,
        method,
        body: body && JSON.stringify(body),
      });

      const data = await response.json();
      if (data) {
        setData(data);
      } else {
        console.error(`${method} failed:`, data.message || data);
      }
    } catch (error) {
      console.error(`Error during ${method} request to ${endpoint}:`, error);
      throw error;
    }
    setLoading(() => false);
  };

  return { loading, data, exec: onExec };
}

export default useRequestAI;
