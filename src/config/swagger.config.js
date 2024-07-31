export function swaggerConfig() {
  return {
    swagger: {
      info: {
        title: 'My Fastify App Documentation Title',
        description: 'My FirstApp Backend Documentation Description',
        version: '1.0.0',
      },
      securityDefinitions: {
        Authorization: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  };
}

const CSS_CONTENT = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&display=swap');
* {
  font-family: 'Noto Sans Mono', monospace !important;
}
.swagger-ui .parameters-col_description input {
  max-width: 25rem !important;
}
`;

export function swaggerUIConfig() {
  return {
    routePrefix: '/api/documentation',
    theme: {
      css: [
        {
          filename: 'custom-font-and-input-field-size.css',
          content: CSS_CONTENT,
        },
      ],
    },
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
    },
  };
}
