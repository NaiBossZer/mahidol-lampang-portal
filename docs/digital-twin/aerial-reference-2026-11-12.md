# Mahidol Lampang Digital Twin — Aerial Reference

## Reference source
- User-provided oblique aerial photograph, received 2026-11-12.
- Intended use: visual reference for the existing campus/site GLB; it is not a surveyed base map.
- The original GLB source remains unchanged:
  https://huggingface.co/BossLampang/site-map-3d-MU-Lampang/resolve/main/site-map-3d.glb

## Visible spatial cues (image-relative)
The following labels describe approximate image positions only; they are not geographic coordinates.

| Reference ID | Approximate image position | Visible feature | Modeling guidance |
| --- | --- | --- | --- |
| A-01 | Left edge, running diagonally from lower-left toward upper-middle | Main public road | Preserve as the primary external road corridor; verify width and junctions from a site plan. |
| A-02 | Lower-middle to center | Internal access road and junction | Treat as the internal circulation spine; verify exact alignment and connections. |
| A-03 | Center-left | Cultivated/open agricultural plots | Represent as green/agricultural land cover, not as building footprints. |
| A-04 | Center-right | Two adjacent arched greenhouse structures | Candidate greenhouse assets; confirm dimensions and function before assigning IDs. |
| A-05 | Right-center and lower-right | Low-rise buildings among dense tree cover | Candidate building cluster; individual footprints and names are not confirmed by this image. |
| A-06 | Upper-middle | Distant village/building cluster | Context outside the core facility; do not model as campus buildings without boundary confirmation. |
| A-07 | Upper-right and far background | Watercourse/pond-like feature, forest and mountain ridge | Contextual terrain and landscape cues; water boundary and elevation require authoritative data. |
| A-08 | Across the site | Mature trees, orchard-like planting and vegetation | Use as land-cover reference; tree species and exact locations are unknown. |

## Confidence and limitations
- The photograph is an oblique aerial view. Perspective distortion prevents reliable measurement of distances, building footprints, road widths, elevations, or coordinates.
- The visible features above are visual observations, not verified building identities.
- Do not move, add, or delete GLB geometry based only on this photograph.
- Before geometry edits, obtain at least one georeferenced orthophoto or surveyed site plan with a known coordinate reference system, plus building footprints or CAD/BIM where available.
- Preserve the existing GLB and use a separate, versioned overlay or replacement asset for proposed geometry until reviewed.

## Next mapping workflow
1. Run the in-browser GLB metadata audit on the 3D campus page.
2. Export the JSON report and identify candidate scene/node/mesh names.
3. Compare the report with a verified site plan and assign stable facility IDs.
4. Build a mapping table: facility ID ↔ GLB node/mesh ↔ surveyed footprint/coordinates ↔ facility metadata.
5. Only then implement selectable buildings, labels, floors/rooms, and live system overlays.
