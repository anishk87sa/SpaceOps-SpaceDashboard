import { spaceopsRepo } from '../repositories/spaceops.repository.js';
import { launchProviderService } from '../services/launchProvider.service.js';
import { env } from '../config/env.js';

/**
 * Intelligent helper to match related space missions and spacecraft from text
 */
function matchRelatedEntities(text, missionObj, allMissions, allSpacecraft) {
  const result = {};
  const lower = (text || '').toLowerCase();

  // 1. Mission matching
  for (const m of allMissions) {
    const mName = m.name.toLowerCase();
    const mSlug = m.slug.toLowerCase();
    if (
      lower.includes(mName) ||
      (mSlug.length > 4 && lower.includes(mSlug.replace(/-/g, ' '))) ||
      (m.slug === 'artemis-program' && lower.includes('artemis')) ||
      (m.slug === 'europa-clipper' && (lower.includes('europa') || lower.includes('clipper'))) ||
      (m.slug === 'international-space-station' &&
        (lower.includes('space station') ||
          lower.includes('iss ') ||
          lower.includes('iss-') ||
          lower.includes('crew dragon') ||
          lower.includes('cygnus') ||
          lower.includes('progress '))) ||
      (m.slug === 'james-webb-space-telescope' &&
        (lower.includes('jwst') || lower.includes('webb'))) ||
      (m.slug === 'mars-perseverance-rover' && lower.includes('perseverance')) ||
      (m.slug === 'chandrayaan-3' && lower.includes('chandrayaan'))
    ) {
      result.mission = {
        id: m.id,
        name: m.name,
        slug: m.slug,
        url: `/missions/${m.slug}`,
      };
      break;
    }
  }

  if (!result.mission && missionObj && missionObj.name) {
    result.mission = {
      name: missionObj.name,
      description: missionObj.description || null,
      orbit: missionObj.orbit?.name || null,
    };
  }

  // 2. Spacecraft matching
  for (const sc of allSpacecraft) {
    const scName = sc.name.toLowerCase();
    if (
      lower.includes(scName) ||
      (sc.slug === 'jwst-observatory' && (lower.includes('jwst') || lower.includes('webb'))) ||
      (sc.slug === 'perseverance-rover' && lower.includes('perseverance')) ||
      (sc.slug === 'europa-clipper-probe' &&
        (lower.includes('europa clipper') || lower.includes('clipper'))) ||
      (sc.slug === 'international-space-station-hab' &&
        (lower.includes('iss') ||
          lower.includes('space station') ||
          lower.includes('crew dragon') ||
          lower.includes('cygnus')))
    ) {
      result.spacecraft = {
        id: sc.id,
        name: sc.name,
        slug: sc.slug,
        url: `/spacecraft/${sc.slug}`,
      };
      break;
    }
  }

  return result;
}

export async function getEvents(req, res) {
  try {
    const { eventType, type, category, q, month } = req.query;
    const filterType = (eventType || type || category || '').toLowerCase();

    const allMissions = spaceopsRepo.getMissions();
    const allSpacecraft = spaceopsRepo.getSpacecraft();

    // 1. Get observation & operations events from repository
    const rawRepoEvents = spaceopsRepo.getEvents({ eventType, type, q });
    const repoEvents = rawRepoEvents.map((e) => {
      const eType = e.entityType || (e.relatedMission && !e.eventType?.includes('Meteor') ? 'mission' : 'celestial_event');
      const relatedEntities = {
        organization: e.relatedOrganization ? { name: e.relatedOrganization } : undefined,
      };

      if (e.relatedMission) {
        const foundMis = allMissions.find(
          (m) => m.id === e.relatedMission || m.slug === e.relatedMission || m.slug === e.missionSlug
        );
        if (foundMis) {
          relatedEntities.mission = {
            id: foundMis.id,
            name: foundMis.name,
            slug: foundMis.slug,
            url: `/missions/${foundMis.slug}`,
          };
        } else if (e.missionName) {
          relatedEntities.mission = {
            name: e.missionName,
            slug: e.missionSlug,
            url: e.missionSlug ? `/missions/${e.missionSlug}` : undefined,
          };
        }
      }

      if (e.relatedSpacecraft) {
        const foundCraft = allSpacecraft.find(
          (s) => s.id === e.relatedSpacecraft || s.slug === e.relatedSpacecraft || s.slug === e.spacecraftSlug
        );
        if (foundCraft) {
          relatedEntities.spacecraft = {
            id: foundCraft.id,
            name: foundCraft.name,
            slug: foundCraft.slug,
            url: `/spacecraft/${foundCraft.slug}`,
          };
        } else if (e.spacecraftName) {
          relatedEntities.spacecraft = {
            name: e.spacecraftName,
            slug: e.spacecraftSlug,
            url: e.spacecraftSlug ? `/spacecraft/${e.spacecraftSlug}` : undefined,
          };
        }
      }

      // Determine canonical detail URLs based on entity type
      let detailUrl = `/events/${e.slug}`;
      let detailEndpoint = `/api/v1/events/${e.slug}`;

      if (eType === 'mission') {
        const misSlug = e.missionSlug || (relatedEntities.mission && relatedEntities.mission.slug);
        if (misSlug) {
          detailUrl = `/missions/${misSlug}`;
          detailEndpoint = `/api/v1/missions/${misSlug}`;
        }
      } else if (eType === 'spacecraft') {
        const craftSlug = e.spacecraftSlug || (relatedEntities.spacecraft && relatedEntities.spacecraft.slug);
        if (craftSlug) {
          detailUrl = `/spacecraft/${craftSlug}`;
          detailEndpoint = `/api/v1/spacecraft/${craftSlug}`;
        }
      }

      return {
        id: e.id,
        slug: e.slug,
        title: e.title,
        entityType: eType,
        eventType: e.eventType || 'Astronomical Observation',
        category: e.category || 'Astronomical Observation',
        status: e.status || 'confirmed',
        scheduleConfidence: e.status === 'in-progress' ? 'In Progress' : 'Confirmed',
        description: e.description,
        startTime: e.startTime,
        endTime: e.endTime || e.startTime,
        timeZone: e.timeZone || 'UTC',
        locationOrVisibility: e.locationOrVisibility || 'Global Visibility',
        viewingGuidance: e.viewingGuidance || null,
        streamUrl: e.streamUrl || null,
        source: e.source || 'NASA / International Astronomical Ephemerides',
        sourceId: e.sourceId || e.id,
        detailEndpoint,
        detailUrl,
        relatedEntities,
      };
    });

    // 2. Fetch real upcoming launches from Launch Library 2
    let launchEvents = [];
    try {
      const launchResult = await launchProviderService.getUpcomingLaunches();
      if (launchResult && Array.isArray(launchResult.data)) {
        launchEvents = launchResult.data.map((l) => {
          const rocketName =
            l.rocketName ||
            l.rocket?.fullName ||
            l.rocket?.name ||
            (typeof l.rocket === 'string' ? l.rocket : 'Orbital Launch Vehicle');
          const providerName =
            l.provider?.name || l.launchProvider || 'Commercial Launch Provider';
          const launchDate = l.launchDate || l.plannedLaunchDate;

          const matchText = `${l.name} ${l.payload || ''} ${l.description || ''} ${rocketName}`;
          const matched = matchRelatedEntities(matchText, l.mission, allMissions, allSpacecraft);

          const relatedEntities = {
            ...matched,
            rocket: {
              id: l.rocket?.id || null,
              name: rocketName,
              fullName: l.rocket?.fullName || rocketName,
            },
            provider: {
              id: l.provider?.id || null,
              name: providerName,
              type: l.provider?.type || l.providerType || 'Launch Provider',
            },
            pad: l.padDetails
              ? {
                  name: l.padDetails.name,
                  location: l.padDetails.location,
                  countryCode: l.padDetails.countryCode,
                  mapUrl: l.padDetails.mapUrl,
                }
              : undefined,
            destination: l.destination
              ? {
                  name: l.destination,
                  slug: l.destinationSlug || 'earth-orbit',
                  url: `/destinations/${l.destinationSlug || 'earth-orbit'}`,
                }
              : undefined,
          };

          return {
            id: `evt-launch-${l.id}`,
            slug: l.slug || `launch-${l.id}`,
            title: l.name || `${rocketName} Liftoff`,
            entityType: 'launch',
            eventType: 'Rocket Launch',
            category: 'Rocket Launches',
            status: l.launchStatus || 'scheduled',
            scheduleConfidence: l.scheduleConfidence || l.status?.name || 'Scheduled',
            description:
              l.description ||
              (l.mission?.description
                ? l.mission.description
                : `Scheduled orbital liftoff of ${rocketName} operated by ${providerName}.`),
            startTime: launchDate,
            endTime: l.windowEnd || launchDate,
            timeZone: 'UTC',
            locationOrVisibility: l.launchSite || l.location?.name || 'Global Launch Facility',
            viewingGuidance: l.streamUrl
              ? `Live webcast broadcast available. Liftoff pad: ${l.launchSite || 'Global Spaceport'}.`
              : `Liftoff scheduled from ${l.launchSite || 'Launch Complex'}.`,
            relatedMission: matched.mission?.name || l.mission?.name || null,
            relatedOrganization: providerName,
            source: l.dataSource || 'Launch Library 2 Developer Sandbox (v2.3.0)',
            sourceId: String(l.id),
            detailEndpoint: `/api/v1/launches/${l.slug}`,
            detailUrl: `/launches/${l.slug}`,
            isLaunch: true,
            launchId: l.id,
            launchSlug: l.slug,
            launchProvider: providerName,
            rocket: rocketName,
            launchStatus: l.launchStatus || 'scheduled',
            probability: l.probability,
            streamUrl: l.streamUrl,
            imageUrl:
              typeof l.imageUrl === 'string'
                ? l.imageUrl
                : typeof l.image === 'string'
                ? l.image
                : null,
            monthKey: l.monthKey,
            relatedEntities,
          };
        });
      }
    } catch (e) {
      console.warn('[EventsController] Failed to fetch live launches for calendar:', e.message);
    }

    // 3. Fetch real space events from Launch Library 2
    let liveLL2Events = [];
    try {
      const ll2Res = await fetch(`${env.LL2_API_BASE_URL || 'https://lldev.thespacedevs.com/2.3.0'}/events/?limit=30`, {
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent': 'SpaceOps/1.0',
          'Accept': 'application/json',
          ...(env.LL2_API_KEY ? { Authorization: `Token ${env.LL2_API_KEY}` } : {})
        }
      });
      if (ll2Res.ok) {
        const ll2Json = await ll2Res.json();
        liveLL2Events = (ll2Json.results || []).map((ev) => ({
          id: `evt-ll2-${ev.id}`,
          slug: ev.slug || `event-${ev.id}`,
          title: ev.name,
          entityType: 'celestial_event',
          eventType: ev.type?.name || 'Space Operations',
          category: ev.type?.name || 'Space Operations',
          status: 'confirmed',
          scheduleConfidence: 'Confirmed',
          description: ev.description || ev.name,
          startTime: ev.date,
          endTime: ev.date,
          timeZone: 'UTC',
          locationOrVisibility: ev.location || 'Orbital Space',
          streamUrl: ev.vid_urls?.[0]?.url || null,
          imageUrl: ev.image?.image_url || null,
          source: 'The Space Devs LL2 Live',
          sourceId: String(ev.id),
          detailUrl: `/events/${ev.slug}`,
          detailEndpoint: `/api/v1/events/${ev.slug}`,
          relatedEntities: matchRelatedEntities(ev.name + ' ' + (ev.description || ''), null, allMissions, allSpacecraft)
        }));
      }
    } catch (e) {
      // Non-fatal fallback
    }

    // Combine real observation/operations events, live launches, and LL2 live events
    let allEvents = [...repoEvents, ...launchEvents, ...liveLL2Events];

    // Filter by event type if specified
    if (filterType && filterType !== 'all') {
      allEvents = allEvents.filter((e) => {
        const evtType = (e.eventType || '').toLowerCase();
        const cat = (e.category || '').toLowerCase();
        const entType = (e.entityType || '').toLowerCase();
        return evtType.includes(filterType) || cat.includes(filterType) || entType.includes(filterType);
      });
    }

    // Filter by search query if specified
    if (q) {
      const query = q.toLowerCase();
      allEvents = allEvents.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          (e.description && e.description.toLowerCase().includes(query)) ||
          (e.rocket && e.rocket.toLowerCase().includes(query)) ||
          (e.launchProvider && e.launchProvider.toLowerCase().includes(query)) ||
          (e.locationOrVisibility && e.locationOrVisibility.toLowerCase().includes(query)) ||
          (e.relatedEntities?.mission?.name && e.relatedEntities.mission.name.toLowerCase().includes(query))
      );
    }

    // Filter by month (YYYY-MM) if specified
    if (month) {
      allEvents = allEvents.filter((e) => {
        if (!e.startTime) return false;
        return e.startTime.startsWith(month);
      });
    }

    // Sort chronologically ascending
    allEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    res.status(200).json({
      success: true,
      count: allEvents.length,
      data: allEvents,
      meta: {
        totalEvents: allEvents.length,
        repoEventsCount: repoEvents.length,
        launchesCount: launchEvents.length,
        dataSource: 'Launch Library 2 v2.3.0 + Verified Mission Operations & Ephemerides',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve space events',
      error: error.message,
    });
  }
}

export async function getEventBySlug(req, res) {
  try {
    const { slug } = req.params;
    const allMissions = spaceopsRepo.getMissions();
    const allSpacecraft = spaceopsRepo.getSpacecraft();

    // 1. Check if it's a repository event (celestial or mission/spacecraft event)
    let event = spaceopsRepo.getEventBySlugOrId(slug);

    if (event) {
      const eType = event.entityType || (event.relatedMission && !event.eventType?.includes('Meteor') ? 'mission' : 'celestial_event');
      const relatedEntities = {
        organization: event.relatedOrganization ? { name: event.relatedOrganization } : undefined,
      };

      if (event.relatedMission) {
        const foundMis = allMissions.find(
          (m) => m.id === event.relatedMission || m.slug === event.relatedMission || m.slug === event.missionSlug
        );
        if (foundMis) {
          relatedEntities.mission = {
            id: foundMis.id,
            name: foundMis.name,
            slug: foundMis.slug,
            url: `/missions/${foundMis.slug}`,
          };
        } else if (event.missionName) {
          relatedEntities.mission = {
            name: event.missionName,
            slug: event.missionSlug,
            url: event.missionSlug ? `/missions/${event.missionSlug}` : undefined,
          };
        }
      }

      if (event.relatedSpacecraft) {
        const foundCraft = allSpacecraft.find(
          (s) => s.id === event.relatedSpacecraft || s.slug === event.relatedSpacecraft || s.slug === event.spacecraftSlug
        );
        if (foundCraft) {
          relatedEntities.spacecraft = {
            id: foundCraft.id,
            name: foundCraft.name,
            slug: foundCraft.slug,
            url: `/spacecraft/${foundCraft.slug}`,
          };
        } else if (event.spacecraftName) {
          relatedEntities.spacecraft = {
            name: event.spacecraftName,
            slug: event.spacecraftSlug,
            url: event.spacecraftSlug ? `/spacecraft/${event.spacecraftSlug}` : undefined,
          };
        }
      }

      let detailUrl = `/events/${event.slug}`;
      let detailEndpoint = `/api/v1/events/${event.slug}`;

      if (eType === 'mission') {
        const misSlug = event.missionSlug || (relatedEntities.mission && relatedEntities.mission.slug);
        if (misSlug) {
          detailUrl = `/missions/${misSlug}`;
          detailEndpoint = `/api/v1/missions/${misSlug}`;
        }
      } else if (eType === 'spacecraft') {
        const craftSlug = event.spacecraftSlug || (relatedEntities.spacecraft && relatedEntities.spacecraft.slug);
        if (craftSlug) {
          detailUrl = `/spacecraft/${craftSlug}`;
          detailEndpoint = `/api/v1/spacecraft/${craftSlug}`;
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          ...event,
          entityType: eType,
          detailUrl,
          detailEndpoint,
          relatedEntities,
        },
      });
    }

    // 2. Check if it's a launch event
    const cleanSlug = slug.replace(/^evt-launch-/, '').replace(/^launch-/, '');
    const launch =
      (await launchProviderService.getLaunchBySlugOrId(cleanSlug)) ||
      (await launchProviderService.getLaunchBySlugOrId(slug));

    if (launch) {
      const rocketName =
        launch.rocketName ||
        launch.rocket?.fullName ||
        launch.rocket?.name ||
        (typeof launch.rocket === 'string' ? launch.rocket : 'Orbital Launch Vehicle');
      const providerName =
        launch.provider?.name || launch.launchProvider || 'Commercial Launch Provider';
      const launchDate = launch.launchDate || launch.plannedLaunchDate;

      const matchText = `${launch.name} ${launch.payload || ''} ${launch.description || ''} ${rocketName}`;
      const matched = matchRelatedEntities(matchText, launch.mission, allMissions, allSpacecraft);

      const relatedEntities = {
        ...matched,
        rocket: {
          id: launch.rocket?.id || null,
          name: rocketName,
          fullName: launch.rocket?.fullName || rocketName,
        },
        provider: {
          id: launch.provider?.id || null,
          name: providerName,
          type: launch.provider?.type || launch.providerType || 'Launch Provider',
        },
        pad: launch.padDetails
          ? {
              name: launch.padDetails.name,
              location: launch.padDetails.location,
              countryCode: launch.padDetails.countryCode,
              mapUrl: launch.padDetails.mapUrl,
            }
          : undefined,
        destination: launch.destination
          ? {
              name: launch.destination,
              slug: launch.destinationSlug || 'earth-orbit',
              url: `/destinations/${launch.destinationSlug || 'earth-orbit'}`,
            }
          : undefined,
      };

      return res.status(200).json({
        success: true,
        data: {
          id: `evt-launch-${launch.id}`,
          slug: launch.slug,
          title: launch.name || `${rocketName} Liftoff`,
          entityType: 'launch',
          eventType: 'Rocket Launch',
          category: 'Rocket Launches',
          description:
            launch.description ||
            launch.payload ||
            `Scheduled orbital launch of ${rocketName} operated by ${providerName}.`,
          startTime: launchDate,
          endTime: launch.windowEnd || launchDate,
          timeZone: 'UTC',
          locationOrVisibility: launch.launchSite || launch.location?.name || 'Global Launch Facility',
          viewingGuidance: launch.streamUrl
            ? `Live launch broadcast available at ${launch.streamUrl}. Launch pad: ${launch.launchSite || 'Global Spaceport'}.`
            : `Liftoff scheduled from ${launch.launchSite || 'Launch Complex'}.`,
          relatedMission: matched.mission?.name || launch.mission?.name || null,
          relatedOrganization: providerName,
          source: launch.dataSource || 'Launch Library 2 (v2.3.0)',
          sourceId: String(launch.id),
          detailEndpoint: `/api/v1/launches/${launch.slug}`,
          detailUrl: `/launches/${launch.slug}`,
          isLaunch: true,
          launchId: launch.id,
          launchSlug: launch.slug,
          launchProvider: providerName,
          rocket: rocketName,
          launchStatus: launch.launchStatus || 'scheduled',
          scheduleConfidence: launch.scheduleConfidence || launch.status?.name || 'Scheduled',
          probability: launch.probability,
          streamUrl: launch.streamUrl,
          imageUrl:
            typeof launch.imageUrl === 'string'
              ? launch.imageUrl
              : typeof launch.image === 'string'
              ? launch.image
              : null,
          relatedEntities,
        },
      });
    }

    // 3. Check if it's a mission
    const mission = spaceopsRepo.getMissionBySlugOrId(slug.replace(/^evt-mis-/, ''));
    if (mission) {
      return res.status(200).json({
        success: true,
        data: {
          id: `evt-mis-${mission.id}`,
          slug: mission.slug,
          title: `${mission.name} Mission Record`,
          entityType: 'mission',
          eventType: 'Mission Milestone',
          category: 'Mission Milestones',
          description: mission.summary || mission.description,
          startTime: mission.launchDate || new Date().toISOString(),
          timeZone: 'UTC',
          source: 'SpaceOps Mission Registry',
          sourceId: mission.id,
          detailEndpoint: `/api/v1/missions/${mission.slug}`,
          detailUrl: `/missions/${mission.slug}`,
          relatedEntities: {
            mission: { id: mission.id, name: mission.name, slug: mission.slug, url: `/missions/${mission.slug}` },
            organization: { name: mission.organization },
          },
        },
      });
    }

    // 4. Check if it's a spacecraft
    const craft = spaceopsRepo.getSpacecraftBySlugOrId(slug.replace(/^evt-sc-/, ''));
    if (craft) {
      return res.status(200).json({
        success: true,
        data: {
          id: `evt-sc-${craft.id}`,
          slug: craft.slug,
          title: `${craft.name} Spacecraft Operations`,
          entityType: 'spacecraft',
          eventType: 'Spacecraft Operations',
          category: 'Spacecraft Operations',
          description: craft.educationalNotes || craft.keyAchievements,
          startTime: craft.launchDate || new Date().toISOString(),
          timeZone: 'UTC',
          source: 'SpaceOps Spacecraft Registry',
          sourceId: craft.id,
          detailEndpoint: `/api/v1/spacecraft/${craft.slug}`,
          detailUrl: `/spacecraft/${craft.slug}`,
          relatedEntities: {
            spacecraft: { id: craft.id, name: craft.name, slug: craft.slug, url: `/spacecraft/${craft.slug}` },
            organization: { name: craft.organization },
          },
        },
      });
    }

    return res.status(404).json({
      success: false,
      message: `Space event '${slug}' not found in registry or API providers.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve space event details',
      error: error.message,
    });
  }
}
