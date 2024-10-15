$(document).ready(() => {
  // Function to collect user information
  function collectUserInfo() {
    const userInfo = {
      platform: window.navigator.platform, // OS information
      userAgent: window.navigator.userAgent, // Browser and OS details
      screenWidth: window.screen.width, // Screen width
      screenHeight: window.screen.height, // Screen height
      language: window.navigator.language, // Browser language
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Timezone
      cookiesEnabled: window.navigator.cookieEnabled, // Are cookies enabled?
      onlineStatus: window.navigator.onLine, // Is the user online?
      deviceMemory: window.navigator.deviceMemory || "unknown", // RAM (in GB, modern browsers only)
      hardwareConcurrency: window.navigator.hardwareConcurrency || "unknown", // Number of CPU cores
      touchSupport: "ontouchstart" in window, // Does the device support touch?
      doNotTrack: window.navigator.doNotTrack === "1" ? "enabled" : "disabled", // Do Not Track setting
    };

    // Try to get geolocation (if permission is granted)
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          userInfo.latitude = position.coords.latitude;
          userInfo.longitude = position.coords.longitude;

          // Send the data to the backend
          sendUserInfo(userInfo);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // If geolocation fails, still send the available data
          sendUserInfo(userInfo);
        }
      );
    } else {
      // If geolocation is not supported, send the available data
      sendUserInfo(userInfo);
    }
  }

  // Function to send user info to the backend
  function sendUserInfo(userInfo) {
    fetch("/user-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("error fetch data from server", response.statusText);
          return response.text();
        }
        return response.json();
      })

      .then((data) => {
        console.log(data);
      })

      .catch((error) => {
        console.error("fetch error", error);
      });
  }

  // Collect and send user info on page load
  collectUserInfo();

  // Rest of your existing chart code here...
});
