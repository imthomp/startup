// Event messages
const GameEndEvent = 'gameEnd';
const GameStartEvent = 'gameStart';

class Game {
  deseret;
  currChar;
  chars;
  score;
  socket;

  constructor() {
    this.deseret = new Map([
      ["𐐀", "ee"],
      ["𐐁", "ey"],
      ["𐐂", "ah"],
      ["𐐃", "aw"],
      ["𐐄", "oh"],
      ["𐐅", "oo"],
      ["𐐆", "ih"],
      ["𐐇", "eh"],
      ["𐐈", "a"],
      ["𐐉", "ah"],
      ["𐐊", "u"],
      ["𐐋", "oo"],
      ["𐐌", "ie"],
      ["𐐍", "ou"],
      ["𐐎", "w"],
      ["𐐏", "y"],
      ["𐐐", "h"],
      ["𐐑", "p"],
      ["𐐒", "b"],
      ["𐐓", "t"],
      ["𐐔", "d"],
      ["𐐕", "ch"],
      ["𐐖", "j"],
      ["𐐗", "k"],
      ["𐐘", "g"],
      ["𐐙", "f"],
      ["𐐚", "v"],
      ["𐐛", "th"],
      ["𐐜", "dh"],
      ["𐐝", "s"],
      ["𐐞", "z"],
      ["𐐟", "sh"],
      ["𐐠", "zh"],
      ["𐐡", "r"],
      ["𐐢", "l"],
      ["𐐣", "m"],
      ["𐐤", "n"],
      ["𐐥", "ng"],
      ["𐐦", "oi"],
      ["𐐧", "ju"],
    ]);
    this.chars = Array.from(this.deseret.keys());
    this.setCurrChar();
    this.score = 0;

    const playerNameEl = document.querySelector('.player-name');
    playerNameEl.textContent = this.getPlayerName();

    this.configureWebSocket();
  }

  getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
  }

  getRandomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  setCurrChar() {
    this.currChar = this.getRandomChar();
    const dispCharEl = document.querySelector("#deseret");
    dispCharEl.textContent = this.currChar;
  }

  checkAnswer() {
    const answer = document.querySelector("#answer").value;
    const dispScoreEl = document.querySelector('.score')
    if (answer === this.deseret.get(this.currChar)) {
      this.score += 100;
      dispScoreEl.textContent = "Points: " + this.score;
    } else {
      this.score -= 50;
      dispScoreEl.textContent = "Points: " + this.score;
    }
    this.setCurrChar();
    const answerEl = document.querySelector('#answer');
    answerEl.value = "";
  }

  async saveScore() {
    const userName = this.getPlayerName();
    const newScore = { name: userName, score: this.score };

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newScore),
      });
      // Let other players know the game has concluded
      this.broadcastEvent(userName, GameEndEvent, newScore);

      // Store what the service gave us as the high scores
      const scores = await response.json();
      localStorage.setItem('scores', JSON.stringify(scores));
      
    } catch {
      // If there was an error then just track scores locally
      this.updateScoresLocal(newScore);
    }
    window.location.href = "scores.html";
  }

  updateScoresLocal(newScore) {
    let scores = [];
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      scores = JSON.parse(scoresText);
    }

    let found = false;
    for (const [i, prevScore] of scores.entries()) {
      if (newScore > prevScore.score) {
        scores.splice(i, 0, newScore);
        found = true;
        break;
      }
    }

    if (!found) {
      scores.push(newScore);
    }

    if (scores.length > 10) {
      scores.length = 10;
    }

    localStorage.setItem('scores', JSON.stringify(scores));
  }

 // Functionality for peer communication using WebSocket

  configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    this.socket.onopen = (event) => {
      this.displayMsg('system', 'game', 'connected');
    };
    this.socket.onclose = (event) => {
      this.displayMsg('system', 'game', 'disconnected');
    };
    this.socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if (msg.type === GameEndEvent) {
        this.displayMsg('player', msg.from, `scored ${msg.value.score}`);
      } else if (msg.type === GameStartEvent) {
        this.displayMsg('player', msg.from, `started a new game`);
      }
    };
  }

  displayMsg(cls, from, msg) {
    const chatText = document.querySelector('#player-messages');
    chatText.innerHTML =
      `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
  }

  broadcastEvent(from, type, value) {
    const event = {
      from: from,
      type: type,
      value: value,
    };
    this.socket.send(JSON.stringify(event));
  }
}

const game = new Game();