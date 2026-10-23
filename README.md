# Abdulrhman Hany: portfolio

A dark, scroll-driven, single-page portfolio. It's built with Next.js (App Router), TypeScript and Tailwind CSS, uses GSAP (ScrollTrigger and SplitText) with Lenis smooth scrolling, and has a React Three Fiber particle hero with bloom. It exports to plain static files, so it can be hosted anywhere.

## Run it locally

You need Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3010
npm run build      # static export to ./out
```

## Edit content

Every piece of text, every link and every image path is in **`src/content.ts`**:

- **Projects:** `work.projects` (the cards) and `work.more` (the smaller links under them).
- **Featured story:** `featured.steps`. Each step pairs a caption with a screenshot.
- **Skills:** `skills.groups`.
- **About, stats and certifications:** `about`.
- **Hero name:** `hero.particleLines`. Each string becomes one row of particles.
- **Images:** they live in `public/images/`. See **ASSETS-TODO.md** for which ones are still placeholders.
- **CV:** replace `public/cv.pdf`. The download name is `site.cvFileName`.
- **Accent color:** set `--accent` and `--accent-link` in `src/app/globals.css`.

## Host it

Two ready-made setups are included:

- **Vercel:** push the folder to a GitHub repo, then in Vercel choose **Add New → Project** and import it. `vercel.json` already sets it up as Next.js.
- **Netlify:** push to GitHub, then choose **Add new site → Import an existing project**. `netlify.toml` sets the build to `npm run build` and the publish folder to `out`.

Any static host also works: run `npm run build` and upload the `out/` folder.

After hosting, put the real address in `site.url` in `src/content.ts`. Link previews use it.

## Where the motion lives

Each animation has its own hook in `src/hooks/`:

| Hook | What it does |
|---|---|
| `useParticleHero` | Forms the particle name, pushes particles away from the cursor, and breaks the name apart on scroll |
| `usePinnedStory` | Pins the featured story and scrubs through its steps |
| `useSplitReveal` | Reveals headlines line by line |
| `useCountUp` | Counts the numbers up |
| `useTilt` | Tilts project cards with a light sheen |
| `useMagnetic` | Makes the buttons magnetic |
| `useParallax` | Moves layers at different speeds |
| `useCursor` | Custom cursor |
| `useHideOnScroll` | Hides the nav on scroll down |
| `useSkillGrid` | Lights up the skill grid |
