# 🌤️ React Weather App

A responsive and real-time weather application built with **React**, **Vite**, and **Tailwind CSS**. It fetches live weather data using the [WeatherAPI](https://www.weatherapi.com/) and displays detailed metrics including temperature, humidity, wind speed, UV index, and more.

    🏆 This repository is part of the Open Source 101 organised by ISTE HIT SC

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 🌟 Features

* **City Search:** Search for weather conditions in any city worldwide.
* **Real-time Data:** Fetches up-to-date weather data including:
    * Current Temperature & "Feels Like"
    * Wind Speed & Direction
    * Humidity & Dew Point
    * UV Index
    * Atmospheric Pressure
    * Cloud Coverage
* **Location Details:** Displays Latitude, Longitude, and Region.
* **Error Handling:** Graceful error messages for invalid city names or API issues.
* **Responsive Design:** Fully responsive UI built with Tailwind CSS (mobile and desktop friendly).

## 🛠️ Tech Stack

* **Frontend Library:** [React.js](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **API:** [WeatherAPI.com](https://www.weatherapi.com/)

---

## 🚀 Steps to Run Locally

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have **Node.js** and **npm** installed on your system.

* [Download Node.js](https://nodejs.org/)

### 1. Clone the Repository

Open your terminal and run the following command to clone the repo:

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Install Dependencies

Install the necessary project dependencies:

```bash
npm install
```

### 3. Configure API Key

1. To fetch weather data, you need a free API key from WeatherAPI.

2. Go to WeatherAPI.com and sign up for a free account.

3. Copy your unique API Key from the dashboard.

4. Create a file named `secrets.js` in the `src` directory of your project.

5. Add the following line to the `secrets.js` file:
 ```
 export const VITE_WEATHER_API_KEY=your_api_key_here;
 ```

 ### 4. Run the Application
 Start the development server:
 ``` bash
 npm run dev
 ```

 Click the link provided in the terminal (usually http://localhost:5173) to view the app in your browser.

 ### 📂 Project Structure
 ```
 Weather/
├─ public/
│  └─ Favicon.png
├─ src/
│  ├─ assets/
│  │  └─ Logo.png
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  ├─ main.jsx
│  └─ secrets.js <-- Here you will keep your API key
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
└─ vite.config.js
```

### 🤝 Contributing
Contributions are welcome! If you have suggestions or want to improve the UI/Code:

1. Fork the repository.

2. Create a new branch (`git checkout -b feature/YourFeature`).

3. Commit your changes (`git commit -m 'Add some feature'`).

4. Push to the branch (`git push origin feature/YourFeature`).

5. Open a Pull Request.

### 📄 License
This project is open source and available under the MIT License.

### 💡 Troubleshooting
* "City not found" Error:

* Ensure you typed the city name correctly.

* Check if your internet connection is active.


### API Error / No Data:

* Verify that your `screst.js` file exists in the root directory.

* Ensure the variable name is exactly VITE_WEATHER_API_KEY.

* Check if your API key quota has been exceeded on WeatherAPI.com.

* Restart the development server (Ctrl + C then npm run dev) after creating the `secrets.js` file.