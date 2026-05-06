import type { RequestHandler } from 'express';
import type { ZodTypeAny, z } from 'zod';

type Source = 'body' | 'query' | 'params';

export function validate<S extends ZodTypeAny>(schema: S, source: Source = 'body'): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(result.error);
    // overwrite with parsed (typed) data so downstream sees the coerced shape
    (req as unknown as Record<Source, z.infer<S>>)[source] = result.data;
    next();
  };
}
