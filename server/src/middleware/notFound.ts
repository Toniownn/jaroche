import type { RequestHandler } from 'express';

export const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'NotFound', message: `No route for ${req.method} ${req.path}` });
};
