# Publier sur l'App Store depuis un PC Windows (sans Mac) — via Codemagic

Ce guide remplace les étapes "Xcode sur Mac" par une compilation dans le cloud. Tout se fait depuis votre navigateur sur votre HP.

## Ce qu'il vous faut

- **Un compte Apple Developer** (99 $/an) — developer.apple.com/programs — obligatoire, même en passant par le cloud
- **Un compte GitHub** (gratuit) — pour héberger le code du projet
- **Un compte Codemagic** (gratuit pour commencer) — codemagic.io

## Étape 1 — Mettre le projet sur GitHub

1. Créez un compte sur [github.com](https://github.com) si vous n'en avez pas
2. Créez un nouveau dépôt (repository), par exemple `elite-driver-azur-riviera-app`
3. Uploadez-y tout le contenu de ce dossier `elite-driver-ios/` (glisser-déposer possible directement sur la page GitHub, pas besoin de ligne de commande)

## Étape 2 — Créer votre compte Apple Developer

1. Allez sur [developer.apple.com/programs](https://developer.apple.com/programs)
2. Inscrivez-vous avec votre identifiant Apple (Apple ID)
3. Payez les 99 $/an — la validation par Apple peut prendre 24 à 48h

## Étape 3 — Connecter Codemagic à App Store Connect

1. Créez un compte sur [codemagic.io](https://codemagic.io) (connexion possible via GitHub)
2. Ajoutez votre nouveau dépôt GitHub dans Codemagic
3. Dans **Teams settings → Integrations → Apple Developer Portal**, suivez les instructions de Codemagic pour connecter votre compte Apple via une **clé API App Store Connect** (Codemagic vous explique pas à pas où la générer dans App Store Connect — cela évite d'avoir à gérer des certificats manuellement)

## Étape 4 — Créer la fiche de l'app sur App Store Connect

Avant le premier envoi, sur [appstoreconnect.apple.com](https://appstoreconnect.apple.com), créez une nouvelle app :
- Bundle ID : `com.elitedriverazurriviera.app` (doit correspondre à celui du fichier `capacitor.config.json`)
- Nom, catégorie (Voyage / Style de vie), langue
- Politique de confidentialité (URL obligatoire)

## Étape 5 — Lancer le premier build

Ce dépôt contient déjà un fichier `codemagic.yaml` qui décrit la compilation. Dans Codemagic :
1. Ouvrez votre projet
2. Cliquez sur **Start new build**
3. Choisissez le workflow **ios-elite-driver**
4. Lancez — Codemagic installe Node, ajoute la plateforme iOS, compile avec Xcode dans le cloud, signe l'app, et génère un fichier `.ipa`

## Étape 6 — Premier envoi vers TestFlight

Le fichier `codemagic.yaml` fourni envoie automatiquement le build vers **TestFlight** (l'outil de test d'Apple) à chaque compilation réussie. Vous pouvez alors :
- Tester l'app vous-même via l'app TestFlight sur votre iPhone
- Inviter d'autres testeurs par email

## Étape 7 — Soumission finale à l'App Store

Une fois satisfait de la version testée sur TestFlight :
1. Retournez sur App Store Connect
2. Ajoutez les captures d'écran, la description, les mots-clés
3. Sélectionnez la build validée sur TestFlight
4. Cliquez sur **Submit for Review**

Le workflow `codemagic.yaml` a `submit_to_app_store: false` par défaut pour vous laisser relire manuellement avant l'envoi définitif — vous pouvez le passer à `true` une fois à l'aise avec le processus, pour automatiser complètement les futures mises à jour.

## Ce qui reste à faire avant de lancer un vrai build

- Remplacer les coordonnées (téléphone, e-mail) dans `www/index.html`
- Rédiger et héberger une politique de confidentialité (obligatoire pour Apple)
- Décider si le paiement reste une simulation ou passe en vrai Stripe (voir échange précédent)
- Ajouter une icône d'app (1024×1024 px) — Codemagic ou Xcode vous demandera où la placer dans `ios/App/App/Assets.xcassets` une fois le dossier `ios/` généré au premier build

## Coût à prévoir

- Apple Developer Program : 99 $/an (obligatoire)
- Codemagic : gratuit jusqu'à 500 minutes de build/mois, largement suffisant pour ce projet
