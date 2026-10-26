import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getOrganizationProfile(req, res) {
  res.status(200).json({
    status: 'success',
    data: {
      id: 'org-spaceops-global',
      name: 'SpaceOps Operations Command',
      callsign: 'SPACEOPS-HQ',
      sector: 'Commercial & Government Spaceflight',
      clearanceLevel: 'DEFCON-4 Civilian Aerospace Certified',
      hqLocation: 'Houston, Texas / Cape Canaveral, Florida',
      activeConstellationsCount: 4,
      totalTrackedAssets: spaceopsRepo.getSatellites().length,
      createdAt: '2023-01-15T00:00:00Z',
    },
  });
}

export function getTeam(req, res) {
  const members = spaceopsRepo.getTeamMembers();
  res.status(200).json({
    status: 'success',
    count: members.length,
    data: members,
  });
}

export function getAuditLogs(req, res) {
  const logs = spaceopsRepo.getAuditLogs();
  res.status(200).json({
    status: 'success',
    count: logs.length,
    data: logs,
  });
}

export function inviteMember(req, res) {
  const { name, email, role, title, department } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      status: 'fail',
      error: { code: 'VALIDATION_ERROR', message: 'Name and email are required.' },
    });
  }

  const newMember = {
    id: `usr-${Date.now().toString(36)}`,
    name,
    email,
    role: role || 'Operator',
    title: title || 'Aerospace Operations Specialist',
    department: department || 'Mission Control',
    status: 'invited',
    lastActive: 'Invitation dispatched',
  };

  spaceopsRepo.teamMembers.push(newMember);
  spaceopsRepo.addAuditLog(req.user?.name || 'Administrator', 'TEAM_MEMBER_INVITED', `Invited ${email} (${newMember.role})`);

  res.status(201).json({
    status: 'success',
    data: newMember,
  });
}
