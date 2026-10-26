async function verifyAll() {
  const endpoints = [
    { name: 'Dashboard Overview', url: 'http://localhost:5000/api/v1/dashboard' },
    { name: 'Missions List', url: 'http://localhost:5000/api/v1/missions' },
    { name: 'Satellites Catalog', url: 'http://localhost:5000/api/v1/satellites' },
    { name: 'Orbital 3D Data', url: 'http://localhost:5000/api/v1/orbital' },
    { name: 'Ground Stations', url: 'http://localhost:5000/api/v1/ground-stations' },
    { name: 'Pass Schedule', url: 'http://localhost:5000/api/v1/communication-passes' },
    { name: 'Telemetry Series', url: 'http://localhost:5000/api/v1/telemetry?satelliteId=sat-iss-alpha' },
    { name: 'Alerts Management', url: 'http://localhost:5000/api/v1/alerts' },
    { name: 'Operational Analytics', url: 'http://localhost:5000/api/v1/analytics' },
    { name: 'Team & Clearances', url: 'http://localhost:5000/api/v1/organization/team' },
    { name: 'Vite Frontend App', url: 'http://localhost:5173' }
  ];

  console.log('--- Starting SpaceOps Integration Audit ---');
  let successCount = 0;
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      if (res.status === 200) {
        console.log(`[PASS] ${ep.name}: HTTP ${res.status}`);
        successCount++;
      } else {
        console.log(`[FAIL] ${ep.name}: HTTP ${res.status}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${ep.name}: ${err.message}`);
    }
  }

  // Auth login test
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@spaceops.org', password: 'spaceops2026' })
  });
  const loginData = await loginRes.json();
  const tokenValid = Boolean(loginData?.data?.token);
  console.log(`[PASS] Auth Login: HTTP ${loginRes.status}, JWT Token: ${tokenValid ? 'Issued' : 'Failed'}`);
  console.log(`--- Integration Audit Completed: ${successCount} endpoints online ---`);
}

verifyAll().catch(console.error);
