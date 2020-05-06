const clusters = [
  { url: "http://play.gib.murl.is/serverinfo" }
];

function ready(fun) {
  if (document.readyState != 'loading') {
    fun();
  } else {
    document.addEventListener('DOMContentLoaded', fun);
  }
}

function chunk(array, size) {
  const result = [];
  let index = 0;
  while (index < array.length) {
    result.push(array.slice(index, size + index));
    index += size;
  }
  return result;
}

function parseResponse(responseText) {
  const responseArray = responseText.split('\n');
  return chunk(responseArray, 4).map((serverArray, i) => {
    return {
      timestamp: serverArray[0],
      players: serverArray[1],
      maxplayers: serverArray[2],
      map: i == 0 ? 'very_long_map_name_damn' : serverArray[3],
    };
  });
};

async function getReliableTimestamp() {
  const response = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
  const json = await response.json();
  return json.unixtime;
}

function checkOnline(timestamp, currTimestamp, tolerance = 60 * 15) {
  return (timestamp < currTimestamp + tolerance && timestamp > currTimestamp - tolerance);
}

function updateHTML(clusterIndex, servers) {
  const clusterEl = document.querySelector(`[data-server-cluster-index='${clusterIndex}']`);
  const serverEls = clusterEl.querySelectorAll("[data-server-index]");

  clusterEl.classList.add("synced");

  servers.forEach(({ online, players, maxplayers, map }, index) => {
    const mapEl = serverEls[index].querySelector(".servers__map");
    const playersEl = serverEls[index].querySelector(".servers__players");
    const statusEl = serverEls[index].querySelector(".servers__status");

    mapEl.innerHTML = map;
    playersEl.innerHTML = `${players}/${maxplayers}`;
    statusEl.innerHTML = online ? "Online" : "Offline";
    serverEls[index].classList.add(online ? "online" : "offline")
  });
};

async function update() {
  let currTimestamp;
  try {
    currTimestamp = await getReliableTimestamp();
  } catch (error) {
    console.warn("Unable to fetch remote timestamp. Using local time.\n", error);
    currTimestamp = Math.floor(Date.now() / 1000);
  }

  clusters.forEach(async ({ url }, clusterIndex) => {
    const response = await fetch(url);
    const rawData = await response.text();
    let servers = parseResponse(rawData);
    servers = servers.map(server => {
      return {
        online: checkOnline(server.timestamp, currTimestamp),
        ...server,
      };
    });
    ready(() => updateHTML(clusterIndex, servers));
  });
};

update();
const updateEvery = 60;
let updateInterval = window.setInterval(update, 1000 * updateEvery);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === 'visible') {
    update();
    updateInterval = window.setInterval(update, 1000 * updateEvery);
  } else {
    window.clearInterval(updateInterval);
  }
});
