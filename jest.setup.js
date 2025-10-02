import '@testing-library/jest-dom';

// Polyfills para Next.js API en Node.js environment
global.Request = global.Request || class MockRequest {
  constructor(url, init) {
    this.url = url;
    this.init = init;
  }
};

global.Response = global.Response || class MockResponse {
  constructor(body, init) {
    this.body = body;
    this.init = init;
  }
  
  static json(data) {
    return new MockResponse(JSON.stringify(data), { 
      headers: { 'content-type': 'application/json' } 
    });
  }
};

// Mock NextResponse para tests
global.NextResponse = global.NextResponse || {
  json: (data, options) => ({
    json: () => Promise.resolve(data),
    status: options?.status || 200,
    data
  })
};
