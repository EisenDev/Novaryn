# Deployment Standard Procedures

This guide details hosting, DNS delegations, and production-stage deployments for both frontend and backend modules.

---

## 🌎 DNS & Custom Domain Configurations

For the custom domain `novaryn.tech`, two configurations are supported to resolve vercel mapping errors:

### Option A: Nameserver Delegation (Recommended for Vercel)
Change nameservers at your registrar (Tech Domains) to Vercel DNS:
* `ns1.vercel-dns.com`
* `ns2.vercel-dns.com`

> [!NOTE]
> Nameserver updates take 24–48 hours to globally propagate. During this window, SSL cert generations may throw errors.

### Option B: A Record Delegation (Instant Activation)
If nameservers fail to resolve or you want to manage DNS records elsewhere:
1. Revert registrar nameservers to default.
2. In your DNS Management portal, add:
   * **Type**: `A` | **Name**: `@` (Root) | **Value**: `76.76.21.21` (Vercel IP)
   * **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com`

---

## 🚀 Frontend Deployment (Vercel)

The Next.js marketing application is designed for instant deployment on Vercel.

### Steps:
1. Link your GitHub repository (`Novaryn`) in the Vercel dashboard.
2. Set the **Root Directory** to `frontend`.
3. Set the **Framework Preset** to `Next.js`.
4. Configure production environment parameters:
   * `NEXT_PUBLIC_API_URL` = `https://api.novaryn.tech/api/v1` (Your production backend URL)
5. Click **Deploy**. Vercel will build, optimize static chunks, and activate Edge Routing.

---

## ⚡ Backend Deployment (Docker/VPS/Azure)

The Laravel API can be hosted on any Linux VM (Azure VM, AWS EC2, DigitalOcean Droplet) using Docker.

### 1. Build Production Images
In production, compile optimized multi-stage build files:
```bash
docker compose -f docker-compose.prod.yml build
```
This installs composer dependencies with `--no-dev --optimize-autoloader` and sets PHP to production cache limits.

### 2. Configure Nginx Proxy & Let's Encrypt SSL
Create an Nginx configuration file (`/etc/nginx/sites-available/api.novaryn.tech`) mapping incoming HTTPS traffic:
```nginx
server {
    listen 80;
    server_name api.novaryn.tech;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.novaryn.tech;

    ssl_certificate /etc/letsencrypt/live/api.novaryn.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.novaryn.tech/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Run certbot to sign SSL certificates:
```bash
sudo certbot --nginx -d api.novaryn.tech
```

### 3. Queue Workers & Cron Jobs
* **Scheduler**: Set up a server crontab to run Laravel schedules every minute:
  ```cron
  * * * * * cd /path/to/novaryn && docker compose exec -T backend php artisan schedule:run >> /dev/null 2>&1
  ```
* **Queues**: Run the queue worker container under systemd or supervisor keeping `php artisan queue:work` active:
  ```bash
  docker compose exec -d backend php artisan queue:work --queue=default,emails --tries=3
  ```
