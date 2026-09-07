# Diagram assets notes

- Structure: one folder per work under `assets/<work>/`, each holding that work's
  real diagram images **plus** a `SOURCES.txt` giving provenance/attribution.
- Generic time-travel/paradox concept diagrams (billiard-ball paradoxes, Primer
  method, Star Trek timelines) live in `assets/concepts/`.
- Storage: images are ordinary committed blobs. **No Git LFS.**
- Size cap: no image exceeds GitHub's 50 MB recommended limit (full-res Dark
  `dark-v3.png` ~30 MB; the 68 MB `dark-v5` was downscaled to 4095×2792).

## Browsing the assets

Open `assets/<work>/` and you will see the diagrams themselves, not a link-list.
Each `SOURCES.txt` records the source URL / author / license for that work's
diagrams. See [`DIAGRAM-CLASSIFICATION.md`](DIAGRAM-CLASSIFICATION.md) for the
per-file class (genuine chart vs. removed still), and
[`MASTER-DIAGRAM-INDEX.md`](MASTER-DIAGRAM-INDEX.md) for the full URL map.
