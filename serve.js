const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // Default to index.html for root path
    if (path === "/" || path === "") {
      path = "/index.html";
    }

    // Try to serve the file
    const file = Bun.file(`.${path}`);
    return new Response(file);
  },
});

console.log(`Server running at http://localhost:${server.port}`);
