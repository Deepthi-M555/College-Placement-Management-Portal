
// middleware/errorHandling.js
// Generic error / 404 handlers used by app.js
// Place in: <project-root>/middleware/errorHandling.js

// 404 Not Found middleware (should be used after all routes)
function notFound(req, res, next) {
  // prefer HTML pages for browser requests, JSON for API clients
  if (req.accepts("html")) {
    return res.status(404).render ? res.status(404).render("errors/404") : res.status(404).send("404 Not Found");
  }
  if (req.accepts("json")) {
    return res.status(404).json({ error: "Not Found" });
  }
  res.status(404).type("txt").send("404 Not Found");
}

// Central error handler (four-arg middleware)
function errorHandler(err, req, res, next) {
  // log server-side error
  console.error(err && err.stack ? err.stack : err);

  // If headers already sent, delegate to default Express handler
  if (res.headersSent) return next(err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // If request wants JSON (API), send JSON response
  if (req.accepts("json") && !req.accepts("html")) {
    return res.status(status).json({ error: message });
  }

  // Try to render an error EJS page if available, otherwise fallback to simple text
  if (res.render) {
    // If you have views/errors/500.ejs or errors/error.ejs you can customize.
    const viewTry = ["errors/500", "errors/error", "errors/5xx"];
    for (const v of viewTry) {
      try {
        // render the first view that exists
        return res.status(status).render(v, { error: err, status, message });
      } catch (e) {
        // continue trying other names
      }
    }
  }

  // fallback
  res.status(status).send(`${status} - ${message}`);
}

module.exports = { notFound, errorHandler };
