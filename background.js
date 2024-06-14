let airtable_url = "";
const airtable_pat = "";

let tabSessions = {};

function handleMessage(request, sender, sendResponse) {
  const tabId = sender.tab.id;

  // store a new session object if it doesn't currently exist in background
  if (!tabSessions.hasOwnProperty(tabId)) {
    tabSessions[tabId] = {
      airtable_id: null,
      attempts: 0,
    };
  }

  let tabSession = tabSessions[tabId];

  if (request.header === "load") {
    let { difficulty, link, problem, timeStart } = request;

    // reset the airtable id and attempts if an existing tab switches to a new problem
    if (problem != tabSession.problem) {
      tabSession.airtable_id = null;
      tabSession.attempts = 0;
    }
    tabSession.difficulty = difficulty;
    tabSession.link = link;
    tabSession.problem = problem;
    tabSession.timeStart = timeStart;
  } else if (request.header === "submit") {
    // increment attempts before destructuring
    tabSession.attempts += 1;
    let { airtable_id, attempts, difficulty, link, problem, timeStart } =
      tabSession;
    let { mdy, timeElapsed, start, end } = calculateTimeData(timeStart);

    if (airtable_id) {
      const fields = {
        attempts,
        "time elapsed": timeElapsed,
        result: request.submissionStatus,
        end,
      };
      sendToAirTable(tabSession, { fields });
    } else {
      const fields = {
        attempts,
        difficulty,
        link,
        problem,
        date: mdy,
        "time elapsed": timeElapsed,
        result: request.submissionStatus,
        start,
        end,
      };

      const req_body = {
        records: [],
      };
      req_body.records.push({
        fields,
      });

      sendToAirTable(tabSession, req_body);
    }
  }

  sendResponse({ response: "able to read message!" });
}

// for receiving page information when content script runs on a new page
browser.runtime.onMessage.addListener(handleMessage);

function sendToAirTable(tabSession, body) {
  let { airtable_id } = tabSession;
  // let airtable_id = tabSession.airtable_id;
  fetch(`${airtable_url}${airtable_id ? `/${airtable_id}` : ""}`, {
    headers: {
      Authorization: `Bearer ${airtable_pat}`,
      "Content-Type": "application/json",
    },
    method: airtable_id ? "PATCH" : "POST",
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (!airtable_id) tabSession.airtable_id = resp?.records[0].id;
    })
    .catch((err) => console.log(err.message));
}

function calculateTimeData(timeStart) {
  const timeEnd = new Date();

  const totalSeconds = Math.floor((timeEnd - timeStart) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let timeElapsed = "";
  if (hours > 0) {
    timeElapsed += `${hours} hours, `;
  }

  if (minutes > 0) {
    timeElapsed += `${minutes} minutes, `;
  }

  if (seconds > 0) {
    timeElapsed += `${seconds} seconds`;
  }

  const month = timeEnd.getMonth() + 1; // zero-indexed month
  const day = timeEnd.getDate();
  const year = timeEnd.getFullYear();

  const mdy = `${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}-${year}`;

  return {
    mdy,
    timeElapsed,
    start: formatHHDDSS(timeStart),
    end: formatHHDDSS(timeEnd),
  };
}

function formatHHDDSS(time) {
  const hour = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  return `${hour < 10 ? "0" + hour : hour}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}
