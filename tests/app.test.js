const request = require('supertest');
const app = require('../index'); // Import your Express app

describe('NeonRPM basic routes', () => {
  // Health check route
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('ok');
  });

  // Login page should load
  test('GET /login.html returns 200', async () => {
    const res = await request(app).get('/login.html');
    expect(res.status).toBe(200);
  });

  // Protected route should redirect when not logged in
  test('Protected route redirects to /login.html if not logged in', async () => {
    const res = await request(app).get('/index.html').redirects(0);
    expect([301, 302]).toContain(res.status);
    expect(res.headers.location).toContain('/login.html');
  });
});
