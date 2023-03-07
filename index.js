const deseret = new Map([
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

const tableBodyEl = document.querySelector('table');
let counter = 0;

for (const [key, value] of deseret.entries()) {
    const deseretCharTdEl = document.createElement('td');
    const soundTdEl = document.createElement('td');

    deseretCharTdEl.textContent = key;
    soundTdEl.textContent = value;

    const rowEl = document.createElement('tr');
    rowEl.appendChild(deseretCharTdEl);
    rowEl.appendChild(soundTdEl);

    tableBodyEl.appendChild(rowEl);
  }