#!/bin/bash

# ----------------------------
# TinyTales MEVN App Installer
# ----------------------------

# 1. assuming you are running this script as root or with sudo
# And that you have downloaded or cloned the TinyTales MEVN app repo.
# Which is realistically the "only" way to run this script.

# 2. Update packages and install Node.js, npm, Apache
sudo apt update
sudo apt install -y nodejs npm apache2

# 3. Check Node versions
echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# 4. Install project dependencies (you can skip nodemon in production)
npm install express@4 dotenv mongoose bcryptjs jsonwebtoken

# 5. (Optional) Install nodemon globally for dev use
# sudo npm install -g nodemon

# 6. Start the app (nohup for background, redirect output to log)
nohup node app.js > server.log 2>&1 &

echo "✅ App started on http://localhost:3000 (internally)"

# 7. Apache reverse proxy setup
sudo a2enmod proxy proxy_http

# 8. Create Apache reverse proxy config
sudo tee /etc/apache2/sites-available/myexpress.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName localhost
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
EOF

# 9. Enable new site and disable default
sudo a2ensite myexpress.conf
sudo a2dissite 000-default.conf
sudo systemctl restart apache2

# 10. Final output
echo "✅ Setup complete. Visit: http://$(curl -s ifconfig.me) or your VM IP"
