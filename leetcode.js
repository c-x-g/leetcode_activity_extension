const timeStart = new Date();

// wait 5 seconds for leetcode to call and load its static assets on the page,
// otherwise the code won't be able to find the medium or hard label
setTimeout(() => {
  const difficulty = findDifficulty();

  let { URL, title } = document;
  console.log(URL);
  console.log(title);
  console.log(`Difficulty: ${difficulty}`);

  browser.runtime.sendMessage({
    header: "load",
    difficulty: difficulty,
    link: URL,
    problem: title.split("-")[0].trim(),
    timeStart,
  });

  addEventListenerSubmitButton();
}, 3000);

function findDifficulty() {
  const mediumClass =
    "relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary text-difficulty-medium dark:text-difficulty-medium";
  const hardClass =
    "relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary text-difficulty-hard dark:text-difficulty-hard";

  const mediumElement = document.getElementsByClassName(mediumClass);
  const hardElement = document.getElementsByClassName(hardClass);

  const isMedium = typeof mediumElement[0] == "object";
  const isHard = typeof hardElement[0] == "object";

  return isMedium ? "Medium" : isHard ? "Hard" : "Easy";
}

function addEventListenerSubmitButton() {
  const submitButtonClass =
    "font-medium items-center whitespace-nowrap focus:outline-none inline-flex relative select-none rounded-none px-3 py-1.5 bg-transparent dark:bg-transparent text-green-60 dark:text-green-60";

  const submitButtonElement =
    document.getElementsByClassName(submitButtonClass)[0];

  submitButtonElement.addEventListener("click", () => {
    // TODO: better to wait for button to become available again
    setTimeout(() => {
      const latestSubmissionClass =
        "flex flex-shrink-0 flex-col justify-between";
      const latestSubmissionElement = document.getElementsByClassName(
        latestSubmissionClass,
      );

      const submissionStatus =
        latestSubmissionElement[0].children[0].children[0].textContent;

      browser.runtime.sendMessage({
        header: "submit",
        submissionStatus,
      });
    }, 5000);
  });
}
