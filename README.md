# Elite Driver Azur Riviera — Publication sur l'App Store

Ce dossier contient un projet **Capacitor** prêt à l'emploi : il empaquette votre app web (`www/index.html`) dans un vrai conteneur iOS natif que vous pouvez compiler et soumettre à l'App Store.

## Ce qu'il vous faut avant de commencer

- **Un Mac** (obligatoire — Apple exige Xcode, qui ne tourne que sur macOS)
- **Xcode** installé (gratuit, via le Mac App Store)
- **Node.js** installé (node.js.org, version 18 ou plus)
- **Un compte Apple Developer** (99 $/an) — développer.apple.com/programs
- **CocoaPods** installé : dans le Terminal, tapez `sudo gem install cocoapods`

## Étape 1 — Installer les dépendances

Ouvrez le Terminal, placez-vous dans ce dossier, puis :

```bash
npm install
```

## Étape 2 — Ajouter la plateforme iOS

```bash
npx cap add ios
```

Cela crée un dossier `ios/` contenant un vrai projet Xcode.

## Étape 3 — Synchroniser le contenu web dans le projet iOS

À chaque fois que vous modifiez `www/index.html`, relancez cette commande pour répercuter les changements :

```bash
npx cap sync ios
```

## Étape 4 — Ouvrir le projet dans Xcode

```bash
npx cap open ios
```

Xcode s'ouvre automatiquement avec le projet `App.xcworkspace`.

## Étape 5 — Configurer la signature dans Xcode

1. Cliquez sur le projet **App** dans le panneau de gauche
2. Onglet **Signing & Capabilities**
3. Cochez **Automatically manage signing**
4. Sélectionnez votre **Team** (votre compte Apple Developer)
5. Vérifiez le **Bundle Identifier** (ex : `com.elitedriverazurriviera.app`) — il doit être unique et correspondre à celui déclaré dans `capacitor.config.json`

## Étape 6 — Ajouter l'icône de l'app et l'écran de lancement

Dans Xcode, ouvrez `App/App/Assets.xcassets` :
- **AppIcon** : glissez vos icônes (1024×1024 px minimum, sans transparence, sans coins arrondis — Apple les arrondit automatiquement)
- **Splash** : l'écran de démarrage, à personnaliser avec votre logo sur fond `#FAF9F5`

## Étape 7 — Tester sur simulateur ou appareil réel

En haut de Xcode, choisissez un simulateur iPhone (ou votre iPhone branché en USB) puis cliquez sur ▶️ **Run**.

## Étape 8 — Créer la fiche de l'app sur App Store Connect

Avant de soumettre, allez sur [appstoreconnect.apple.com](https://appstoreconnect.apple.com) et créez une nouvelle app :
- Nom de l'app, langue principale
- Bundle ID (le même que dans Xcode)
- SKU (identifiant interne, ex : `EDAR001`)
- Catégorie : **Voyage** ou **Style de vie**
- Captures d'écran (obligatoires, plusieurs tailles d'iPhone)
- Description, mots-clés, URL de support
- **Politique de confidentialité** (URL obligatoire — vous devez en rédiger une, surtout si vous collectez des données de réservation)
- Fiche de confidentialité ("App Privacy") : déclarez quelles données sont collectées (nom, téléphone, email, position si vous ajoutez la géolocalisation réelle)

## Étape 9 — Archiver et envoyer la build

Dans Xcode :
1. Sélectionnez **Any iOS Device** comme cible (pas un simulateur)
2. Menu **Product → Archive**
3. Une fois l'archive terminée, cliquez sur **Distribute App → App Store Connect → Upload**

## Étape 10 — Soumettre pour validation

Retournez sur App Store Connect, sélectionnez la build que vous venez d'envoyer, remplissez les derniers champs et cliquez sur **Submit for Review**. Le délai de validation Apple est généralement de 24 à 48h.

---

## Points à corriger avant la soumission (important)

- **Coordonnées réelles** : remplacez les placeholders téléphone/email dans `www/index.html` par vos vraies coordonnées
- **Paiement** : le formulaire de carte actuel est une simulation visuelle. Si vous gardez un vrai paiement in-app, Apple impose des règles précises (voir Apple Guideline 3.1.1) — pour un service de transport, le paiement via Stripe/carte classique est généralement accepté car il paie un service réel hors app, mais vérifiez la règle au moment de soumettre
- **Backend réel** : connectez le formulaire de réservation à un vrai service (email, base de données) pour que les demandes ne se perdent pas
- **Politique de confidentialité** : obligatoire pour la soumission, même pour une app simple

## Alternative sans Mac

Si vous n'avez pas de Mac, des services comme **Ionic Appflow** ou **Codemagic** permettent de compiler une app iOS dans le cloud à partir de ce même projet Capacitor, sans posséder de Mac vous-même (moyennant un abonnement).
