# How to Run the Project

Since you have set up XAMPP and imported the database, follow these simple steps to run the website in your browser.

### Prerequisite
ensure **XAMPP** is open and **MySQL** is running (Start button is clicked).

### Step 1: Open Terminal
Open your terminal and run this command to go to the project folder:
```bash
cd "/Users/istiakahmmedshifat/Documents/farnichar buy sell"
```

### Step 2: Clear Caches (Optional but Recommended)
Run this command to make sure everything is fresh:
```bash
php artisan optimize:clear
```

### Step 3: Start the Server
Run the following command to start the Laravel server:
```bash
php artisan serve
```

### Step 4: Open in Browser
Once the server is running, open your web browser (Chrome, Edge, etc.) and go to:
[http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### Troubleshooting
- **"Connection Refused"**: Make sure XAMPP MySQL is strictly running.
- **"500 Server Error"**: Run `cat storage/logs/laravel.log` to see the error, or ask me.
- **"Vite Manifest not found"**: Run `npm run build` in a separate terminal window.
