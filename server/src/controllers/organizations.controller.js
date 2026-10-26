import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getOrganizations(req, res) {
  try {
    const orgs = spaceopsRepo.getOrganizations();
    res.status(200).json({
      success: true,
      count: orgs.length,
      data: orgs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve space organizations',
      error: error.message
    });
  }
}
