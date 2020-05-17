const clusters = [
  { url: "https://play.gib.murl.is/serverinfo" }
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

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word[0].toUpperCase() + word.slice(1));
  }).join(' ');
}

function parseResponse(responseText) {
  const responseArray = responseText.split('\n');
  return chunk(responseArray, 4).map(serverArray => {
    return {
      timestamp: serverArray[0],
      players: serverArray[1],
      maxplayers: serverArray[2],
      map: serverArray[3],
    };
  });
};

async function getReliableTimestamp() {
  const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
  const json = await response.json();
  return json.unixtime;
}

function checkOnline(timestamp, currTimestamp, tolerance = 60 * 15) {
  return (timestamp < currTimestamp + tolerance && timestamp > currTimestamp - tolerance);
}

function parseMapName(mapname, prefix) {
  if (mapname.toLowerCase().startsWith(prefix.toLowerCase())) mapname = mapname.slice(prefix.length);

  return titleCase(mapname.replace(/_/g, ' '));
}

function updateHTML(clusterIndex, servers) {
  const clusterEl = document.querySelector(`[data-server-cluster-index='${clusterIndex}']`);
  const serverEls = clusterEl.querySelectorAll("[data-server-index]");

  clusterEl.classList.add("synced");

  if (servers.length === 0) {
    for (let i = 0; i < serverEls.length; i++) {
      servers[i] = {
        online: false,
      };
    }
  }

  servers.forEach(({ online, players, maxplayers, map }, index) => {
    const mapEl = serverEls[index].querySelector(".servers__map");
    const playersEl = serverEls[index].querySelector(".servers__players");
    const statusEl = serverEls[index].querySelector(".servers__status");

    if (!online) {
      map = null;
      players = null;
    }

    mapEl.innerHTML = map ? parseMapName(map, "mg_") : "&ndash;";
    playersEl.innerHTML = players ? `${players}/${maxplayers}` : '&ndash;';
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
    let servers = [];

    try {
      const response = await fetch(url);
      const rawData = await response.text();
      servers = parseResponse(rawData);
    } catch (error) {
      console.warn("Could not fetch data for cluster", clusterIndex);
      console.error(error);
    }
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
