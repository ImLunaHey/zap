import { HttpError } from '@/http-error';

type Handler = (request: Request) => Promise<Response | void>;

export const handleErrors = (handler: Handler) => async (request: Request) => {
  try {
    const response = await handler(request);
    console.info(`${request.method} ${request.url} -> ${response?.status}`);
    if (response) return response;

    // If the handler returns nothing, we return a 204 "No Content" response.
    return new Response(null, {
      status: 204,
    });
  } catch (error: unknown) {
    console.error(`${request.method} ${request.url} -> ${error}`);

    // If the error is not an instance of Error, we wrap it in one.
    if (!(error instanceof Error))
      throw new Error('Unknown error', {
        cause: error,
      });

    // If the error is an instance of HttpError, we return a response with the error's status code.
    if (error instanceof HttpError) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
          },
        }),
        {
          status: error.status,
        },
      );
    }

    // If the error is not an instance of HttpError, we return a response with a 500 status code.
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
        },
      }),
      {
        status: 500,
      },
    );
  }
};
