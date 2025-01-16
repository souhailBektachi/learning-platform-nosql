# Projet de fin de module NoSQL

Pour ce projet, vous allez créer une petite API qui va servir de backend à une plateforme d'apprentissage en ligne. J'ai préparé la structure du projet avec une organisation professionnelle du code, comme vous pouvez le constater dans ce dépôt Github.

Commençons par l'organisation pratique :

Installation des dépendances :
   ```bash
   npm install
   ```

### Installation et Configuration

1. Cloner le projet et installer les dépendances:
   ```bash
   git clone <your-repo-url>
   cd learning-platform-nosql
   npm install
   ```

2. Configuration Docker:
   ```bash
   # Démarrer les services MongoDB et Redis
   docker-compose up -d



3. Commandes Docker utiles:
   ```bash
   # Arrêter les services
   docker-compose down

   # Redémarrer les services
   docker-compose restart

   # Voir les logs de MongoDB
   docker-compose logs mongodb

   # Voir les logs de Redis
   docker-compose logs redis

   # Se connecter au shell MongoDB
   docker exec -it mongodb mongosh -u root -p test

   # Se connecter au CLI Redis
   docker exec -it redis redis-cli
   ```

5. Démarrer l'application:
   ```bash
   npm start
   ```

### Réponses aux Questions du Code

#### Questions sur les Routes (`courseRoutes.js`)
1. **Pourquoi séparer les routes dans différents fichiers ?**
   - Améliore la maintenabilité du code
   - Permet une meilleure organisation par domaine fonctionnel
   - Facilite le travail en équipe
   - Rend le code plus modulaire et réutilisable

2. **Comment organiser les routes de manière cohérente ?**
   - Grouper les routes par ressource/domaine
   - Utiliser des verbes HTTP appropriés (GET, POST, PUT, DELETE)
   - Suivre une convention de nommage cohérente
   - Ordonner les routes du plus spécifique au plus général

#### Questions sur les Contrôleurs (`courseController.js`)
1. **Quelle est la différence entre un contrôleur et une route ?**
   - Route : définit l'URL et la méthode HTTP
   - Contrôleur : contient la logique métier et le traitement des requêtes
   - La route redirige vers le contrôleur approprié
   - Le contrôleur interagit avec les services et la base de données

2. **Pourquoi séparer la logique métier des routes ?**
   - Principe de responsabilité unique
   - Facilite les tests unitaires
   - Améliore la réutilisation du code
   - Rend le code plus maintenable

#### Questions sur les Variables d'Environnement (`env.js`)
1. **Pourquoi est-il important de valider les variables d'environnement au démarrage ?**
   - Évite les erreurs en production
   - Détecte rapidement les problèmes de configuration
   - Assure que l'application a toutes les informations nécessaires
   - Facilite le débogage

2. **Que se passe-t-il si une variable requise est manquante ?**
   - L'application s'arrête immédiatement
   - Un message d'erreur explicite est affiché
   - Évite les comportements inattendus
   - Permet une correction rapide

#### Questions sur la Base de Données (`db.js`)
1. **Pourquoi créer un module séparé pour les connexions aux bases de données ?**
   - Centralise la gestion des connexions
   - Facilite la configuration et la maintenance
   - Permet la réutilisation des connexions
   - Simplifie la gestion des erreurs

2. **Comment gérer proprement la fermeture des connexions ?**
   - Écouter les signaux de terminaison (SIGTERM, SIGINT)
   - Fermer proprement les connexions avant l'arrêt
   - Éviter les fuites de ressources
   - Assurer la cohérence des données

#### Questions sur Redis (`redisService.js`)
1. **Comment gérer efficacement le cache avec Redis ?**
   - Utiliser des TTL appropriés
   - Implémenter une stratégie de cache cohérente
   - Gérer les cas d'invalidation du cache
   - Monitorer l'utilisation du cache

2. **Quelles sont les bonnes pratiques pour les clés Redis ?**
   - Utiliser un format de nommage cohérent
   - Inclure le type de données dans la clé
   - Éviter les clés trop longues
   - Utiliser des séparateurs standards

#### Questions sur les Services (`mongoService.js`)
1. **Pourquoi créer des services séparés ?**
   - Séparer les responsabilités
   - Faciliter la maintenance
   - Permettre la réutilisation du code
   - Simplifier les tests

### Screenshots

#### Redis Cache Check
![Redis Cache Check](./screenshots/checkredisCach.png)

#### Redis Cache Check (Alternative View)
![Redis Cache Check Alternative](./screenshots/checkredisCach.png)

#### Redis Connection Test
![Redis Connection Test](./screenshots/TestRedisConnection.png)

#### Student Endpoints Test
![Student Endpoints Test](./screenshots/testStudentsEndPoints.png)

