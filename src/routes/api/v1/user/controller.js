'use strict';

import { REDIS_KEYS } from '../../../../config/constants.js';
import { promiseHandler } from '../../../../utilities/promise-handler.js';

export async function getUser(fastify, request, reply) {
  request.log.info({
    message: `Handling GET ${request.url} request`,
  });
  const redisGetPromise = fastify.redis.get(REDIS_KEYS.USER);
  const [redisGetResult, redisGetError] = await promiseHandler(redisGetPromise);
  if (!redisGetResult) {
    request.log.error({
      message: `User Value Does Not Exist`,
      error: redisGetError,
    });
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `User Value Does Not Exist`,
    });
  }
  return reply.status(200).send({
    statusCode: 200,
    message: `User Value Found`,
    data: redisGetResult,
  });
}

export async function setUser(fastify, request, reply) {
  request.log.info({
    message: `Handling POST ${request.url} request`,
    payload: request.body,
  });
  const redisSetPromise = fastify.redis.set(REDIS_KEYS.USER, request.body.name);
  const [redisSetResult, redisSetError] = await promiseHandler(redisSetPromise);
  if (!redisSetResult) {
    request.log.error({
      message: `Could Not Set Value In Redis`,
      error: redisSetError,
    });
    return reply.status(500).send({
      statusCode: 500,
      error: `Something Went Wrong`,
      message: `Could Not Set User Value In Redis`,
    });
  }
  return reply.status(200).send({
    statusCode: 200,
    message: `User Value Has Been Set In Redis`,
  });
}
