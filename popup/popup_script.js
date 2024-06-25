// TODO: inform the user if they already have data stored
// show different popup content

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
  });
}

setAirTableData();
