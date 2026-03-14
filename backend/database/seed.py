"""
Seed data for 12 AeroMesh-equipped Baku city buses.
Called on first application startup to populate the in-memory fleet state.
"""

SEED_BUSES = [
    {"id": 7,  "name": "Bus #07", "route": "Neftçilər → Airport",   "filter_pct": 87, "upstream_nox": 162, "downstream_nox": 29, "status": "warning",  "lat": 40.409, "lng": 49.867},
    {"id": 3,  "name": "Bus #03", "route": "İçərişəhər Circular",   "filter_pct": 45, "upstream_nox": 98,  "downstream_nox": 18, "status": "active",   "lat": 40.366, "lng": 49.836},
    {"id": 11, "name": "Bus #11", "route": "Narimanov → Port",      "filter_pct": 3,  "upstream_nox": 22,  "downstream_nox": 4,  "status": "regen",    "lat": 40.388, "lng": 49.852},
    {"id": 42, "name": "Bus #42", "route": "Heydar Aliyev Ave",     "filter_pct": 91, "upstream_nox": 178, "downstream_nox": 32, "status": "critical", "lat": 40.397, "lng": 49.870},
    {"id": 5,  "name": "Bus #05", "route": "Sabunçu → Central",     "filter_pct": 55, "upstream_nox": 130, "downstream_nox": 23, "status": "active",   "lat": 40.421, "lng": 49.893},
    {"id": 17, "name": "Bus #17", "route": "Sahil Circular",        "filter_pct": 30, "upstream_nox": 88,  "downstream_nox": 16, "status": "active",   "lat": 40.371, "lng": 49.851},
    {"id": 28, "name": "Bus #28", "route": "Binəqədi → Downtown",   "filter_pct": 72, "upstream_nox": 145, "downstream_nox": 26, "status": "warning",  "lat": 40.435, "lng": 49.802},
    {"id": 9,  "name": "Bus #09", "route": "28 May → Gənclik",      "filter_pct": 48, "upstream_nox": 110, "downstream_nox": 20, "status": "active",   "lat": 40.409, "lng": 49.860},
    {"id": 33, "name": "Bus #33", "route": "Airport Express",       "filter_pct": 20, "upstream_nox": 65,  "downstream_nox": 12, "status": "active",   "lat": 40.455, "lng": 50.047},
    {"id": 14, "name": "Bus #14", "route": "Nizami → Narimanov",    "filter_pct": 65, "upstream_nox": 135, "downstream_nox": 24, "status": "active",   "lat": 40.378, "lng": 49.842},
    {"id": 56, "name": "Bus #56", "route": "Əhmədli → Port",        "filter_pct": 40, "upstream_nox": 95,  "downstream_nox": 17, "status": "active",   "lat": 40.352, "lng": 49.895},
    {"id": 61, "name": "Bus #61", "route": "Zabrat Industrial",     "filter_pct": 94, "upstream_nox": 188, "downstream_nox": 34, "status": "critical", "lat": 40.467, "lng": 49.952},
]
