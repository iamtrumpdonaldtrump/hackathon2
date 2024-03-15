// Ten skrypt będzie wstrzykiwany na aktualnie otwartą stronę
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.command === "analyze") {
      var textContent = document.body.innerText;
      analyzeText(textContent);
    }
  });
  
  function analyzeText(text) {
    var perspectiveAPIEndpoint = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyCLVHQDeV3kAgPe0fUaNFxs0vAW4FSvLvc";
  
    fetch(perspectiveAPIEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: { text: text },
        languages: ["pl"],
        requestedAttributes: { TOXICITY: {} }
      })
    })
    .then(response => response.json())
    .then(data => {
      var toxicityScore = data.attributeScores.TOXICITY.summaryScore.value;
      var toxic = toxicityScore > 0.1; // Zwiększamy próg toksyczności
  
      console.log("Toxicity Score:", toxicityScore); // Logowanie wyniku do konsoli
  
      chrome.runtime.sendMessage({ command: "displayResult", toxic: toxic });
  
      if (toxic) {
        highlightToxicSentences(text);
      }
    })
    .catch(error => console.error('Error:', error));
  }
  
  function highlightToxicSentences(text) {
    var sentences = text.split(/[.!?]/); // Dzielimy tekst na zdania
    sentences.forEach(function(sentence) {
      if (sentence.trim() !== "") {
        var toxicityAPIEndpoint = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyCLVHQDeV3kAgPe0fUaNFxs0vAW4FSvLvc";
        fetch(toxicityAPIEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            comment: { text: sentence },
            languages: ["pl"],
            requestedAttributes: { TOXICITY: {} }
          })
        })
        .then(response => response.json())
        .then(data => {
          var toxicityScore = data.attributeScores.TOXICITY.summaryScore.value;
          if (toxicityScore > 0.7) { // Zwiększamy próg toksyczności
            markSentenceAsToxic(sentence);
          }
        })
        .catch(error => console.error('Error:', error));
      }
    });
  }
  
  function markSentenceAsToxic(sentence) {
    var textNodes = getTextNodesIn(document.body);
    var regex = new RegExp(sentence, 'gi');
    textNodes.forEach(function(node) {
      if (node.nodeValue.match(regex)) {
        var span = document.createElement('span');
        span.style.backgroundColor = 'red';
        span.textContent = node.nodeValue;
        node.parentNode.replaceChild(span, node);
      }
    });
  }
  
  function getTextNodesIn(node) {
    var textNodes = [];
    if (node.nodeType == 3) {
      textNodes.push(node);
    } else {
      var children = node.childNodes;
      for (var i = 0, len = children.length; i < len; ++i) {
        textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
      }
    }
    return textNodes;
  }
  