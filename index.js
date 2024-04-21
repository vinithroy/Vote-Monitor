document.addEventListener("DOMContentLoaded", () => {
    displayCandidates();
    displayTotalVotes();
    displayVotesTally(); // Changed the order of the function calls
  });
  
  const baseURL = "https://crudcrud.com/api/565e566e47a944da816efe04c5451abb";
  
  const candidates = {
    "Karthik": { name: "Karthik", votes: 0, voters: [] },
    "Lloyd": { name: "Lloyd", votes: 0, voters: [] },
    "Valenteen": { name: "Valenteen", votes: 0, voters: [] },
  };
  
  function handleFormSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const candidate = event.target.candidate.value;
  
    axios
      .post(`${baseURL}/votes`, {
        name: name,
        candidate: candidate,
      })
      .then((response) => {
        candidates[candidate].votes++;
        candidates[candidate].voters.push(name);
        displayCandidates();
        displayTotalVotes();
        displayVotesTally(); // Moved to here to ensure the data is available when displaying
      })
      .catch((error) => console.log(error));
  
    event.target.reset();
  }
  
  function displayTotalVotes() {
    axios
      .get(`${baseURL}/votes`)
      .then((response) => {
        const totalVotes = response.data.length;
        document.getElementById("totalVotes").textContent = totalVotes;
      })
      .catch((error) => console.log(error));
  }
  
  function displayCandidates() {
    const candidatesList = document.getElementById("candidatesList");
    candidatesList.innerHTML = "<h3>Candidates</h3>";
    for (const candidate in candidates) {
      candidatesList.innerHTML += `<p>${candidates[candidate].name}: ${candidates[candidate].votes} votes</p>`;
    }
  }
  
  function displayVotesTally() {
    const votesTally = document.getElementById("votesTally");
    votesTally.innerHTML = "<h3>Votes Tally</h3>";
  
    axios
      .get(`${baseURL}/votes`)
      .then((response) => {
        for (const candidate in candidates) {
          const votes = response.data.filter((vote) => vote.candidate === candidates[candidate].name);
          candidates[candidate].votes = votes.length;
          votesTally.innerHTML += `<h4>${candidates[candidate].name} - Total Votes: ${candidates[candidate].votes}</h4>`;
          if (candidates[candidate].voters.length > 0) {
            votesTally.innerHTML += "<ul>";
            candidates[candidate].voters.forEach(voter => {
              votesTally.innerHTML += `<li>${voter}</li>`;
            });
            votesTally.innerHTML += "</ul>";
          } else {
            votesTally.innerHTML += "<p>No votes yet.</p>";
          }
        }
      })
      .catch((error) => console.log(error));
  }
  
  const form = document.getElementById("votingForm");
  form.addEventListener("submit", handleFormSubmit);
  