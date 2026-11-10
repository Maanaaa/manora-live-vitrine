# Manora Live · site vitrine

Site de présentation de Manora Live, la borne photo connectée de Manora : brique 4 (front de présentation) de la SAÉ fil rouge IoT, BUT MMI 3, IUT Clermont Auvergne.

Astro, site statique, charte Manora.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # site statique dans dist/, à déposer sur le VPS
```

## Pages

- `/` : présentation, parcours d'un invité, capteurs et règles, architecture, galerie, démo, FAQ, contact
- `/installation` : documentation d'installation de la borne

## À compléter

Dans `src/config.ts` :

- `contactEmail` : l'adresse de réservation
- `demoVideo` : la vidéo de démonstration (ex. `/demo-manora-live.mp4` déposée dans `public/`). Vide, la section affiche un encart « bientôt disponible ».

## Charte et motion

- Couleurs et typo dans `src/styles/global.css` : Plus Jakarta Sans (fichier variable du site Manora, servi en local depuis `public/fonts/`, sans Google Fonts).
- Le pictogramme du logo est redessiné en SVG (`src/components/Mark.astro`) pour pouvoir l'animer.
- Les animations sont en CSS et en JS natif (`src/scripts/motion.ts`), sans bibliothèque. Elles se coupent si le visiteur a activé « réduire les animations ».
- Les photos de soirée dans les animations sont des illustrations (`Snap.astro`) : pas de vraies photos d'invités sur le site.

## Usage de l'IA

Claude Code (Anthropic) a servi d'assistant de développement pour ce dépôt : structure du projet Astro, intégration des sections, animations CSS/JS et vérifications (captures d'écran, Lighthouse). Le contenu, les choix de produit et la charte viennent de Manora. Aucun secret n'a été partagé avec l'outil.
