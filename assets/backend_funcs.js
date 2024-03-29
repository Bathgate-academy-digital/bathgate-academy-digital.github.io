const url = 'https://jungle-rush-3hqcrnbkla-nw.a.run.app';

async function getLeaderboard(classFilter) {
  try {
    const response = await fetch(`${url}/api/leaderboard${classFilter ? `?class=${classFilter}` : ''}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    console.error("Response text:", await response.text());
    throw error;
  }
}

async function getAdminLeaderboard(classFilter, password) {
  try {
    const fetchUrl = `${url}/api/admin/leaderboard${classFilter ? `?class=${classFilter}` : ''}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': await passwordToAuthHeader(password)
      }
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    console.error("Response text:", await response.text());
    throw error;
  }
}

async function passwordToAuthHeader(password) {
  const hash = await getSHA256Hash(password);
  let authString = `admin:${hash}`
  let auth = btoa(authString)
  return `Basic ${auth}`
}

async function getSHA256Hash(input) {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};

async function createUser(name, showClass) {
  const requestBody = `name=${name}&class=${showClass}`;
  const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const options = {
    method: "POST",
    headers: requestHeaders,
    body: requestBody
  };

  const response = await fetch(`${url}/api/create`, options);
  return response.json();
}

async function updateTime(id, time) {
  const formattedTime = secondsToHHMMSS(time);
  const requestBody = `id=${id}&time=${formattedTime}`;
  const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const options = {
    method: "POST",
    headers: requestHeaders,
    body: requestBody
  };

  const response = await fetch(`${url}/api/update`, options);
  return response.json();
}

function secondsToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

async function submitUser() {
  const name = document.getElementById('name').value;
  const schoolClass = document.getElementById('class').value.toUpperCase();
  const response = await createUser(name, schoolClass);
  if (response.id == null) {
    const element = document.getElementById("login-error");
    element.innerHTML = response.error_message
    return;
  }
  localStorage.setItem('id', response.id);
  window.location.assign('../game/')
}

async function deleteUser(id, password) {
  const requestBody = `id=${id}`;
  const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': await passwordToAuthHeader(password)
  };
  const options = {
    method: "POST",
    withCredentials: true,
    credentials: 'include',
    headers: requestHeaders,
    body: requestBody
  };

  const response = await fetch(`${url}/api/delete`, options);
  return response.json();
}
