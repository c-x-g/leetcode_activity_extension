// TODO: inform the user if they already have data stored
// show different popup content

const makeVisible = "visibility: visible; display: inline;";
const makeInvisible = "visibility: hidden; display: none;";

const providedMessage = document.getElementById("provided-message");
const successMessage = document.getElementById("success-message");

function checkExistingCredentials() {
  try {
    browser.storage.local
      .get(["baseId", "tableId", "patToken"])
      .then((item) => {
        const { baseId, tableId, patToken } = item;
        if (baseId && tableId && patToken) {
          providedMessage.setAttribute("style", makeVisible);
        }
      });
  } catch (error) {
    console.log(`error occurred while fetching airtable credentials: ${error}`);
  }
}

function setAirTableData() {
  const submitButton = document.getElementById("submit-data");
  console.log(submitButton);
  submitButton.addEventListener("click", () => {
    const baseId = document.getElementById("base-id").value;
    const tableId = document.getElementById("table-id").value;
    const patToken = document.getElementById("pat-token").value;
    browser.storage.local.set({ baseId, tableId, patToken });
    browser.runtime.sendMessage({
      header: "reloadCredentials",
    });
    providedMessage.setAttribute("style", makeInvisible);
    successMessage.setAttribute("style", makeVisible);
  });
}

// if credentials already exist, inform user with message
checkExistingCredentials();

// add listener for Submit button
setAirTableData();
