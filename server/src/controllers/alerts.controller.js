import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getAlerts(req, res) {
  const { severity, status } = req.query;
  const alerts = spaceopsRepo.getAlerts({ severity, status });
  res.status(200).json({
    status: 'success',
    count: alerts.length,
    data: alerts,
  });
}

export function acknowledgeAlert(req, res) {
  const { id } = req.params;
  const operatorName = req.user?.name || req.body?.userName || 'Flight Lead';
  const updated = spaceopsRepo.acknowledgeAlert(id, operatorName);

  if (!updated) {
    return res.status(404).json({
      status: 'fail',
      error: { code: 'ALERT_NOT_FOUND', message: `Alert ${id} not found.` },
    });
  }

  res.status(200).json({
    status: 'success',
    data: updated,
  });
}

export function resolveAlert(req, res) {
  const { id } = req.params;
  const { notes } = req.body;
  const operatorName = req.user?.name || req.body?.userName || 'Flight Lead';
  const updated = spaceopsRepo.resolveAlert(id, notes, operatorName);

  if (!updated) {
    return res.status(404).json({
      status: 'fail',
      error: { code: 'ALERT_NOT_FOUND', message: `Alert ${id} not found.` },
    });
  }

  res.status(200).json({
    status: 'success',
    data: updated,
  });
}
