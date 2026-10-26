/**
 * 404 Not Found Middleware
 * Returns a standardized JSON response for unknown endpoints
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    status: 'fail',
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
    timestamp: new Date().toISOString(),
  });
}
