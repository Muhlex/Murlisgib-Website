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
  return chunk(responseArray, 3).map(serverArray => {
    return {
      timestamp: serverArray[0],
      players: serverArray[1],
      map: serverArray[2],
    };
  });
};

function getReliableTimestamp() {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.open("GET", "http://worldtimeapi.org/api/timezone/Etc/UTC", true);
    http.onreadystatechange = function () {
      if (http.readyState == 4) {
        if (http.status == 200) resolve(JSON.parse(http.responseText).unixtime);
        else reject();
      }
    };
    http.onerror = function () {
      reject();
    };
    http.send();
  });
}

function checkOnline(timestamp, currTimestamp, tolerance = 60 * 15) {
  return (timestamp < currTimestamp + tolerance && timestamp > currTimestamp - tolerance);
}

function updateHTML(clusterIndex, servers) {
  const clusterEl = document.querySelector(`[data-server-cluster-index='${clusterIndex}']`);
  const serverEls = clusterEl.querySelectorAll("[data-server-index]");

  servers.forEach(({ online, players, map }, index) => {
    serverEls[index].querySelector(".servers_map").innerHTML = map;
    serverEls[index].querySelector(".servers_players").innerHTML = players;
    serverEls[index].querySelector(".servers_status").innerHTML = online;
  });
};

(async () => {
  let currTimestamp;
  try {
    currTimestamp = await getReliableTimestamp();
  } catch (error) {
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
})();
