import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getAnalytics(req, res) {
  const metrics = spaceopsRepo.getDashboardMetrics();
  const missions = spaceopsRepo.getMissions();
  const satellites = spaceopsRepo.getSatellites();

  // Pre-aggregated telemetry analytics
  const fleetAvailability = [
    { month: 'May', availability: 99.4, passes: 412, dataGb: 1480 },
    { month: 'Jun', availability: 99.7, passes: 438, dataGb: 1620 },
    { month: 'Jul', availability: 98.9, passes: 395, dataGb: 1390 },
    { month: 'Aug', availability: 99.8, passes: 462, dataGb: 1810 },
    { month: 'Sep', availability: 99.5, passes: 440, dataGb: 1740 },
    { month: 'Oct', availability: 99.9, passes: 485, dataGb: 1950 },
  ];

  const subsystemHealth = [
    { subsystem: 'Power / EPS', nominal: 98, warning: 2, critical: 0 },
    { subsystem: 'ADCS / Attitude', nominal: 94, warning: 5, critical: 1 },
    { subsystem: 'Thermal', nominal: 91, warning: 8, critical: 1 },
    { subsystem: 'Comms / RF', nominal: 99, warning: 1, critical: 0 },
    { subsystem: 'Payload / Imagers', nominal: 96, warning: 4, critical: 0 },
  ];

  res.status(200).json({
    status: 'success',
    data: {
      metrics,
      fleetAvailability,
      subsystemHealth,
      totalSatellites: satellites.length,
      totalMissions: missions.length,
      timestamp: new Date().toISOString(),
    },
  });
}

export function generateReport(req, res) {
  const { reportType = 'fleet_status', timeframe = '30d' } = req.body;
  const satellites = spaceopsRepo.getSatellites();
  const missions = spaceopsRepo.getMissions();

  // Generate CSV rows
  let csvContent = 'ID,Name,Type,Status,AltitudeKm,InclinationDeg,LastContact\n';
  satellites.forEach(s => {
    csvContent += `"${s.id}","${s.name}","${s.type}","${s.status}",${s.altitudeKm},${s.inclinationDeg},"${s.lastContact}"\n`;
  });

  res.status(200).json({
    status: 'success',
    data: {
      reportId: `rep-${Date.now().toString(36)}`,
      reportType,
      timeframe,
      generatedAt: new Date().toISOString(),
      generatedBy: req.user?.name || 'Operations Lead',
      recordCount: satellites.length,
      csvContent,
    },
  });
}
