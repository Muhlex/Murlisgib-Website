const clusters = [
  { url: "https://eu.gib.murl.is/serverinfo.txt" }
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

function getResponseValueByKey(responseLines, key) {
  const regexp = new RegExp(`${key} *: (.*)`);
  const matchedLine = responseLines.find(line => line.match(regexp));
  return matchedLine && matchedLine.match(regexp)[1];
}

function parseResponse(responseText) {
  const responseLines = responseText.split('\n');
  return chunk(responseLines, 6).map(serverResponseLines => {
    const playersString = getResponseValueByKey(serverResponseLines, 'players');
    return {
      port: Number(getResponseValueByKey(serverResponseLines, 'port')),
      online: Boolean(Number(getResponseValueByKey(serverResponseLines, 'online'))),
      hostname: getResponseValueByKey(serverResponseLines, 'hostname'),
      map: getResponseValueByKey(serverResponseLines, 'map'),
      players: playersString && Number(playersString.match(/(\d+) humans/)[1]),
      bots: playersString && Number(playersString.match(/(\d+) bots/)[1]),
      maxplayers: playersString && Number(playersString.match(/(\d+)\/\d+ max/)[1]),
    };
  });
};

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word[0].toUpperCase() + word.slice(1));
  }).join(' ');
}

function getMapDisplayName(map, prefix = '') {
  const filenameMatch = map.match(/.*\/(.*)/);
  let filename = filenameMatch ? filenameMatch[1] : map;
  if (filename.toLowerCase().startsWith(prefix.toLowerCase())) filename = filename.slice(prefix.length);
  return titleCase(filename.replace(/_/g, ' '));
}

function updateHTML(clusterIndex, servers) {
  const clusterEl = document.querySelector(`[data-server-cluster-index='${clusterIndex}']`);
  const serverEls = clusterEl.querySelectorAll("[data-server-index]");

  clusterEl.classList.add("synced");

  servers.forEach(({ online, players, maxplayers, map }, index) => {
    const mapEl = serverEls[index].querySelector(".servers__map");
    const playersEl = serverEls[index].querySelector(".servers__players");
    const statusEl = serverEls[index].querySelector(".servers__status");

    mapEl.innerHTML = map ? getMapDisplayName(map, 'mg_') : "&ndash;";
    playersEl.innerHTML = !isNaN(players) ? `${players}/${maxplayers || '?'}` : '&ndash;';
    statusEl.innerHTML = online ? "Online" : "Offline";
    serverEls[index].classList.remove(online ? "offline" : "online");
    serverEls[index].classList.add(online ? "online" : "offline");
  });
};

async function update() {
  clusters.forEach(async ({ url }, clusterIndex) => {
    let servers = [];

    try {
      const response = await fetch(url);
      const rawData = await response.text();
      servers = parseResponse(rawData);
    } catch (error) {
      console.warn("Could not fetch data for cluster", clusterIndex, "at", url);
      console.error(error);
    }
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
