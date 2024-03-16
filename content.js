//var totalScores = 0;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === "analyze") {
    var textContent = document.body.innerText;
    analyzeText(textContent, message.toxicityLevel);
  }
});

function analyzeText(text, toxicityLevel) {
  var perspectiveAPIEndpoint = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyCLVHQDeV3kAgPe0fUaNFxs0vAW4FSvLvc";
  var sentences = text.split(/[.!?]/); // Dzielimy tekst na zdania
  var index = 0;

  function processNextSentence() {
    if (index < sentences.length) {
      var sentence = sentences[index].trim();
      if (sentence !== "") {
        fetch(perspectiveAPIEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            comment: { text: sentence },
            requestedAttributes: {
              TOXICITY: {},
              INSULT: {},
              PROFANITY: {},
              THREAT: {}
            }
          })
        })
        .then(response => response.json())
        .then(data => {
          var toxicityScore = data.attributeScores && data.attributeScores.TOXICITY ? data.attributeScores.TOXICITY.summaryScore.value : 0;
          var insultScore = data.attributeScores && data.attributeScores.INSULT ? data.attributeScores.INSULT.summaryScore.value : 0;
          var profanityScore = data.attributeScores && data.attributeScores.PROFANITY ? data.attributeScores.PROFANITY.summaryScore.value : 0;
          var threatScore = data.attributeScores && data.attributeScores.THREAT ? data.attributeScores.THREAT.summaryScore.value : 0;

          var threshold = getThreshold(toxicityLevel);
          var toxic = toxicityScore > threshold || insultScore > threshold || profanityScore > threshold || threatScore > threshold;

          totalScores += toxicityScore+insultScore+profanityScore+threatScore;

          console.log("Sentence:", sentence);
          console.log("Toxicity Score:", toxicityScore);
          console.log("Insult Score:", insultScore);
          console.log("Profanity Score:", profanityScore);
          console.log("Threat Score:", threatScore);

          if (toxic) {
            markSentenceAsToxic(sentence, toxicityScore, insultScore, profanityScore, threatScore);
          }

          index++;
          processNextSentence();
        })
        .catch(error => {
          console.error('Error:', error);
          index++;
          processNextSentence();
        });
      } else {
        index++;
        processNextSentence();
      }
    }else if(index >= sentences.length){
      console.log("Total: " + totalScores/sentences.length);
    }
  }

  processNextSentence();
}

function markSentenceAsToxic(sentence, toxicityScore, insultScore, profanityScore, threatScore) {
  var textNodes = getTextNodesIn(document.body);
  sentence = sentence.replace(/[^a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ\s]+/gi,'');
  var regex = new RegExp(sentence, 'gi');
  textNodes.forEach(function(node) {
    if (node.nodeValue.match(regex)) {
      var span = document.createElement('span');
      var bgColor = getBackgroundColor(toxicityScore, insultScore, profanityScore, threatScore);
      span.style.backgroundColor = bgColor;
      span.textContent = node.nodeValue;
      node.parentNode.replaceChild(span, node);
    }
  });
}

function getTextNodesIn(node) {
  var textNodes = [];
  if (node.nodeType == 3){ 
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
    }
  }
  return textNodes;
}

function getThreshold(toxicityLevel) {
  switch (toxicityLevel) {
    case '0':
      return 0.1;
    case '1':
      return 0.5;
    case '2':
      return 0.8;
    default:
      return 0.5;
  }
}

function getBackgroundColor(toxicityScore, insultScore, profanityScore, threatScore) {
  if (toxicityScore > insultScore && toxicityScore > profanityScore && toxicityScore > threatScore) {
    return 'red'; // Toksyczność
  } else if (insultScore > toxicityScore && insultScore > profanityScore && insultScore > threatScore) {
    return 'orange'; // Obraźliwość
  } else if (profanityScore > toxicityScore && profanityScore > insultScore && profanityScore > threatScore) {
    return 'purple'; // Wulgaryzmy
  } else if (threatScore > toxicityScore && threatScore > insultScore && threatScore > profanityScore) {
    return 'yellow'; // Groźby
  } else {
    return 'transparent';
  }
}

function getFacebookPostImage(){
  const baseNodes = document.body.querySelectorAll("div>img"); //.x1lliihq
  baseNodes.forEach((a,b,c)=>{
    const attr = a.getAttribute("alt");
    if(attr !== undefined && attr !== null && attr !== "" && attr !== "Image"){
      console.log(attr+"\r\n");
    }
  });
}