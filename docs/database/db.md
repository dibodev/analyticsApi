1. Supprimer la table `daily_salts`
2. Aucun changement sur Table `locations`
3. Table `visitors` : 
4. Remplacez `visitor_id` par `visitor_ip_id` lien vers la table visitor_ips
5. Crée table `visitor_ips` (nouvelle table pour stocker les adresses IP et les informations associées.)

```sql
CREATE TABLE visitor_ips (
                           id INT PRIMARY KEY AUTO_INCREMENT,
                           ip VARCHAR(45) NOT NULL, -- Supporte IPv4 et IPv6
                           continent VARCHAR(50),
                           continent_code VARCHAR(10),
                           country VARCHAR(50),
                           country_code VARCHAR(10),
                           region VARCHAR(50),
                           city VARCHAR(50),
                           latitude DECIMAL(10, 8),
                           longitude DECIMAL(11, 8),
                           postal VARCHAR(20),
                           asn INT,
                           org VARCHAR(100),
                           isp VARCHAR(100),
                           domain VARCHAR(100),
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
                           UNIQUE (ip) -- Garantit que chaque adresse IP est unique dans la table
);
```

6. Table `visitor_events`: Supprimer la table 
Remplacer la table `visitor_events` par plusieurs tables :
- Table `pages`:
id: INT PRIMARY KEY AUTO_INCREMENT
url: VARCHAR(2048) NOT NULL UNIQUE
endpoint: VARCHAR(255) -- Nom de la route si disponible ( exemple: /about, /contact, /products)
project_id: INT UNSIGNED REFERENCES projects(id)
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

- Table `page_views`: (Pour enregistrer les vues de page individuelles avec des détails supplémentaires.)
id : INT PRIMARY KEY AUTO_INCREMENT
visitor_id : INT UNSIGNED REFERENCES visitors(id)
page_id : INT UNSIGNED REFERENCES pages(id)
session_start : TIMESTAMP DEFAULT CURRENT_TIMESTAMP
session_end : TIMESTAMP
duration : INT -- Temps passé sur la page en secondes
referrer : VARCHAR(2048) -- URL de la page précédente ou source de trafic si disponible
created_at : TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at : TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


- Table `events`: (Pour capturer les événements spécifiques sur la page, comme les clics sur les boutons, les soumissions de formulaires, etc.)
id : INT PRIMARY KEY AUTO_INCREMENT
page_view_id : INT UNSIGNED REFERENCES page_views(id)
event_type VARCHAR(100), -- Ex. 'click', 'submit', etc.
event_data TEXT, -- Données JSON décrivant l'événement
created_at : TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at : TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

- table `user_agents` (Pour stocker les détails des agents utilisateurs (navigateurs).)
id: INT PRIMARY KEY AUTO_INCREMENT
user_agent: VARCHAR(2048)
browser_name: VARCHAR(255)
browser_version: VARCHAR(255)
browser_language: VARCHAR(50)
os_name: VARCHAR(255)
os_version: VARCHAR(255)
device_type: VARCHAR(255)
created_at : TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at : TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

7. Table `sessions`
Renommez la table `sessions` en `real_time_sessions` et modifiez sa structure pour mieux refléter les sessions en temps réel.
Table `real_time_sessions` (ou un autre nom selon votre choix) :
id INT PRIMARY KEY AUTO_INCREMENT,
visitor_id INT UNSIGNED REFERENCES visitors(id),
page_view_id INT UNSIGNED REFERENCES page_views(id),
active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP



