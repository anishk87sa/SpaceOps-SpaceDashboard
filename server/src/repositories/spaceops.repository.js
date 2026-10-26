/**
 * SpaceOps - Public Space Exploration Data Repository
 * Authoritative public space discovery data model supporting:
 * - Missions (Interplanetary, Telescopes, Lunar, Earth Observation, Human Spaceflight)
 * - Launches (Upcoming & Past rocket launches with countdowns, pads, providers)
 * - Spacecraft (Probes, Rovers, Telescopes, Space Stations, Crewed Vehicles)
 * - Destinations (Moon, Mars, Earth Orbit, Jupiter, Saturn, Asteroids, Deep Space)
 * - Space Events (Astronomical observations, Eclipses, Meteor Showers, Conjunctions, Launches)
 * - Space News (Verified agency announcements, scientific discoveries, launch updates)
 * - Educational Articles (Learn center for students, enthusiasts, and general public)
 * - Organizations (Space agencies & commercial launch providers)
 * - Data Sources (Integration & freshness indicators)
 * - Saved Items (Bookmarks for personal discovery)
 */

// 1. MISSIONS
const INITIAL_MISSIONS = [
  {
    id: "mis-europa-clipper",
    slug: "europa-clipper",
    name: "Europa Clipper",
    summary: "NASA's flagship mission investigating whether Jupiter's icy moon Europa has conditions suitable for life.",
    description: "Europa Clipper will conduct detailed reconnaissance of Jupiter's moon Europa and investigate whether the icy moon could harbor conditions suitable for life. The mission will place a spacecraft in orbit around Jupiter in order to perform dozens of close flybys of Europa, using ice-penetrating radar, cameras, and thermal imagers to probe its subsurface ocean.",
    category: "Planetary Science",
    destination: "Jupiter & Moons",
    destinationSlug: "jupiter",
    organization: "NASA",
    organizationType: "Space Agency",
    launchDate: "2024-10-14",
    launchVehicle: "Falcon Heavy",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://europa.nasa.gov",
    objectives: [
      "Confirm the presence and determine properties of Europa's subsurface ocean.",
      "Characterize the thickness of the icy crust and any subsurface water pockets.",
      "Investigate the moon's composition and chemistry to assess habitability.",
      "Characterize the geology and surface features for future lander scouting."
    ],
    milestones: [
      { id: "m-ec-1", title: "Launch from Kennedy Space Center", date: "2024-10-14", status: "completed" },
      { id: "m-ec-2", title: "Mars Gravity Assist Flyby", date: "2025-02-27", status: "upcoming" },
      { id: "m-ec-3", title: "Earth Gravity Assist Flyby", date: "2026-12-01", status: "upcoming" },
      { id: "m-ec-4", title: "Jupiter Orbital Insertion (JOI)", date: "2030-04-11", status: "upcoming" }
    ],
    scientificDiscoveries: "First deep space probe to deploy ultra-wide 30-meter radar antennas for ice sounding. High-precision magnetometer data will measure induced magnetic field from the saline liquid ocean.",
    associatedSpacecraft: ["sc-europa-clipper"],
    sources: [
      { name: "NASA JPL Europa Clipper Mission", url: "https://europa.nasa.gov" },
      { name: "NASA Science Solar System Exploration", url: "https://solarsystem.nasa.gov/missions/europa-clipper" }
    ],
    createdAt: "2024-10-14T16:06:00Z",
    updatedAt: "2026-10-01T12:00:00Z"
  },
  {
    id: "mis-perseverance",
    slug: "mars-perseverance-rover",
    name: "Mars 2020 Perseverance Rover",
    summary: "Exploring Jezero Crater on Mars, searching for biosignatures, and caching core samples for Earth return.",
    description: "Perseverance is a car-sized Mars rover designed to explore the crater Jezero on Mars as part of NASA's Mars 2020 mission. It carries seven primary scientific instruments, 19 cameras, two microphones, and carried the Ingenuity helicopter. It is actively gathering rock cores from ancient lakebed deltas.",
    category: "Mars Exploration",
    destination: "Mars",
    destinationSlug: "mars",
    organization: "NASA",
    organizationType: "Space Agency",
    launchDate: "2020-07-30",
    launchVehicle: "Atlas V 541",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://mars.nasa.gov/mars2020",
    objectives: [
      "Characterize the geology and climate history of Jezero Crater.",
      "Search for signs of ancient microscopic life (biosignatures).",
      "Collect and hermetically seal rock and regolith samples for Mars Sample Return.",
      "Test oxygen production from the Martian atmosphere using MOXIE."
    ],
    milestones: [
      { id: "m-p-1", title: "Launch from Cape Canaveral", date: "2020-07-30", status: "completed" },
      { id: "m-p-2", title: "Touchdown at Jezero Crater (Seven Minutes of Terror)", date: "2021-02-18", status: "completed" },
      { id: "m-p-3", title: "Ingenuity Helicopter First Powered Flight on Another World", date: "2021-04-19", status: "completed" },
      { id: "m-p-4", title: "Crater Rim Ascent & Exploration Campaign", date: "2024-09-15", status: "in-progress" }
    ],
    scientificDiscoveries: "MOXIE generated 122 grams of breathable oxygen from carbon dioxide. Confirmed Jezero Crater once held an active river delta and lake with fine mudstones capable of preserving organic molecules.",
    associatedSpacecraft: ["sc-perseverance", "sc-ingenuity"],
    sources: [
      { name: "NASA Mars 2020 Home", url: "https://mars.nasa.gov/mars2020" }
    ],
    createdAt: "2020-07-30T11:50:00Z",
    updatedAt: "2026-10-18T09:30:00Z"
  },
  {
    id: "mis-jwst",
    slug: "james-webb-space-telescope",
    name: "James Webb Space Telescope (JWST)",
    summary: "The premier general astrophysics observatory uncovering the earliest galaxies and probing exoplanet atmospheres.",
    description: "The James Webb Space Telescope is an infrared observatory orbiting the Sun-Earth L2 Lagrange point, 1.5 million kilometers from Earth. Featuring a 6.5-meter gold-coated beryllium primary mirror, Webb sees back more than 13.5 billion years to witness the first stars and galaxies forming after the Big Bang.",
    category: "Space Telescopes",
    destination: "Deep Space / L2",
    destinationSlug: "deep-space",
    organization: "NASA / ESA / CSA",
    organizationType: "International Partnership",
    launchDate: "2021-12-25",
    launchVehicle: "Ariane 5 ECA",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://webbtelescope.org",
    objectives: [
      "Search for the first stars and galaxies that formed after the Big Bang.",
      "Study the assembly and evolution of galaxies over cosmic time.",
      "Observe the birth of stars and protoplanetary systems obscured by dust clouds.",
      "Measure physical and chemical properties of exoplanetary atmospheres for biosignature precursors."
    ],
    milestones: [
      { id: "m-jw-1", title: "Launch aboard Ariane 5 from Kourou", date: "2021-12-25", status: "completed" },
      { id: "m-jw-2", title: "Sunshield & Secondary Mirror Deployment", date: "2022-01-08", status: "completed" },
      { id: "m-jw-3", title: "Arrival at Sun-Earth L2 Orbit", date: "2022-01-24", status: "completed" },
      { id: "m-jw-4", title: "Release of First Full-Color Science Images", date: "2022-07-12", status: "completed" }
    ],
    scientificDiscoveries: "Identified massive galaxies existing just 300 million years after the Big Bang (JADES-GS-z14-0). Detected carbon dioxide, water vapor, and sulfur dioxide in hot gas giant WASP-39b atmosphere.",
    associatedSpacecraft: ["sc-jwst"],
    sources: [
      { name: "Space Telescope Science Institute (STScI)", url: "https://webbtelescope.org" },
      { name: "NASA Webb Portal", url: "https://nasa.gov/webb" }
    ],
    createdAt: "2021-12-25T12:20:00Z",
    updatedAt: "2026-10-20T14:15:00Z"
  },
  {
    id: "mis-artemis-program",
    slug: "artemis-program",
    name: "Artemis Lunar Program",
    summary: "Humanity's return to the Moon: establishing sustainable human presence and preparing for missions to Mars.",
    description: "The Artemis campaign is a collaborative spaceflight effort led by NASA alongside international partners (ESA, JAXA, CSA) and commercial aerospace leaders. Artemis aims to land the first woman and first person of color on the lunar South Pole, explore water ice in permanently shadowed regions, and deploy the Lunar Gateway space station.",
    category: "Lunar Exploration",
    destination: "Moon",
    destinationSlug: "moon",
    organization: "NASA",
    organizationType: "Space Agency",
    launchDate: "2022-11-16",
    launchVehicle: "Space Launch System (SLS)",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://www.nasa.gov/artemisprogram",
    objectives: [
      "Demonstrate deep-space human flight systems with Orion and SLS.",
      "Establish permanent surface infrastructure and power grids at the Lunar South Pole.",
      "Extract and process lunar water ice into rocket propellant and life support consumables.",
      "Assemble the Lunar Gateway space station in a Near-Rectilinear Halo Orbit (NRHO)."
    ],
    milestones: [
      { id: "m-art-1", title: "Artemis I Uncrewed Lunar Flyby & Ocean Splashdown", date: "2022-11-16", status: "completed" },
      { id: "m-art-2", title: "Artemis II Crewed Lunar Orbit Mission (Wiseman, Glover, Koch, Hansen)", date: "2025-09-01", status: "upcoming" },
      { id: "m-art-3", title: "Artemis III Crewed Lunar South Pole Surface Landing", date: "2026-09-15", status: "upcoming" },
      { id: "m-art-4", title: "Gateway Station Initial Module Deployment (PPE & HALO)", date: "2027-04-01", status: "upcoming" }
    ],
    scientificDiscoveries: "Artemis I verified Orion heat shield performance at 40,000 km/h lunar return velocity and mapped radiation levels in the Van Allen belts with Matroshka phantoms.",
    associatedSpacecraft: ["sc-orion-mpcv", "sc-gateway-station", "sc-starship-hls"],
    sources: [
      { name: "NASA Artemis Program", url: "https://www.nasa.gov/artemis" }
    ],
    createdAt: "2022-11-16T06:47:00Z",
    updatedAt: "2026-10-15T11:00:00Z"
  },
  {
    id: "mis-chandrayaan-3",
    slug: "chandrayaan-3",
    name: "Chandrayaan-3 Lunar South Pole Mission",
    summary: "ISRO's historic lunar lander and rover mission, marking humanity's first successful touchdown near the lunar south pole.",
    description: "Chandrayaan-3 is the third lunar exploration mission developed by the Indian Space Research Organisation (ISRO). On August 23, 2023, the Vikram lander executed a flawless powered descent, making India the fourth nation to achieve a soft lunar landing and the first in the unexplored high-latitude southern polar terrain.",
    category: "Lunar Exploration",
    destination: "Moon",
    destinationSlug: "moon",
    organization: "ISRO",
    organizationType: "Space Agency",
    launchDate: "2023-07-14",
    launchVehicle: "LVM3 M4",
    status: "completed",
    featuredImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://www.isro.gov.in/Chandrayaan3.html",
    objectives: [
      "Demonstrate safe and soft landing on the lunar surface near 69° South latitude.",
      "Deploy the Pragyan rover for in-situ elemental composition analysis of lunar regolith.",
      "Conduct thermal conductivity experiments and lunar seismicity measurements (ILSA, ChaSTE)."
    ],
    milestones: [
      { id: "m-ch-1", title: "Launch from Satish Dhawan Space Centre", date: "2023-07-14", status: "completed" },
      { id: "m-ch-2", title: "Lunar Orbit Insertion", date: "2023-08-05", status: "completed" },
      { id: "m-ch-3", title: "Historic Touchdown at Shiv Shakti Point", date: "2023-08-23", status: "completed" },
      { id: "m-ch-4", title: "Hop Test Demonstration by Vikram Lander", date: "2023-09-03", status: "completed" }
    ],
    scientificDiscoveries: "In-situ Laser-Induced Breakdown Spectroscope (LIBS) unequivocally confirmed presence of Sulfur (S) in high-latitude lunar regolith along with Aluminum, Calcium, Iron, and Titanium. ChaSTE probe recorded extreme surface-to-subsurface temperature gradient (-10°C at 8cm depth vs +50°C surface).",
    associatedSpacecraft: ["sc-vikram-lander", "sc-pragyan-rover"],
    sources: [
      { name: "ISRO Chandrayaan-3 Official Archive", url: "https://www.isro.gov.in/Chandrayaan3.html" }
    ],
    createdAt: "2023-07-14T09:05:00Z",
    updatedAt: "2024-03-01T10:00:00Z"
  },
  {
    id: "mis-voyager-1",
    slug: "voyager-1-interstellar",
    name: "Voyager 1 Interstellar Mission",
    summary: "Humanity's most distant emissary, now traveling through interstellar space over 24 billion kilometers from Earth.",
    description: "Launched in 1977, Voyager 1 explored the Jovian and Saturnian systems before continuing outward. In August 2012, it crossed the heliopause—the boundary where the solar wind gives way to the interstellar medium—becoming the first human-made object to enter interstellar space. Operating for over 49 years on radioisotope thermoelectric generators.",
    category: "Deep Space",
    destination: "Interstellar Space",
    destinationSlug: "deep-space",
    organization: "NASA",
    organizationType: "Space Agency",
    launchDate: "1977-09-05",
    launchVehicle: "Titan IIIE Centaur",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://voyager.jpl.nasa.gov",
    objectives: [
      "Conduct close flyby encounters of Jupiter, Saturn, and Titan (completed).",
      "Characterize the outer boundary of the solar magnetic bubble (heliosphere).",
      "Measure pristine interstellar cosmic rays and magnetic fields unimpeded by solar wind."
    ],
    milestones: [
      { id: "m-v1-1", title: "Launch from Cape Canaveral", date: "1977-09-05", status: "completed" },
      { id: "m-v1-2", title: "Jupiter Closest Encounter", date: "1979-03-05", status: "completed" },
      { id: "m-v1-3", title: "Saturn and Titan Flyby", date: "1980-11-12", status: "completed" },
      { id: "m-v1-4", title: "Historic Crossing of the Heliopause into Interstellar Space", date: "2012-08-25", status: "completed" }
    ],
    scientificDiscoveries: "First direct measurements of interstellar plasma density (showing a dramatic 40x jump outside the heliopause) and detection of active vulcanism on Jupiter's moon Io.",
    associatedSpacecraft: ["sc-voyager-1"],
    sources: [
      { name: "NASA JPL Voyager Interstellar Mission", url: "https://voyager.jpl.nasa.gov" }
    ],
    createdAt: "1977-09-05T12:56:00Z",
    updatedAt: "2026-10-10T15:20:00Z"
  },
  {
    id: "mis-iss-orbit",
    slug: "international-space-station",
    name: "International Space Station (ISS)",
    summary: "Continuously inhabited microgravity laboratory fostering international cooperation and scientific research for over two decades.",
    description: "The International Space Station is a modular space station in low Earth orbit. It is a multinational collaborative project involving NASA, Roscosmos, ESA, JAXA, and CSA. Operating continuously with human crew since November 2000, it serves as a microgravity research facility where crews conduct experiments in biology, physics, astronomy, and meteorology.",
    category: "Human Spaceflight",
    destination: "Earth Orbit",
    destinationSlug: "earth-orbit",
    organization: "International Partnership",
    organizationType: "Multi-Agency Consortium",
    launchDate: "1998-11-20",
    launchVehicle: "Proton-K / Space Shuttle",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://www.nasa.gov/station",
    objectives: [
      "Maintain a permanently inhabited microgravity research platform.",
      "Conduct long-duration human physiology studies essential for Mars exploration.",
      "Serve as an orbital testbed for advanced life support and environmental control technologies.",
      "Foster global scientific cooperation across geopolitical boundaries."
    ],
    milestones: [
      { id: "m-iss-1", title: "Zarya First Module Launch", date: "1998-11-20", status: "completed" },
      { id: "m-iss-2", title: "Expedition 1 Permanent Crew Arrival (Shepherd, Gidzenko, Krikalev)", date: "2000-11-02", status: "completed" },
      { id: "m-iss-3", title: "Installation of Cupola Observation Module", date: "2010-02-15", status: "completed" },
      { id: "m-iss-4", title: "25+ Years of Uninterrupted Human Presence in Space", date: "2025-11-02", status: "completed" }
    ],
    scientificDiscoveries: "Over 3,000 peer-reviewed scientific studies completed in microgravity, including protein crystal growth for cancer therapies, Cold Atom Laboratory Bose-Einstein condensates, and closed-loop water recovery exceeding 98%.",
    associatedSpacecraft: ["sc-iss-station"],
    sources: [
      { name: "NASA International Space Station", url: "https://www.nasa.gov/station" },
      { name: "ESA Human and Robotic Exploration", url: "https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration" }
    ],
    createdAt: "1998-11-20T06:40:00Z",
    updatedAt: "2026-10-21T18:00:00Z"
  },
  {
    id: "mis-parker-solar",
    slug: "parker-solar-probe",
    name: "Parker Solar Probe",
    summary: "NASA's historic mission touching the Sun to unlock the mysteries of the solar corona and solar wind origins.",
    description: "Parker Solar Probe travels closer to the solar surface than any spacecraft before it, well within the orbit of Mercury. Protected by an ultra-light carbon-composite shield enduring 1,400°C temperatures, Parker swoops within 6.1 million kilometers of the Sun at speeds exceeding 690,000 km/h.",
    category: "Solar Science",
    destination: "The Sun",
    destinationSlug: "the-sun",
    organization: "NASA",
    organizationType: "Space Agency",
    launchDate: "2018-08-12",
    launchVehicle: "Delta IV Heavy",
    status: "active",
    featuredImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80",
    officialWebsite: "https://parkersolarprobe.jhuapl.edu",
    objectives: [
      "Trace the flow of energy that heats the solar corona and accelerates the solar wind.",
      "Determine the structure and dynamics of the plasma and magnetic fields at the sources of the solar wind.",
      "Explore mechanisms that accelerate and transport energetic particles."
    ],
    milestones: [
      { id: "m-psp-1", title: "Launch aboard Delta IV Heavy", date: "2018-08-12", status: "completed" },
      { id: "m-psp-2", title: "First Crossing of the Alfvén Critical Surface (Touching the Sun)", date: "2021-04-28", status: "completed" },
      { id: "m-psp-3", title: "Final Venus Gravity Assist (#7)", date: "2024-11-06", status: "completed" },
      { id: "m-psp-4", title: "Closest Solar Approach at 6.1M km at Record Speed 692,000 km/h", date: "2025-06-19", status: "completed" }
    ],
    scientificDiscoveries: "Discovered 'switchbacks'—sudden S-shaped reversals in the Sun's magnetic field—and directly observed the dust-free zone near the Sun where cosmic dust vaporizes.",
    associatedSpacecraft: ["sc-parker-probe"],
    sources: [
      { name: "Johns Hopkins Applied Physics Laboratory", url: "https://parkersolarprobe.jhuapl.edu" }
    ],
    createdAt: "2018-08-12T07:31:00Z",
    updatedAt: "2026-10-19T08:00:00Z"
  }
];

// 2. LAUNCHES
const INITIAL_LAUNCHES = [
  {
    id: "lnch-starship-ift7",
    slug: "spacex-starship-flight-7",
    name: "Starship Integrated Flight Test 7",
    launchProvider: "SpaceX",
    providerType: "Commercial Launch Provider",
    rocket: "Starship & Super Heavy Booster",
    launchSite: "Starbase Orbital Pad A, Boca Chica, Texas",
    plannedLaunchDate: "2026-11-14T13:00:00Z",
    actualLaunchDate: null,
    launchStatus: "scheduled",
    scheduleConfidence: "Confirmed",
    payload: "Next-Generation Starlink V3 Dispenser & In-Space Propellant Transfer Test",
    destination: "Low Earth Orbit (Orbital Insertion & Return)",
    destinationSlug: "earth-orbit",
    description: "Seventh full-stack integrated flight test of the Starship launch vehicle. Flight objectives include orbital propellant transfer demonstration between header tanks and second consecutive booster tower catch at Starbase.",
    streamUrl: "https://youtube.com/@SpaceX/live",
    isDemonstrationSchedule: false,
    sources: [{ name: "SpaceX Official Broadcast", url: "https://www.spacex.com/launches" }]
  },
  {
    id: "lnch-falcon9-starlink-12-4",
    slug: "falcon-9-starlink-group-12-4",
    name: "Falcon 9 Starlink Group 12-4",
    launchProvider: "SpaceX",
    providerType: "Commercial Launch Provider",
    rocket: "Falcon 9 Block 5",
    launchSite: "Space Launch Complex 40 (SLC-40), Cape Canaveral, Florida",
    plannedLaunchDate: "2026-10-28T21:45:00Z",
    actualLaunchDate: null,
    launchStatus: "go",
    scheduleConfidence: "High Confidence",
    payload: "23 Starlink Direct-to-Cell V2 Mini Satellites",
    destination: "Low Earth Orbit (530 km, 53°)",
    destinationSlug: "earth-orbit",
    description: "Commercial broadband satellite deployment adding direct satellite-to-cellular connectivity for emergency texting and voice.",
    streamUrl: "https://youtube.com/@SpaceX/live",
    isDemonstrationSchedule: false,
    sources: [{ name: "SpaceX Flight Manifest", url: "https://www.spacex.com" }]
  },
  {
    id: "lnch-ariane6-va263",
    slug: "ariane-6-va263-metop-sg",
    name: "Ariane 6 (VA263) MetOp-SG A1",
    launchProvider: "Arianespace",
    providerType: "Commercial Launch Provider / ESA",
    rocket: "Ariane 62 (Two P120C Boosters)",
    launchSite: "ELA-4, Guiana Space Centre, Kourou, French Guiana",
    plannedLaunchDate: "2026-12-05T08:30:00Z",
    actualLaunchDate: null,
    launchStatus: "scheduled",
    scheduleConfidence: "Moderate Confidence (Target Window)",
    payload: "MetOp-SG A1 Weather & Climate Monitoring Satellite",
    destination: "Sun-Synchronous Polar Orbit (820 km)",
    destinationSlug: "earth-orbit",
    description: "Deployment of Europe's next-generation polar-orbiting meteorological observatory providing hyper-spectral soundings for European weather forecasting.",
    streamUrl: "https://youtube.com/@Arianespace/live",
    isDemonstrationSchedule: false,
    sources: [{ name: "Arianespace Launch Manifest", url: "https://www.arianespace.com" }]
  },
  {
    id: "lnch-isro-pslv-c59",
    slug: "pslv-c59-proba-3",
    name: "PSLV-C59 Proba-3 Precision Formation",
    launchProvider: "ISRO",
    providerType: "Space Agency",
    rocket: "PSLV-XL",
    launchSite: "First Launch Pad, Satish Dhawan Space Centre, Sriharikota, India",
    plannedLaunchDate: "2026-11-29T10:38:00Z",
    actualLaunchDate: null,
    launchStatus: "scheduled",
    scheduleConfidence: "Confirmed",
    payload: "ESA Proba-3 Coronagraph & Occulter Spacecraft Pair",
    destination: "Highly Elliptical Earth Orbit (600 x 60,500 km)",
    destinationSlug: "earth-orbit",
    description: "Launch of the world's first millimeter-precision satellite formation flying mission to generate an artificial solar eclipse and study the Sun's inner corona.",
    streamUrl: "https://www.isro.gov.in/live",
    isDemonstrationSchedule: false,
    sources: [{ name: "ISRO Missions", url: "https://www.isro.gov.in" }]
  },
  {
    id: "lnch-artemis-2",
    slug: "sls-artemis-ii-crewed-lunar-orbit",
    name: "Artemis II Crewed Lunar Orbit Mission",
    launchProvider: "NASA",
    providerType: "Space Agency",
    rocket: "Space Launch System (SLS) Block 1 Crew",
    launchSite: "Launch Complex 39B, Kennedy Space Center, Florida",
    plannedLaunchDate: "2025-09-20T14:15:00Z",
    actualLaunchDate: null,
    launchStatus: "scheduled",
    scheduleConfidence: "Target Launch Period",
    payload: "Orion Spacecraft with 4 Astronauts (Reid Wiseman, Victor Glover, Christina Koch, Jeremy Hansen)",
    destination: "Lunar Free-Return Trajectory",
    destinationSlug: "moon",
    description: "First crewed flight test of the Orion spacecraft and Space Launch System, carrying four astronauts on a 10-day journey around the far side of the Moon.",
    streamUrl: "https://nasa.gov/nasatv",
    isDemonstrationSchedule: false,
    sources: [{ name: "NASA Artemis II Mission Overview", url: "https://www.nasa.gov/artemis-ii" }]
  },
  {
    id: "lnch-europa-clipper-completed",
    slug: "falcon-heavy-europa-clipper",
    name: "Falcon Heavy Europa Clipper Liftoff",
    launchProvider: "SpaceX / NASA",
    providerType: "Commercial / Agency Collaboration",
    rocket: "Falcon Heavy (Expendable Core)",
    launchSite: "Launch Complex 39A, Kennedy Space Center, Florida",
    plannedLaunchDate: "2024-10-14T16:06:00Z",
    actualLaunchDate: "2024-10-14T16:06:00Z",
    launchStatus: "success",
    scheduleConfidence: "Completed Mission",
    payload: "Europa Clipper Flagship Spacecraft (6,000 kg)",
    destination: "Mars-Earth Gravity Assist Trajectory to Jupiter",
    destinationSlug: "jupiter",
    description: "Spectacular liftoff sending NASA's largest planetary probe ever assembled on a 2.9-billion-kilometer journey to Jupiter's ocean world.",
    streamUrl: "https://youtube.com/@NASA",
    isDemonstrationSchedule: false,
    sources: [{ name: "NASA Launch Record", url: "https://blogs.nasa.gov/europaclipper" }]
  }
];

// 3. SPACECRAFT
const INITIAL_SPACECRAFT = [
  {
    id: "sc-jwst",
    slug: "jwst-observatory",
    name: "James Webb Space Telescope",
    type: "Space Telescope",
    category: "Space Telescopes",
    associatedMission: "James Webb Space Telescope (JWST)",
    missionSlug: "james-webb-space-telescope",
    organization: "NASA / ESA / CSA",
    destination: "Sun-Earth L2 Lagrange Point (1.5M km)",
    destinationSlug: "deep-space",
    launchDate: "2021-12-25",
    status: "operational",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    specifications: {
      massKg: 6500,
      mirrorDiameterMeters: 6.5,
      sunshieldDimensions: "21.2m x 14.2m (tennis court sized)",
      instruments: ["NIRCam", "NIRSpec", "MIRI", "FGS/NIRISS"],
      operatingTempKelvin: 40
    },
    keyAchievements: "Observed the oldest known galaxy candidate at z=14.32, resolved atmospheric chemical inventories of sub-Neptune exoplanets, mapped stellar nurseries in Carina Nebula.",
    officialSource: "https://webbtelescope.org",
    educationalNotes: "Webb folds up inside an Ariane 5 rocket fairing and unfolds origami-style in deep space. Because it observes in infrared, its optics must be kept at -233°C using a 5-layer Kapton sunshield."
  },
  {
    id: "sc-perseverance",
    slug: "perseverance-rover",
    name: "Perseverance Mars Rover",
    type: "Rovers & Landers",
    category: "Rovers and Landers",
    associatedMission: "Mars 2020 Perseverance Rover",
    missionSlug: "mars-perseverance-rover",
    organization: "NASA",
    destination: "Mars (Jezero Crater)",
    destinationSlug: "mars",
    launchDate: "2020-07-30",
    status: "operational",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    specifications: {
      massKg: 1025,
      lengthMeters: 3.0,
      powerSource: "Multi-Mission Radioisotope Thermoelectric Generator (MMRTG, 110W)",
      roboticArmLengthMeters: 2.1,
      instruments: ["Mastcam-Z", "SuperCam", "PIXL", "SHERLOC", "MOXIE", "MEDA", "RIMFAX"]
    },
    keyAchievements: "Over 30 kilometers driven across Jezero Crater, collected and sealed 24 rock core samples, tested in-situ oxygen generation from carbon dioxide.",
    officialSource: "https://mars.nasa.gov/mars2020",
    educationalNotes: "Perseverance has an aluminum drill on its robotic arm that cuts intact chalk-sized cylinders of Martian stone and seals them in sterile titanium tubes for future recovery."
  },
  {
    id: "sc-europa-clipper",
    slug: "europa-clipper-probe",
    name: "Europa Clipper Spacecraft",
    type: "Space Probes",
    category: "Space Probes",
    associatedMission: "Europa Clipper",
    missionSlug: "europa-clipper",
    organization: "NASA",
    destination: "Jupiter & Europa",
    destinationSlug: "jupiter",
    launchDate: "2024-10-14",
    status: "operational",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    specifications: {
      massKg: 6000,
      wingspanMeters: 30.5,
      powerSource: "Dual giant solar arrays (largest ever built for planetary exploration)",
      instruments: ["REASON Radar", "MISE Spectrometer", "PIMS Plasma", "MASPEX Mass Spectrometer"]
    },
    keyAchievements: "Successfully launched on Falcon Heavy; deployed radar antennas and solar arrays; in cruise phase toward Mars gravity assist.",
    officialSource: "https://europa.nasa.gov",
    educationalNotes: "Because Jupiter is five times farther from the Sun than Earth, sunlight is 25 times weaker. Clipper's solar arrays span longer than a basketball court to capture sufficient power."
  },
  {
    id: "sc-iss-station",
    slug: "international-space-station-hab",
    name: "International Space Station",
    type: "Space Stations",
    category: "Space Stations",
    associatedMission: "International Space Station (ISS)",
    missionSlug: "international-space-station",
    organization: "NASA / Roscosmos / ESA / JAXA / CSA",
    destination: "Low Earth Orbit (418 km)",
    destinationSlug: "earth-orbit",
    launchDate: "1998-11-20",
    status: "operational",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1000&q=80",
    specifications: {
      massKg: 450000,
      habitableVolumeM3: 388,
      orbitalSpeedKmH: 27600,
      orbitalPeriodMin: 92.9,
      orbitalAltitudeKm: 418
    },
    keyAchievements: "Over 250 astronauts from 21 countries have lived and worked on the station. 25 continuous years of human presence in space.",
    officialSource: "https://www.nasa.gov/station",
    educationalNotes: "The ISS circles Earth every 90 minutes, meaning astronauts on board experience 16 sunrises and sunsets every 24-hour day."
  },
  {
    id: "sc-voyager-1",
    slug: "voyager-1-probe",
    name: "Voyager 1",
    type: "Space Probes",
    category: "Space Probes",
    associatedMission: "Voyager 1 Interstellar Mission",
    missionSlug: "voyager-1-interstellar",
    organization: "NASA JPL",
    destination: "Interstellar Space (24.5B km)",
    destinationSlug: "deep-space",
    launchDate: "1977-09-05",
    status: "operational",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    specifications: {
      massKg: 722,
      antennaDiameterMeters: 3.7,
      transmitterPowerWatts: 23,
      oneWayLightTimeHours: 22.8
    },
    keyAchievements: "Discovered active volcanism on Io, ring system around Jupiter, took the Pale Blue Dot portrait of Earth, crossed into interstellar space.",
    officialSource: "https://voyager.jpl.nasa.gov",
    educationalNotes: "A radio command sent from Earth at the speed of light takes nearly 23 hours to reach Voyager 1, and another 23 hours for the confirmation reply to return."
  },
  {
    id: "sc-curiosity",
    slug: "curiosity-rover",
    name: "Curiosity Mars Science Laboratory",
    type: "Rovers & Landers",
    category: "Rovers and Landers",
    associatedMission: "Mars 2020 Perseverance Rover",
    missionSlug: "mars-perseverance-rover",
    organization: "NASA",
    destination: "Mars (Gale Crater)",
    destinationSlug: "mars",
    launchDate: "2011-11-26",
    status: "operational",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    specifications: {
      massKg: 899,
      lengthMeters: 2.9,
      powerSource: "MMRTG Plutonium-238",
      instruments: ["ChemCam", "SAM", "CheMin", "REMS", "APXS"]
    },
    keyAchievements: "Proved ancient Mars had freshwater lakes with all essential chemical ingredients for microbial life. Climbed Mount Sharp over 13 years.",
    officialSource: "https://mars.nasa.gov/msl",
    educationalNotes: "Curiosity zaps Martian rocks with an infrared laser to vaporize microscopic bits of stone and read their elemental composition from the emitted spark."
  }
];

// 4. DESTINATIONS
const INITIAL_DESTINATIONS = [
  {
    id: "dest-earth-orbit",
    slug: "earth-orbit",
    name: "Earth Orbit",
    type: "Orbital Environment",
    tagline: "The gateway to the cosmos and home to human space stations.",
    description: "Low Earth Orbit (LEO) and Geostationary Orbit (GEO) host humanity's primary space infrastructure, including the International Space Station, Earth-observing environmental satellites, global communication constellations, and space telescopes.",
    distanceFromEarth: "160 to 35,786 km",
    orbitalPeriod: "90 min (LEO) to 24 hr (GEO)",
    highlights: [
      "Inhabited by astronaut crews continuously since November 2000.",
      "Hosts weather, climate, and ocean monitoring satellites preserving life on Earth.",
      "Primary departure staging ground for Artemis lunar missions."
    ],
    missionsCount: 14,
    spacecraftCount: 28,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    educationalSummary: "Objects in orbit aren't free of gravity; they are traveling sideways so quickly (~28,000 km/h) that as they fall toward Earth, the planet curves away beneath them at the exact same rate."
  },
  {
    id: "dest-moon",
    slug: "moon",
    name: "The Moon",
    type: "Natural Satellite",
    tagline: "Earth's companion world and the stepping stone to Mars.",
    description: "The Moon is Earth's only natural satellite, orbiting at an average distance of 384,400 km. It holds key geological records of the early solar system and permanently shadowed craters at its poles containing billions of tons of water ice.",
    distanceFromEarth: "384,400 km (1.3 light-seconds)",
    orbitalPeriod: "27.3 Earth days",
    highlights: [
      "Target of the Artemis campaign to return humans to the lunar surface.",
      "South Pole craters contain volatile water ice usable for rocket propellant.",
      "Site of historic Apollo and robotic Chandrayaan, Chang'e, and SLIM landings."
    ],
    missionsCount: 8,
    spacecraftCount: 12,
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1000&q=80",
    educationalSummary: "The Moon is tidally locked to Earth, meaning it rotates on its axis at the same rate it revolves around Earth, always presenting the same face to our night sky."
  },
  {
    id: "dest-mars",
    slug: "mars",
    name: "Mars",
    type: "Terrestrial Planet",
    tagline: "The Red Planet: a frozen desert world of ancient riverbeds and volcanoes.",
    description: "Mars is the fourth planet from the Sun and the most explored planetary body in our solar system. Half the size of Earth, it features towering volcanoes like Olympus Mons and vast canyon systems like Valles Marineris.",
    distanceFromEarth: "54.6M to 401M km (3 to 22 light-minutes)",
    orbitalPeriod: "687 Earth days (1.88 years)",
    highlights: [
      "Home to active robotic explorers Perseverance and Curiosity.",
      "Geological evidence of ancient warm lakes, deltas, and organic compounds.",
      "Target for prospective crewed exploration missions in the 2030s."
    ],
    missionsCount: 9,
    spacecraftCount: 15,
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    educationalSummary: "A day on Mars is called a 'sol' and lasts 24 hours, 39 minutes, and 35 seconds—just slightly longer than an Earth day."
  },
  {
    id: "dest-jupiter",
    slug: "jupiter",
    name: "Jupiter & Its Moons",
    type: "Gas Giant System",
    tagline: "The king of planets: a miniature planetary system of ocean worlds.",
    description: "Jupiter is the largest planet in our solar system, with more mass than all other planets combined. Surrounded by 95 recognized moons, its four large Galilean satellites—Io, Europa, Ganymede, and Callisto—are destinations of intense scientific exploration.",
    distanceFromEarth: "588M to 968M km (33 to 53 light-minutes)",
    orbitalPeriod: "11.86 Earth years",
    highlights: [
      "Target of NASA's Europa Clipper and ESA's Juice missions.",
      "Europa's global saltwater ocean contains more water than all of Earth's oceans combined.",
      "Features the Great Red Spot, a storm larger than Earth raging for over 300 years."
    ],
    missionsCount: 4,
    spacecraftCount: 6,
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    educationalSummary: "Tidal friction from Jupiter's immense gravity flexes the interior of icy Europa and rocky Io, creating volcanic eruptions on Io and keeping Europa's subsurface ocean liquid."
  },
  {
    id: "dest-deep-space",
    slug: "deep-space",
    name: "Deep Space & Lagrange Points",
    type: "Cosmic Frontier",
    tagline: "The quiet cosmic vantage points and the interstellar beyond.",
    description: "Deep space includes gravitationally stable Lagrange points (such as Sun-Earth L2, home to JWST) as well as the outer reaches of the heliosphere and interstellar space traversed by the Voyager and New Horizons probes.",
    distanceFromEarth: "1.5M km (L2) to 24+ billion km (Interstellar)",
    orbitalPeriod: "Varies (1 year for L2; hyperbolic escape trajectories)",
    highlights: [
      "Sun-Earth L2 provides an unobstructed view of the cold cosmic dark.",
      "Voyager 1 and 2 are measuring pristine cosmic rays beyond solar influence.",
      "Lagrange points allow ultra-low fuel station-keeping for delicate telescopes."
    ],
    missionsCount: 6,
    spacecraftCount: 8,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    educationalSummary: "Lagrange points are positions in space where the gravitational pull of two large masses (like Sun and Earth) equals the centripetal force required for a small object to move with them."
  },
  {
    id: "dest-the-sun",
    slug: "the-sun",
    name: "The Sun",
    type: "Yellow Dwarf Star (G2V)",
    tagline: "The powerhouse of our solar system and anchor of life on Earth.",
    description: "The Sun accounts for 99.86% of the mass in the solar system. Nuclear fusion at its core transforms 600 million tons of hydrogen into helium every second, powering planetary climates and driving space weather.",
    distanceFromEarth: "149.6 million km (8.3 light-minutes / 1 AU)",
    orbitalPeriod: "Galactic orbit: 230 million years",
    highlights: [
      "Explored up close by NASA's Parker Solar Probe and ESA's Solar Orbiter.",
      "11-year solar magnetic cycle produces sunspots, flares, and coronal mass ejections.",
      "Solar wind creates auroras on Earth and shapes planetary magnetospheres."
    ],
    missionsCount: 3,
    spacecraftCount: 5,
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    educationalSummary: "Light created in the Sun's core takes over 100,000 years to bounce through its dense radiative zone before escaping into space and reaching Earth in just 8 minutes."
  }
];

// 5. SPACE EVENTS
const INITIAL_EVENTS = [
  {
    id: "evt-orionids-2026",
    slug: "orionid-meteor-shower-peak",
    title: "Orionid Meteor Shower Peak",
    eventType: "Meteor Shower",
    category: "Astronomical Observation",
    description: "Annual meteor shower caused by the debris field of Halley's Comet (1P/Halley). Produces fast meteors traveling at 66 km/s that frequently leave persistent glowing gas trails lasting several seconds.",
    startTime: "2026-10-21T21:00:00Z",
    endTime: "2026-10-22T05:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Visible globally from both hemispheres; optimal viewing from midnight until dawn under dark skies.",
    viewingGuidance: "Lie flat facing southeast toward Orion. Allow 25 minutes for dark adaptation. Expected rate is 20 meteors per hour in dark skies.",
    relatedMission: null,
    relatedOrganization: "International Meteor Organization",
    source: "IMO / American Meteor Society"
  },
  {
    id: "evt-leonids-2026",
    slug: "leonid-meteor-shower-peak",
    title: "Leonid Meteor Shower Peak",
    eventType: "Meteor Shower",
    category: "Astronomical Observation",
    description: "Famous for historical meteor storms, the Leonids originate from Comet Tempel-Tuttle. Known for bright fireballs with colorful trails and high entry velocities.",
    startTime: "2026-11-17T22:00:00Z",
    endTime: "2026-11-18T05:30:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Visible worldwide, best from Northern Hemisphere facing constellation Leo after midnight.",
    viewingGuidance: "Look for fast, white or greenish meteors. Peak rate of 15-20 meteors per hour with periodic bright fireballs.",
    relatedMission: null,
    relatedOrganization: "American Meteor Society",
    source: "IMO / NASA Meteoroid Environment Office"
  },
  {
    id: "evt-beaver-moon-2026",
    slug: "full-beaver-moon-and-lunar-opposition",
    title: "Full Beaver Moon & Lunar Opposition",
    eventType: "Lunar Phase",
    category: "Astronomical Observation",
    description: "The full moon of November, traditionally named the Beaver Moon by Algonquin tribes as beaver lodges were prepared for winter. The Moon will reach peak illumination directly opposite the Sun.",
    startTime: "2026-11-24T19:54:00Z",
    endTime: "2026-11-24T23:59:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Visible worldwide from dusk till dawn.",
    viewingGuidance: "Magnificent with naked eye or binoculars at moonrise. Use a moon filter on telescopes to reduce glare when observing lunar maria and ray craters.",
    relatedMission: null,
    relatedOrganization: "US Naval Observatory",
    source: "Astronomical Almanac"
  },
  {
    id: "evt-geminids-2026",
    slug: "geminid-meteor-shower-peak",
    title: "Geminid Meteor Shower Peak",
    eventType: "Meteor Shower",
    category: "Astronomical Observation",
    description: "The undisputed king of annual meteor showers. Originating from rocky asteroid 3200 Phaethon rather than a comet, producing up to 120 multicolored, slow-moving meteors per hour.",
    startTime: "2026-12-13T20:00:00Z",
    endTime: "2026-12-14T06:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Excellent visibility globally, especially Northern Hemisphere where Gemini is high overhead.",
    viewingGuidance: "Dress warmly and recline looking toward Gemini. Peak rates between 01:00 and 04:00 AM local time under moonless conditions.",
    relatedMission: null,
    relatedOrganization: "International Meteor Organization",
    source: "IMO / Royal Astronomical Society"
  },
  {
    id: "evt-december-solstice-2026",
    slug: "december-solstice-winter-summer",
    title: "December Solstice (Astronomical Marker)",
    eventType: "Planetary Marker",
    category: "Astronomical Observation",
    description: "The Sun reaches its southernmost declination in Earth's sky, marking the shortest day of the year in the Northern Hemisphere and the longest in the Southern Hemisphere.",
    startTime: "2026-12-21T21:50:00Z",
    endTime: "2026-12-21T23:59:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Global astronomical event.",
    viewingGuidance: "Observe midday shadow lengths—longest midday shadows in northern latitudes and directly overhead at the Tropic of Capricorn.",
    relatedMission: null,
    relatedOrganization: "International Astronomical Union",
    source: "US Naval Observatory Ephemerides"
  },
  {
    id: "evt-ursids-2026",
    slug: "ursid-meteor-shower-peak",
    title: "Ursid Meteor Shower Peak",
    eventType: "Meteor Shower",
    category: "Astronomical Observation",
    description: "A minor but reliable meteor shower radiating from Ursa Minor (the Little Dipper), produced by debris from Comet 8P/Tuttle.",
    startTime: "2026-12-22T22:00:00Z",
    endTime: "2026-12-23T04:30:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Exclusively visible from the Northern Hemisphere.",
    viewingGuidance: "Scan the skies around Polaris. Expect 5 to 10 meteors per hour with occasional sudden bursts.",
    relatedMission: null,
    relatedOrganization: "IMO",
    source: "International Meteor Organization"
  },
  {
    id: "evt-quadrantids-2027",
    slug: "quadrantid-meteor-shower-peak",
    title: "Quadrantid Meteor Shower Peak",
    eventType: "Meteor Shower",
    category: "Astronomical Observation",
    description: "One of the most intense meteor showers of the year with a very sharp peak window lasting only about 6 hours, producing up to 110 meteors per hour from asteroid 2003 EH1.",
    startTime: "2027-01-03T20:00:00Z",
    endTime: "2027-01-04T04:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Best seen in high northern latitudes between the Big Dipper handle and Bootes.",
    viewingGuidance: "Critical to watch during the exact 6-hour peak window for maximum rate of bright blue fireballs.",
    relatedMission: null,
    relatedOrganization: "IMO",
    source: "American Meteor Society"
  },
  {
    id: "evt-jupiter-opposition-2027",
    slug: "jupiter-at-opposition-2027",
    title: "Jupiter at Opposition & Closest Approach",
    eventType: "Planetary Conjunction",
    category: "Astronomical Observation",
    description: "The solar system's king of planets will be at its closest approach to Earth and its face fully illuminated by the Sun, shining at maximum brilliance in Gemini.",
    startTime: "2027-01-10T12:00:00Z",
    endTime: "2027-01-11T06:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Visible globally all night long as the brightest starlike point in the night sky.",
    viewingGuidance: "A medium pair of binoculars will easily reveal Jupiter's four Galilean moons (Io, Europa, Ganymede, Callisto). A 3-inch telescope reveals cloud bands and the Great Red Spot.",
    relatedMission: "mis-europa-clipper",
    relatedOrganization: "NASA JPL",
    source: "NASA Solar System Dynamics"
  },
  {
    id: "evt-mars-opposition-2027",
    slug: "mars-at-opposition-2027",
    title: "Mars at Opposition",
    eventType: "Planetary Conjunction",
    category: "Astronomical Observation",
    description: "Mars reaches opposition, appearing directly opposite the Sun in Earth's sky. Rising at sunset and shining at its brightest and closest for two years, revealing polar ice caps and dark volcanic maria in backyard telescopes.",
    startTime: "2027-02-19T18:00:00Z",
    endTime: "2027-02-20T06:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Visible all night globally in the constellation Leo.",
    viewingGuidance: "Use a small 4-inch telescope with 100x magnification to resolve the Martian northern polar cap and Syrtis Major plateau.",
    relatedMission: "mis-perseverance",
    relatedOrganization: "Sky & Telescope",
    source: "JPL Solar System Dynamics"
  },
  {
    id: "evt-lunar-eclipse-2027",
    slug: "total-lunar-eclipse-march-2027",
    title: "Total Lunar Eclipse (Blood Moon)",
    eventType: "Eclipse",
    category: "Astronomical Observation",
    description: "A total lunar eclipse where the Moon passes completely through Earth's umbral shadow, turning a deep coppery red due to Rayleigh scattering through Earth's atmosphere.",
    startTime: "2027-03-03T17:30:00Z",
    endTime: "2027-03-03T21:15:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Visible across Asia, Australia, the Pacific Ocean, and the Americas.",
    viewingGuidance: "Completely safe to view with the naked eye, binoculars, or telescopes. No filters required.",
    relatedMission: null,
    relatedOrganization: "NASA Eclipse Team",
    source: "NASA Eclipse Web Portal"
  },
  {
    id: "evt-perseid-shower-2026",
    slug: "perseid-meteor-shower-peak",
    title: "Perseid Meteor Shower Peak",
    eventType: "Meteor Shower",
    category: "Astronomical Observation",
    description: "One of the brightest and most dependable meteor showers of the year, produced by debris from Comet Swift-Tuttle. Observers in dark skies can witness 60 to 100 fast and bright meteors per hour with persistent ionization trains.",
    startTime: "2026-08-12T20:00:00Z",
    endTime: "2026-08-13T04:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Visible worldwide, best from Northern Hemisphere under dark skies with minimal moonlight.",
    viewingGuidance: "Lie back in a reclining lawn chair away from city streetlights. Give your eyes 25 minutes to dark-adapt. No telescope needed—naked eye gives the widest field of view.",
    relatedMission: null,
    relatedOrganization: "International Meteor Organization",
    source: "IMO / American Meteor Society"
  },
  {
    id: "evt-solar-eclipse-spain-2026",
    slug: "total-solar-eclipse-august-2026",
    title: "Total Solar Eclipse: Arctic, Greenland & Spain",
    eventType: "Eclipse",
    category: "Astronomical Observation",
    description: "A breathtaking total solar eclipse whose path of totality sweeps across northern Siberia, eastern Greenland, western Iceland, and northern Spain just before sunset, offering over 2 minutes of totality.",
    startTime: "2026-08-12T16:45:00Z",
    endTime: "2026-08-12T18:30:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Totality visible in northern Spain, Iceland, and Greenland. Deep partial eclipse across western Europe.",
    viewingGuidance: "Certified ISO 12312-2 solar eclipse glasses are strictly required during partial phases. Only during the brief moments of 100% totality is it safe to view the corona with the naked eye.",
    relatedMission: null,
    relatedOrganization: "NASA Sun-Earth Days / International Astronomical Union",
    source: "NASA Eclipse Web Portal"
  },
  {
    id: "evt-artemis-core-rollout-2026",
    slug: "artemis-sls-mobile-launcher-wet-dress-rehearsal",
    title: "Artemis Lunar Program: SLS Mobile Launcher Wet Dress Rehearsal",
    entityType: "mission",
    eventType: "Mission Milestone",
    category: "Mission Milestones",
    status: "scheduled",
    description: "Comprehensive cryogenic propellants loading test and full terminal countdown sequence practice for the Space Launch System rocket and Orion capsule at Launch Complex 39B.",
    startTime: "2026-10-28T16:00:00Z",
    endTime: "2026-10-28T22:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Launch Complex 39B, Kennedy Space Center, Florida",
    viewingGuidance: "NASA TV public broadcast covers the live cryogenic tanking operations and simulated T-0 countdown hold tests.",
    relatedMission: "mis-artemis-program",
    missionSlug: "artemis-program",
    missionName: "Artemis Lunar Program",
    relatedOrganization: "NASA Exploration Ground Systems",
    source: "NASA Kennedy Space Center Exploration Ground Systems",
    sourceId: "mis-artemis-program",
    detailEndpoint: "/api/v1/missions/artemis-program",
    detailUrl: "/missions/artemis-program"
  },
  {
    id: "evt-perseverance-rim-campaign-2026",
    slug: "perseverance-rover-jezero-rim-sampling",
    title: "Perseverance Rover: Jezero Crater Rim Core Sampling Campaign",
    entityType: "spacecraft",
    eventType: "Spacecraft Operations",
    category: "Spacecraft Operations",
    status: "in-progress",
    description: "Perseverance engages its robotic rotary-percussive coring drill to seal and cache intact samples of primordial crustal bedrock from the rim of Jezero Crater.",
    startTime: "2026-10-30T10:00:00Z",
    endTime: "2026-10-30T18:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Lookout Hill, Jezero Crater Western Rim, Mars",
    viewingGuidance: "Daily raw engineering imagery and telemetry downlink accessible via NASA Mars 2020 Mission Public Portal.",
    relatedSpacecraft: "sc-perseverance",
    spacecraftSlug: "perseverance-rover",
    spacecraftName: "Perseverance Mars Rover",
    relatedMission: "mis-perseverance",
    missionSlug: "mars-perseverance-rover",
    missionName: "Mars 2020 Perseverance Rover",
    relatedOrganization: "NASA JPL Mars Exploration Program",
    source: "NASA JPL Mars Exploration Directorate",
    sourceId: "sc-perseverance",
    detailEndpoint: "/api/v1/spacecraft/perseverance-rover",
    detailUrl: "/spacecraft/perseverance-rover"
  },
  {
    id: "evt-jwst-deep-survey-2026",
    slug: "jwst-cycle-5-ultra-deep-spectroscopy",
    title: "JWST Cycle 5 Ultra-Deep Infrared Spectroscopy Window",
    entityType: "spacecraft",
    eventType: "Spacecraft Operations",
    category: "Spacecraft Operations",
    status: "scheduled",
    description: "Near-Infrared Spectrograph (NIRSpec) multi-shutter array survey probing the chemical makeup and stellar populations of protogalaxies at z > 13.",
    startTime: "2026-11-05T08:00:00Z",
    endTime: "2026-11-05T20:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Sun-Earth L2 Lagrange Point (1.5 million km from Earth)",
    viewingGuidance: "Public observation schedules and processed pipeline data published by Mikulski Archive for Space Telescopes (MAST).",
    relatedSpacecraft: "sc-jwst",
    spacecraftSlug: "jwst-observatory",
    spacecraftName: "James Webb Space Telescope",
    relatedMission: "mis-jwst",
    missionSlug: "james-webb-space-telescope",
    missionName: "James Webb Space Telescope (JWST)",
    relatedOrganization: "NASA / ESA / CSA / STScI",
    source: "Space Telescope Science Institute (STScI)",
    sourceId: "sc-jwst",
    detailEndpoint: "/api/v1/spacecraft/jwst-observatory",
    detailUrl: "/spacecraft/jwst-observatory"
  },
  {
    id: "evt-iss-crew-eva-2026",
    slug: "iss-expedition-76-spacewalk-irosa",
    title: "ISS Expedition 76 Extravehicular Spacewalk (iROSA Installation)",
    entityType: "spacecraft",
    eventType: "Spacecraft Operations",
    category: "Spacecraft Operations",
    status: "scheduled",
    description: "Flight engineers exit the Quest airlock for a scheduled 6.5-hour spacewalk to prepare mounting brackets for upcoming Roll-Out Solar Arrays (iROSA).",
    startTime: "2026-11-12T12:30:00Z",
    endTime: "2026-11-12T19:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Low Earth Orbit (altitude: 418 km, inclination: 51.6°)",
    viewingGuidance: "Live coverage with helmet cameras and Mission Control audio commentary on NASA TV and official webcast feeds.",
    relatedSpacecraft: "sc-iss-station",
    spacecraftSlug: "international-space-station-hab",
    spacecraftName: "International Space Station",
    relatedMission: "mis-iss-orbit",
    missionSlug: "international-space-station",
    missionName: "International Space Station (ISS)",
    relatedOrganization: "NASA / Roscosmos / ESA / JAXA / CSA",
    source: "NASA Johnson Space Center / ISS Operations",
    sourceId: "sc-iss-station",
    streamUrl: "https://nasa.gov/nasatv",
    detailEndpoint: "/api/v1/spacecraft/international-space-station-hab",
    detailUrl: "/spacecraft/international-space-station-hab"
  },
  {
    id: "evt-europa-earth-flyby-2026",
    slug: "europa-clipper-earth-gravity-assist",
    title: "Europa Clipper Earth Gravity Assist Trajectory Flyby",
    entityType: "mission",
    eventType: "Mission Milestone",
    category: "Mission Milestones",
    status: "scheduled",
    description: "Europa Clipper executes a planned hyperbolic flyby of Earth at an altitude of 3,200 km, utilizing gravitational potential to gain orbital velocity toward Jupiter for its 2030 arrival.",
    startTime: "2026-12-01T14:30:00Z",
    endTime: "2026-12-01T18:00:00Z",
    timeZone: "UTC",
    locationOrVisibility: "Deep Space / Earth Gravity Assist Flyby (altitude: 3,200 km)",
    viewingGuidance: "Trajectory tracking and live telemetry updates streamed via NASA Eyes on the Solar System real-time simulator.",
    relatedMission: "mis-europa-clipper",
    missionSlug: "europa-clipper",
    missionName: "Europa Clipper",
    relatedSpacecraft: "sc-europa-clipper",
    spacecraftSlug: "europa-clipper-probe",
    spacecraftName: "Europa Clipper Spacecraft",
    relatedOrganization: "NASA JPL Europa Clipper Flight Operations",
    source: "NASA JPL Europa Clipper Flight Operations",
    sourceId: "mis-europa-clipper",
    detailEndpoint: "/api/v1/missions/europa-clipper",
    detailUrl: "/missions/europa-clipper"
  }
];

// 6. SPACE NEWS
const INITIAL_NEWS = [
  {
    id: "news-jwst-atmosphere",
    slug: "jwst-detects-carbon-dioxide-water-vapor-exoplanet",
    headline: "Webb Telescope Detects Atmospheric Chemical Cocktail on Temperate Sub-Neptune",
    summary: "High-resolution transmission spectroscopy from JWST reveals rich molecular signatures of water, methane, and carbon compounds in the atmosphere of exoplanet K2-18b.",
    body: "Astronomers utilizing the James Webb Space Telescope's Near-Infrared Spectrograph (NIRSpec) have uncovered detailed atmospheric composition data for sub-Neptune exoplanet K2-18b, located 120 light-years away in the constellation Leo. The observations reveal significant abundances of carbon-bearing molecules, including methane and carbon dioxide, alongside a distinct scarcity of ammonia. These findings support hypotheses that K2-18b may possess a hydrogen-rich atmosphere above a water-rich ocean interior, known as a Hycean world. Scientists emphasize that further observations will be required to confirm tentative traces of dimethyl sulfide (DMS).",
    category: "Scientific Discoveries",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    publisher: "STScI / NASA Science News",
    originalUrl: "https://webbtelescope.org/contents/news-releases",
    publicationDate: "2026-10-18T14:00:00Z",
    relatedMissions: ["mis-jwst"],
    sources: [{ name: "Space Telescope Science Institute", url: "https://webbtelescope.org" }]
  },
  {
    id: "news-europa-clipper-cruise",
    slug: "europa-clipper-deploys-radar-antennas-begins-cruise",
    headline: "Europa Clipper Successfully Deploys Giant Radar Antennas En Route to Jupiter",
    summary: "NASA flight engineers confirm the flawless motorized extension of Europa Clipper's 30-meter ice-penetrating radar booms as the probe prepares for its Mars flyby.",
    body: "Following its flawless October launch aboard a SpaceX Falcon Heavy, NASA's Europa Clipper has successfully commanded and verified the full extension of its REASON radar antenna booms. The radar system features cross-dipole antennas extending nearly 30 meters tip-to-tip. Once Clipper arrives at Jupiter in 2030, this instrument will beam radio waves deep through Europa's outer icy shell to map thermal convection plumes and search for the boundary of the moon's global liquid ocean.",
    category: "Mission Updates",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    publisher: "NASA Jet Propulsion Laboratory",
    originalUrl: "https://europa.nasa.gov/news",
    publicationDate: "2026-10-16T18:30:00Z",
    relatedMissions: ["mis-europa-clipper"],
    sources: [{ name: "NASA JPL News", url: "https://jpl.nasa.gov" }]
  },
  {
    id: "news-isro-chandrayaan4-sample-return",
    slug: "isro-unveils-chandrayaan-4-lunar-sample-return-architecture",
    headline: "ISRO Unveils Dual-Launch Architecture for Chandrayaan-4 Lunar Sample Return",
    summary: "Building on the success of Chandrayaan-3, India's space agency outlines a multi-module mission to collect and return soil samples from the lunar south pole.",
    body: "The Indian Space Research Organisation (ISRO) has detailed the mission profile for Chandrayaan-4, an ambitious initiative designed to collect pristine soil and rock samples from near the lunar south pole and safely return them to Earth. The mission will utilize two separate LVM3 heavy-lift launches: one delivering the Propulsion and Lander modules to the Moon, and a second launching the Ascender and Earth Re-entry Transfer module. The two segments will dock autonomously in lunar orbit before returning the sample capsule to a recovery site in India.",
    category: "Space Agencies",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1000&q=80",
    publisher: "ISRO Media Relations",
    originalUrl: "https://www.isro.gov.in",
    publicationDate: "2026-10-12T09:15:00Z",
    relatedMissions: ["mis-chandrayaan-3"],
    sources: [{ name: "ISRO Official Press", url: "https://www.isro.gov.in" }]
  },
  {
    id: "news-starship-booster-catch",
    slug: "spacex-prepares-second-booster-catch-starbase",
    headline: "SpaceX Upgrades Launch Mount and Chopstick Arms Ahead of Flight 7 Test",
    summary: "Engineers at Starbase reinforce mechanical dampeners and thermal shielding on the orbital launch tower following the historic mid-air catch of the Super Heavy booster.",
    body: "Following the historic first mid-air catch of a 71-meter Super Heavy rocket booster by mechanical 'chopstick' arms at Starbase, SpaceX ground teams have completed structural inspections and thermal upgrades on the launch mount. Flight 7 will test payload deployment doors in orbit and validate a second consecutive booster catch attempt, bringing rapid rocket reuse closer to operational reality.",
    category: "Rocket Launches",
    image: "https://images.unsplash.com/photo-1517976487502-5f69a0db7351?auto=format&fit=crop&w=1000&q=80",
    publisher: "SpaceX Flight Updates",
    originalUrl: "https://www.spacex.com",
    publicationDate: "2026-10-09T17:40:00Z",
    relatedMissions: [],
    sources: [{ name: "SpaceX Updates", url: "https://www.spacex.com" }]
  }
];

// 7. EDUCATIONAL ARTICLES (LEARN CENTER)
const INITIAL_ARTICLES = [
  {
    id: "edu-how-rockets-work",
    slug: "how-rocket-launches-work",
    title: "How Rocket Launches Work: From Ignition to Orbital Velocity",
    summary: "A beginner-friendly guide explaining how rockets overcome Earth's gravity, why they curve sideways, and how orbital velocity is reached.",
    category: "Rocketry & Propulsion",
    readingTime: "6 min read",
    publicationDate: "2026-09-01",
    author: "SpaceOps Educational Team",
    image: "https://images.unsplash.com/photo-1517976487502-5f69a0db7351?auto=format&fit=crop&w=1000&q=80",
    content: `
### What Is a Rocket?
A rocket is an engine that produces thrust by expelling mass rearward at high velocity, following **Newton's Third Law of Motion**: for every action, there is an equal and opposite reaction. Unlike jet aircraft, which draw oxygen from ambient air, space rockets must carry both their fuel (like kerosene or liquid methane) and their oxidizer (liquid oxygen).

### Why Do Rockets Go Up and Then Turn Sideways?
Many people imagine that reaching space simply means flying high enough above the atmosphere. While space officially starts at the **Kármán Line** (100 kilometers up), merely reaching that altitude will cause an object to fall straight back down.

To stay in space permanently without falling, a spacecraft must enter **orbit**. Entering orbit requires traveling horizontally at roughly **28,000 km/h (17,500 mph)**. At this immense speed, the spacecraft is in a state of continuous freefall: it falls toward Earth, but Earth's surface curves away beneath it at the exact same rate!

### The Stages of a Launch
1. **Liftoff & Max Q**: The first stage engines ignite, generating thrust that exceeds the rocket's massive weight. Roughly 60-90 seconds after liftoff, the rocket experiences *Max Q*—the point of maximum aerodynamic stress caused by high speed against dense lower air.
2. **Gravity Turn**: The rocket gently pitches over, trading vertical climb for horizontal acceleration.
3. **Stage Separation (MECO)**: Main Engine Cut-Off occurs once the booster burns through its propellant. The first stage separates, leaving the smaller, vacuum-optimized second stage to burn toward orbit.
4. **Orbital Insertion (SECO)**: The second stage shuts down when the desired orbital velocity is achieved.

### Key Glossary
- **Thrust**: The propulsive force produced by the rocket engines.
- **Delta-V (Δv)**: The measure of impulse needed to perform an orbital maneuver.
- **Payload**: The satellite, telescope, or crew capsule being carried into space.
    `,
    keyTakeaways: [
      "Orbit is not just about height—it is about horizontal speed (28,000 km/h).",
      "Rockets carry their own oxidizer because there is no air in space.",
      "Staging allows rockets to discard dead empty tank weight as they climb."
    ],
    relatedMissions: ["mis-artemis-program"],
    references: [
      "NASA Glenn Research Center Rocket Propulsion Fundamentals",
      "European Space Agency How Rockets Work Guide"
    ]
  },
  {
    id: "edu-how-spacecraft-reach-planets",
    slug: "how-spacecraft-navigate-to-other-planets",
    title: "How Spacecraft Reach Other Planets: Orbital Mechanics & Gravity Assists",
    summary: "Understand Hohmann transfer orbits, launch windows, and how planetary probes 'steal' momentum from planets to cross millions of kilometers.",
    category: "Orbital Mechanics",
    readingTime: "8 min read",
    publicationDate: "2026-09-10",
    author: "SpaceOps Educational Team",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    content: `
### You Cannot Fly in a Straight Line in Space
In science fiction movies, spaceships point their noses toward Mars and step on the gas. In reality, every spacecraft in the solar system is trapped in the Sun's immense gravitational well. Traveling to another planet requires altering your elliptical orbit around the Sun.

### The Hohmann Transfer Orbit
The most fuel-efficient way to travel from Earth to another planet is a **Hohmann Transfer Orbit**, discovered by German engineer Walter Hohmann in 1925:
- Earth orbits the Sun at 150 million kilometers.
- Mars orbits the Sun at 228 million kilometers.
- To reach Mars, a spacecraft fires its engines to accelerate slightly, stretching its circular orbit into an ellipse whose furthest point (aphelion) just intersects Mars's path.

Because Earth and Mars travel at different speeds around the Sun, they only align properly once every **26 months**. This alignment is called a **Launch Window**.

### The Cosmic Slingshot: Gravity Assists
How can a probe like *Europa Clipper* or *Voyager 1* reach Jupiter without carrying an impossibly heavy fuel tank?

By using **Gravity Assists** (planetary flybys):
When a spacecraft flies close behind a moving planet, the planet's gravity pulls on the spacecraft, pulling it along in its orbital path. The spacecraft gains a significant boost in speed relative to the Sun, while slowing down the planet by an unnoticeable, sub-atomic fraction.

### Key Glossary
- **Perihelion**: The closest point to the Sun in an orbit.
- **Aphelion**: The furthest point from the Sun in an orbit.
- **Escape Velocity**: The speed needed to break free from a gravitational body (11.2 km/s from Earth).
    `,
    keyTakeaways: [
      "Spacecraft travel along curved elliptical paths, not straight lines.",
      "Launch windows to Mars open only once every 26 months.",
      "Gravity assists allow probes to gain immense speed without using rocket propellant."
    ],
    relatedMissions: ["mis-europa-clipper", "mis-voyager-1"],
    references: [
      "NASA JPL Basics of Space Flight",
      "Bate, Mueller, White - Fundamentals of Astrodynamics"
    ]
  },
  {
    id: "edu-why-mars-matters",
    slug: "why-mars-exploration-matters",
    title: "Why Mars Matters: The Search for Ancient Biosignatures",
    summary: "Discover why Mars is the premier target in the search for extraterrestrial life, and how rovers read the history written in red rocks.",
    category: "Planetary Science",
    readingTime: "5 min read",
    publicationDate: "2026-09-20",
    author: "SpaceOps Educational Team",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
    content: `
### A Twin That Froze in Time
Four billion years ago, Earth and Mars looked remarkably similar. Both were warm, wet rocky worlds with thick carbon dioxide atmospheres, active magnetic shields, and liquid water flowing across their surfaces.

While Earth's active plate tectonics recycled and destroyed our planet's earliest rocks, Mars lost its magnetic field and dried up, freezing its ancient geological record in place. Studying Mars is like stepping into a time machine to see what the young solar system was like.

### What Is a Biosignature?
A **biosignature** is any substance—such as an element, isotope, molecule, or microscopic texture—that provides scientific evidence of past or present life.
Rovers like *Perseverance* search for:
1. **Stromal Texture**: Layered mineral structures created by ancient microbial mats.
2. **Organic Carbon Molecules**: Complex carbon rings and chains formed by biological processes.
3. **Specific Isotope Ratios**: Biological organisms prefer lighter isotopes of carbon (Carbon-12), leaving a distinct chemical fingerprint in sedimentary rocks.
    `,
    keyTakeaways: [
      "Ancient Mars had liquid lakes, deltas, and a protective magnetic field.",
      "Mars preserves ancient rocks that plate tectonics destroyed on Earth.",
      "Perseverance is caching samples so Earth laboratories can perform sensitive tests."
    ],
    relatedMissions: ["mis-perseverance"],
    references: [
      "NASA Mars Exploration Program",
      "Mars Science Laboratory Science Papers"
    ]
  },
  {
    id: "edu-how-space-telescopes-work",
    slug: "how-space-telescopes-observe-the-universe",
    title: "How Space Telescopes Work: Infrared Eyes on the Early Universe",
    summary: "Explore why we put telescopes in space, how infrared mirrors see through dust, and how light from billions of years ago reaches our detectors.",
    category: "Astrophysics & Telescopes",
    readingTime: "7 min read",
    publicationDate: "2026-10-05",
    author: "SpaceOps Educational Team",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    content: `
### Why Put Telescopes in Space?
Earth's atmosphere is a protective blanket for life, but a frustrating barrier for astronomers. The atmosphere absorbs ultraviolet, X-ray, and infrared light, and atmospheric turbulence blurs optical images (which is why stars appear to twinkle). Putting a telescope above the atmosphere provides pristine, unblurred views of the cosmos across the entire electromagnetic spectrum.

### Why Does JWST Look in the Infrared?
As light travels across billions of light-years of expanding space, the light waves stretch out. A visible or ultraviolet ray emitted by an ancient galaxy 13 billion years ago has been stretched by cosmic expansion into **infrared light**. This phenomenon is called **cosmological redshift**.

Additionally, infrared light easily penetrates the thick clouds of cosmic gas and dust that obscure newly forming stars and planetary systems.
    `,
    keyTakeaways: [
      "Space telescopes avoid atmospheric distortion and light absorption.",
      "Cosmic expansion stretches ancient visible light into infrared wavelengths.",
      "Cryogenic cooling is required so the telescope's own heat does not blind its sensors."
    ],
    relatedMissions: ["mis-jwst"],
    references: [
      "Space Telescope Science Institute (STScI) Educational Portal"
    ]
  }
];

// 8. ORGANIZATIONS
const INITIAL_ORGANIZATIONS = [
  {
    id: "org-nasa",
    slug: "nasa",
    name: "National Aeronautics and Space Administration (NASA)",
    shortName: "NASA",
    type: "National Space Agency",
    country: "United States",
    foundedYear: 1958,
    website: "https://www.nasa.gov",
    description: "The United States government agency responsible for the civil space program, aeronautics research, and space exploration, leading programs including Apollo, Space Shuttle, Artemis, and Mars Exploration."
  },
  {
    id: "org-esa",
    slug: "esa",
    name: "European Space Agency (ESA)",
    shortName: "ESA",
    type: "Intergovernmental Space Agency",
    country: "European Union / 22 Member States",
    foundedYear: 1975,
    website: "https://www.esa.int",
    description: "An intergovernmental organization of 22 member states dedicated to the exploration of space, earth observation, launcher development (Ariane), and planetary missions like Juice and BepiColombo."
  },
  {
    id: "org-isro",
    slug: "isro",
    name: "Indian Space Research Organisation (ISRO)",
    shortName: "ISRO",
    type: "National Space Agency",
    country: "India",
    foundedYear: 1969,
    website: "https://www.isro.gov.in",
    description: "India's premier space agency renowned for cost-effective deep-space exploration, including the Chandrayaan lunar missions, Mangalyaan Mars Orbiter, and Gaganyaan human spaceflight."
  },
  {
    id: "org-spacex",
    slug: "spacex",
    name: "Space Exploration Technologies Corp. (SpaceX)",
    shortName: "SpaceX",
    type: "Commercial Aerospace Manufacturer",
    country: "United States",
    foundedYear: 2002,
    website: "https://www.spacex.com",
    description: "Commercial aerospace company pioneering reusable orbital rockets (Falcon 9, Falcon Heavy) and the fully reusable Starship super heavy-lift transportation system."
  },
  {
    id: "org-jaxa",
    slug: "jaxa",
    name: "Japan Aerospace Exploration Agency (JAXA)",
    shortName: "JAXA",
    type: "National Space Agency",
    country: "Japan",
    foundedYear: 2003,
    website: "https://global.jaxa.jp",
    description: "Japan's national agency leading sample return missions from asteroids (Hayabusa and Hayabusa2), precision lunar landings (SLIM), and contributions to the ISS Kibo module."
  }
];

// 9. DATA SOURCES
const INITIAL_DATA_SOURCES = [
  {
    id: "src-nasa-open",
    name: "NASA Open Data & APOD APIs",
    providerType: "Space Agency API",
    description: "Official public endpoints providing Astronomy Picture of the Day, planetary missions metadata, and Mars rover photo feeds.",
    website: "https://api.nasa.gov",
    status: "healthy",
    lastSync: new Date().toISOString(),
    isVerified: true
  },
  {
    id: "src-launch-library",
    name: "Launch Library 2 (The Space Devs)",
    providerType: "Public Launch Tracker API",
    description: "Crowdsourced and agency-verified repository tracking upcoming orbital rocket launches, pads, and webcast schedules worldwide.",
    website: "https://thespacedevs.com",
    status: "healthy",
    lastSync: new Date().toISOString(),
    isVerified: true
  },
  {
    id: "src-jpl-horizons",
    name: "NASA JPL Horizons & Solar System Dynamics",
    providerType: "Ephemeris & Orbital Mechanics API",
    description: "Precise orbital state vectors, planetary positions, lunar eclipse geometries, and asteroid close-approach predictions.",
    website: "https://ssd.jpl.nasa.gov",
    status: "healthy",
    lastSync: new Date().toISOString(),
    isVerified: true
  },
  {
    id: "src-curated-editorial",
    name: "SpaceOps Curated Editorial & Educational Engine",
    providerType: "Internal Editorial Engine",
    description: "Peer-reviewed space science articles, mission milestone chronologies, and glossary explanations for students and public visitors.",
    website: "https://spaceops.org",
    status: "active",
    lastSync: new Date().toISOString(),
    isVerified: true
  }
];

class SpaceOpsRepository {
  constructor() {
    this.missions = [...INITIAL_MISSIONS];
    this.launches = [...INITIAL_LAUNCHES];
    this.spacecraft = [...INITIAL_SPACECRAFT];
    this.destinations = [...INITIAL_DESTINATIONS];
    this.events = [...INITIAL_EVENTS];
    this.news = [...INITIAL_NEWS];
    this.articles = [...INITIAL_ARTICLES];
    this.organizations = [...INITIAL_ORGANIZATIONS];
    this.dataSources = [...INITIAL_DATA_SOURCES];
    this.bookmarks = []; // { userId, itemId, itemType, addedAt }
  }

  // --- MISSIONS ---
  getMissions(filters = {}) {
    let result = [...this.missions];
    if (filters.status) {
      result = result.filter(m => m.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.category) {
      result = result.filter(m => m.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.destination) {
      result = result.filter(m => m.destinationSlug === filters.destination || m.destination.toLowerCase().includes(filters.destination.toLowerCase()));
    }
    if (filters.organization) {
      result = result.filter(m => m.organization.toLowerCase().includes(filters.organization.toLowerCase()));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getMissionBySlugOrId(identifier) {
    return this.missions.find(m => m.slug === identifier || m.id === identifier) || null;
  }

  // --- LAUNCHES ---
  getLaunches(filters = {}) {
    let result = [...this.launches];
    if (filters.status) {
      result = result.filter(l => l.launchStatus.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.type === 'upcoming') {
      result = result.filter(l => l.launchStatus !== 'success' && l.launchStatus !== 'failed');
    } else if (filters.type === 'past') {
      result = result.filter(l => l.launchStatus === 'success' || l.launchStatus === 'failed');
    }
    if (filters.provider) {
      result = result.filter(l => l.launchProvider.toLowerCase().includes(filters.provider.toLowerCase()));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.rocket.toLowerCase().includes(q) ||
        l.launchProvider.toLowerCase().includes(q)
      );
    }
    // Sort upcoming launches by date ascending
    result.sort((a, b) => new Date(a.plannedLaunchDate) - new Date(b.plannedLaunchDate));
    return result;
  }

  getLaunchBySlugOrId(identifier) {
    return this.launches.find(l => l.slug === identifier || l.id === identifier) || null;
  }

  // --- SPACECRAFT ---
  getSpacecraft(filters = {}) {
    let result = [...this.spacecraft];
    if (filters.category || filters.type) {
      const cat = (filters.category || filters.type).toLowerCase();
      result = result.filter(s => s.category.toLowerCase().includes(cat) || s.type.toLowerCase().includes(cat));
    }
    if (filters.destination) {
      result = result.filter(s => s.destinationSlug === filters.destination || s.destination.toLowerCase().includes(filters.destination.toLowerCase()));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getSpacecraftBySlugOrId(identifier) {
    return this.spacecraft.find(s => s.slug === identifier || s.id === identifier) || null;
  }

  // --- DESTINATIONS ---
  getDestinations() {
    return [...this.destinations];
  }

  getDestinationBySlugOrId(identifier) {
    return this.destinations.find(d => d.slug === identifier || d.id === identifier) || null;
  }

  // --- EVENTS ---
  getEvents(filters = {}) {
    let result = [...this.events];
    if (filters.eventType || filters.type) {
      const t = (filters.eventType || filters.type).toLowerCase();
      result = result.filter(e => e.eventType.toLowerCase().includes(t) || e.category.toLowerCase().includes(t));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }
    // Sort by start date ascending
    result.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    return result;
  }

  getEventBySlugOrId(identifier) {
    return this.events.find(e => e.slug === identifier || e.id === identifier) || null;
  }

  // --- NEWS ---
  getNews(filters = {}) {
    let result = [...this.news];
    if (filters.category) {
      result = result.filter(n => n.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(n =>
        n.headline.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q)
      );
    }
    // Sort latest first
    result.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
    return result;
  }

  getNewsBySlugOrId(identifier) {
    return this.news.find(n => n.slug === identifier || n.id === identifier) || null;
  }

  // --- LEARN ARTICLES ---
  getArticles(filters = {}) {
    let result = [...this.articles];
    if (filters.category) {
      result = result.filter(a => a.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getArticleBySlugOrId(identifier) {
    return this.articles.find(a => a.slug === identifier || a.id === identifier) || null;
  }

  // --- ORGANIZATIONS ---
  getOrganizations() {
    return [...this.organizations];
  }

  // --- DATA SOURCES ---
  getDataSources() {
    return [...this.dataSources];
  }

  // --- GLOBAL SEARCH ---
  globalSearch(query) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return {
        query: '',
        totalResults: 0,
        results: {
          missions: [],
          launches: [],
          spacecraft: [],
          destinations: [],
          events: [],
          news: [],
          learn: []
        }
      };
    }

    const q = query.trim().toLowerCase();

    const matchedMissions = this.missions.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.destination.toLowerCase().includes(q)
    ).map(m => ({
      id: m.id,
      title: m.name,
      slug: m.slug,
      type: 'Mission',
      url: `/missions/${m.slug}`,
      summary: m.summary,
      badge: m.status
    }));

    const matchedLaunches = this.launches.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.rocket.toLowerCase().includes(q) ||
      l.launchProvider.toLowerCase().includes(q) ||
      l.payload.toLowerCase().includes(q)
    ).map(l => ({
      id: l.id,
      title: l.name,
      slug: l.slug,
      type: 'Launch',
      url: `/launches/${l.slug}`,
      summary: `${l.rocket} • ${l.launchProvider} (${l.launchSite})`,
      badge: l.launchStatus
    }));

    const matchedSpacecraft = this.spacecraft.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q) ||
      s.organization.toLowerCase().includes(q)
    ).map(s => ({
      id: s.id,
      title: s.name,
      slug: s.slug,
      type: 'Spacecraft',
      url: `/spacecraft/${s.slug}`,
      summary: `${s.type} • ${s.destination} (${s.organization})`,
      badge: s.status
    }));

    const matchedDestinations = this.destinations.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
    ).map(d => ({
      id: d.id,
      title: d.name,
      slug: d.slug,
      type: 'Destination',
      url: `/destinations/${d.slug}`,
      summary: d.tagline,
      badge: d.type
    }));

    const matchedEvents = this.events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.eventType.toLowerCase().includes(q)
    ).map(e => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      type: 'Space Event',
      url: `/events/${e.slug}`,
      summary: e.description,
      badge: e.eventType
    }));

    const matchedNews = this.news.filter(n =>
      n.headline.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    ).map(n => ({
      id: n.id,
      title: n.headline,
      slug: n.slug,
      type: 'News',
      url: `/news/${n.slug}`,
      summary: n.summary,
      badge: n.category
    }));

    const matchedLearn = this.articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    ).map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      type: 'Educational Guide',
      url: `/learn/${a.slug}`,
      summary: a.summary,
      badge: a.readingTime
    }));

    const totalResults =
      matchedMissions.length +
      matchedLaunches.length +
      matchedSpacecraft.length +
      matchedDestinations.length +
      matchedEvents.length +
      matchedNews.length +
      matchedLearn.length;

    return {
      query,
      totalResults,
      results: {
        missions: matchedMissions,
        launches: matchedLaunches,
        spacecraft: matchedSpacecraft,
        destinations: matchedDestinations,
        events: matchedEvents,
        news: matchedNews,
        learn: matchedLearn
      }
    };
  }

  // --- HOME PAGE AGGREGATE FEED ---
  getHomeFeed() {
    return {
      hero: {
        headline: "Humanity's Journey Into Space, All in One Place.",
        supportingText: "Explore active missions, follow upcoming rocket launches, discover spacecraft, and stay connected with humanity's exploration of the universe.",
        primaryCta: { label: "Explore Space Missions", url: "/missions" },
        secondaryCta: { label: "Upcoming Launches", url: "/launches" }
      },
      upcomingLaunches: this.getLaunches({ type: 'upcoming' }).slice(0, 4),
      activeMissions: this.getMissions({ status: 'active' }).slice(0, 4),
      featuredMission: this.getMissionBySlugOrId('europa-clipper'),
      destinations: this.destinations.slice(0, 6),
      upcomingEvents: this.getEvents()
        .filter((e) => new Date(e.endTime || e.startTime) >= new Date('2026-10-01T00:00:00Z'))
        .slice(0, 4),
      latestNews: this.getNews().slice(0, 3),
      educationalArticles: this.articles.slice(0, 3),
      organizations: this.organizations.slice(0, 5),
      sourcesSummary: {
        totalVerifiedSources: this.dataSources.length,
        status: "Active Public Sync"
      }
    };
  }

  // --- PUBLIC DASHBOARD FEED ---
  getDashboardFeed() {
    const upcomingLaunches = this.getLaunches({ type: 'upcoming' });
    const activeMissions = this.getMissions({ status: 'active' });
    const recentNews = this.getNews();
    const currentDateRef = new Date('2026-10-01T00:00:00Z');
    const upcomingEvents = this.getEvents().filter(
      (e) => new Date(e.endTime || e.startTime) >= currentDateRef
    );

    return {
      summary: {
        upcomingLaunchesCount: upcomingLaunches.length,
        activeMissionsCount: activeMissions.length,
        recentUpdatesCount: recentNews.length,
        upcomingEventsCount: upcomingEvents.length
      },
      upcomingLaunches: upcomingLaunches.slice(0, 5),
      activeMissions: activeMissions.slice(0, 6),
      recentUpdates: recentNews.slice(0, 5),
      upcomingEvents: upcomingEvents.slice(0, 5),
      destinationsQuickLinks: this.destinations.slice(0, 4),
      recentlyAdded: [
        { type: "Mission", title: "Europa Clipper", slug: "europa-clipper", url: "/missions/europa-clipper" },
        { type: "Spacecraft", title: "James Webb Space Telescope", slug: "jwst-observatory", url: "/spacecraft/jwst-observatory" },
        { type: "Guide", title: "How Rocket Launches Work", slug: "how-rocket-launches-work", url: "/learn/how-rocket-launches-work" },
        { type: "Event", title: "Perseid Meteor Shower Peak", slug: "perseid-meteor-shower-peak", url: "/events/perseid-meteor-shower-peak" }
      ]
    };
  }

  // --- SATELLITES / 3D ORBITAL ASSETS (EDUCATIONAL VISUALIZATION) ---
  // Reused cleanly for public educational 3D globe tracker
  getSatellites() {
    return [
      {
        id: "sat-iss-alpha",
        name: "International Space Station",
        noradId: 25544,
        designator: "1998-067A",
        type: "Space Station",
        status: "operational",
        orbitType: "Low Earth Orbit (LEO)",
        altitudeKm: 418.5,
        velocityKmS: 7.66,
        inclinationDeg: 51.64,
        periodMinutes: 92.9,
        tle: {
          line1: "1 25544U 98067A   26295.51239841  .00014285  00000+0  26084-3 0  9993",
          line2: "2 25544  51.6421 124.5120 0006241  85.3210 274.8190 15.49812401421092"
        },
        coordinates: { lat: 28.5383, lon: -80.6792, alt: 418.5 }
      },
      {
        id: "sat-hubble-st",
        name: "Hubble Space Telescope",
        noradId: 20580,
        designator: "1990-037B",
        type: "Space Telescope",
        status: "operational",
        orbitType: "Low Earth Orbit (LEO)",
        altitudeKm: 535.4,
        velocityKmS: 7.59,
        inclinationDeg: 28.47,
        periodMinutes: 95.3,
        tle: {
          line1: "1 20580U 90037B   26295.21049214  .00000512  00000+0  34190-4 0  9990",
          line2: "2 20580  28.4710 341.2190 0002890 290.1020  69.8910 15.09102910941092"
        },
        coordinates: { lat: -15.7801, lon: -47.9292, alt: 535.4 }
      },
      {
        id: "sat-sentinel-6a",
        name: "Sentinel-6 Michael Freilich",
        noradId: 46984,
        designator: "2020-086A",
        type: "Earth Observation",
        status: "operational",
        orbitType: "Polar SSO",
        altitudeKm: 1336.2,
        velocityKmS: 7.21,
        inclinationDeg: 66.04,
        periodMinutes: 112.4,
        tle: {
          line1: "1 46984U 20086A   26295.40192841  .00000214  00000+0  14582-4 0  9991",
          line2: "2 46984  66.0410 210.8124 0008120  45.1920 314.9210 12.80912401290123"
        },
        coordinates: { lat: -42.8214, lon: 147.3272, alt: 1336.2 }
      }
    ];
  }

  // --- BOOKMARKS ---
  getUserBookmarks(userId = 'guest') {
    return this.bookmarks.filter(b => b.userId === userId);
  }

  addBookmark(userId = 'guest', item) {
    const existing = this.bookmarks.find(b => b.userId === userId && b.itemId === item.id);
    if (!existing) {
      const record = {
        id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        itemId: item.id,
        itemType: item.itemType || 'item',
        title: item.title || item.name,
        slug: item.slug,
        url: item.url,
        summary: item.summary,
        addedAt: new Date().toISOString()
      };
      this.bookmarks.push(record);
      return record;
    }
    return existing;
  }

  removeBookmark(userId = 'guest', itemId) {
    const initialLen = this.bookmarks.length;
    this.bookmarks = this.bookmarks.filter(b => !(b.userId === userId && (b.itemId === itemId || b.id === itemId)));
    return this.bookmarks.length < initialLen;
  }
}

export const spaceopsRepo = new SpaceOpsRepository();
