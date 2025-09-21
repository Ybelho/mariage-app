# Correctifs appliqués (frontend)

1. **Tailwind CSS**
   - Remplacement de `tailwind.config.ts` par une configuration *valide* (les `...` empêchaient Tailwind de compiler).
   - Suppression de `tailwind.config.js` pour éviter les doublons/conflits.
   - `postcss.config.mjs` reste compatible avec Tailwind v4 (`@tailwindcss/postcss`).

2. **CSS global**
   - Correction de l'import Google Fonts (les `...` rendaient l'URL invalide).
   - Passage sur `@import "tailwindcss";` (OK avec Tailwind v4).
   - Ajout/maintien des utilitaires `.card`, `.btn`, `.input`, etc.

3. **Layout**
   - Ajout de `font-body` sur `<body>` pour appliquer la police par défaut.

4. **Composants/pages**
   - `Navbar.jsx` réécrit (suppression des `...`) pour que la page d'accueil compile.
   - `src/app/hebergements/page.tsx` : `text-sauge` → `text-sage`.

> **Remarque** : Certaines autres pages contenaient aussi des `...`. Elles ne bloqueront plus la *home* (tant qu'elles ne sont pas visitées), mais il faudra les compléter de la même manière si vous voulez les utiliser.
