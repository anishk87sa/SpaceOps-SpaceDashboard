import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getDestinations(req, res) {
  try {
    const destinations = spaceopsRepo.getDestinations();
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve destinations',
      error: error.message
    });
  }
}

export function getDestinationBySlug(req, res) {
  try {
    const { slug } = req.params;
    const destination = spaceopsRepo.getDestinationBySlugOrId(slug);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: `Destination '${slug}' not found`
      });
    }
    // Also include missions and spacecraft linked to this destination
    const relatedMissions = spaceopsRepo.getMissions({ destination: slug });
    const relatedSpacecraft = spaceopsRepo.getSpacecraft({ destination: slug });

    res.status(200).json({
      success: true,
      data: {
        ...destination,
        relatedMissions,
        relatedSpacecraft
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve destination details',
      error: error.message
    });
  }
}
