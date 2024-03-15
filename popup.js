document.addEventListener('DOMContentLoaded', function() {
  var analyzeButton = document.getElementById('analyzeButton');

  analyzeButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "analyze" });
    });
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.command === "displayResult") {
      var resultDiv = document.getElementById('result');
      if (message.toxic) {
        resultDiv.innerHTML = "<p>This text is toxic!</p>";
        resultDiv.style.color = 'red';
      } else {
        resultDiv.innerHTML = "<p>This text is not toxic.</p>";
        resultDiv.style.color = 'green';
      }
    }
  });
});
