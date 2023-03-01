class Game {
  buttons;
  allowPlayer;
  sequence;
  playerPlaybackPos;
  mistakeSound;

  constructor() {
    this.chars = new Map([
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
    this.allowPlayer = false;
    this.sequence = [];
    this.playerPlaybackPos = 0;
    this.mistakeSound = loadSound('error.mp3');

    document.querySelectorAll('.game-button').forEach((el, i) => {
      if (i < btnDescriptions.length) {
        this.buttons.set(el.id, new Button(btnDescriptions[i], el));
      }
    });

    const playerNameEl = document.querySelector('.player-name');
    playerNameEl.textContent = this.getPlayerName();
  }

  async pressButton(button) {
    if (this.allowPlayer) {
      this.allowPlayer = false;
      await this.buttons.get(button.id).press(1.0);

      if (this.sequence[this.playerPlaybackPos].el.id === button.id) {
        this.playerPlaybackPos++;
        if (this.playerPlaybackPos === this.sequence.length) {
          this.playerPlaybackPos = 0;
          this.addButton();
          this.updateScore(this.sequence.length - 1);
          await this.playSequence();
        }
        this.allowPlayer = true;
      } else {
        this.saveScore(this.sequence.length - 1);
      }
    }
  }

  async reset() {
    this.allowPlayer = false;
    this.playerPlaybackPos = 0;
    this.sequence = [];
    this.updateScore('--');
    this.addButton();
    this.allowPlayer = true;
  }

  getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
  }

  addButton() {
    const btn = this.getRandomButton();
    this.sequence.push(btn);
  }

  updateScore(score) {
    const scoreEl = document.querySelector('#score');
    scoreEl.textContent = score;
  }

  getRandomChar() {
    let chars = Array.from(this.chars.values());
    return chars[Math.floor(Math.random() * this.chars.size)];
  }

  saveScore(score) {
    const userName = this.getPlayerName();
    let scores = [];
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      scores = JSON.parse(scoresText);
    }
    scores = this.updateScores(userName, score, scores);

    localStorage.setItem('scores', JSON.stringify(scores));
  }

  updateScores(userName, score, scores) {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    let found = false;
    for (const [i, prevScore] of scores.entries()) {
      if (score > prevScore.score) {
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

    return scores;
  }
}

const game = new Game();