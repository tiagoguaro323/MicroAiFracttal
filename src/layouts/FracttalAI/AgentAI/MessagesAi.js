const messagesAndRoutes = {
  messages: {
    WORK_ORDERS: [
      'MSG_P_PROMPT_1',
      '¿En qué puedo ayudarte con las órdenes de trabajo?',
      '¿Necesitas información sobre alguna orden de trabajo específica?',
      '¿Quieres crear una nueva orden de trabajo?',
    ],
    METERS: [
      '¿Cómo puedo asistirte con los medidores?',
      '¿Necesitas ver el estado de algún medidor en particular?',
      '¿Quieres agregar un nuevo medidor al sistema?',
    ],
    ASSETS: [
      '¿En qué puedo ayudarte con los activos?',
      '¿Necesitas información sobre algún activo específico?',
      '¿Quieres registrar un nuevo activo en el sistema?',
    ],
    GENERAL: ['MSG_P_PROMPT_2', 'QUICK_ACTIONS_AI_1', 'QUICK_ACTIONS_AI_2'],
    REQUESTS: [
      '¿Cómo puedo ayudarte con las solicitudes?',
      '¿Necesitas ver el estado de alguna solicitud específica?',
      '¿Quieres crear una nueva solicitud?',
    ],
    PLAN_TASKS: [
      '¿Cómo puedo ayudarte con las tareas planificadas?',
      '¿Necesitas información sobre alguna tarea planificada específica?',
      '¿Quieres crear una nueva tarea planificada?',
    ],
  },
  routes: {
    '/tasks/wo': 'WORK_ORDERS',
    '/monitoring/meters': 'METERS',
    '/inventories': 'ASSETS',
    '/dashboard': 'GENERAL',
    '/workrequest': 'REQUESTS',
    '/tasks/task': 'PLAN_TASKS',
  },
};

/**
 * Devuelve la clave del grupo de mensajes correspondiente a una ruta dada,
 * incluso si la ruta contiene parámetros adicionales como /tasks/wo/123
 */
export const getSectionKeyFromPath = (path) => {
  const entries = Object.entries(messagesAndRoutes.routes);

  // Ordenar rutas por longitud para priorizar las más específicas
  entries.sort((a, b) => b[0].length - a[0].length);

  const found = entries.find(([route]) => path.startsWith(route));
  return found ? found[1] : undefined;
};

export default messagesAndRoutes;
