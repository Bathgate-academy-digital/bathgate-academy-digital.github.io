const url = 'https://jungle-rush-kk7piym5qq-nw.a.run.app';

async function getLeaderboard() {
  try {
    const response = await fetch(`${url}/api/leaderboard`);
    return response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    console.error("Response text:", await response.text());
    throw error;
  }
}

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
