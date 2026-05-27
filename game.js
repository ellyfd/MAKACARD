const state = {
  round: 1,
  deck: [],
  hand: [],
  built: [],
  stats: {
    clarity: 0,
    reliability: 0,
    persona: 0,
    context: 0
  },
  drift: 0,
  mission: GAME_DATA.missions[0]
};

const els = {
  round: document.querySelector("#round"),
  clarity: document.querySelector("#clarity"),
  reliability: document.querySelector("#reliability"),
  persona: document.querySelector("#persona"),
  context: document.querySelector("#context"),
  drift: document.querySelector("#drift"),
  driftMeter: document.querySelector("#drift-meter"),
  missionTitle: document.querySelector("#mission-title"),
  missionCopy: document.querySelector("#mission-copy"),
  personaName: document.querySelector("#persona-name"),
  personaDesc: document.querySelector("#persona-desc"),
  hand: document.querySelector("#hand"),
  built: document.querySelector("#built"),
  builtCount: document.querySelector("#built-count"),
  log: document.querySelector("#log"),
  drawCard: document.querySelector("#draw-card"),
  endRound: document.querySelector("#end-round"),
  resetGame: document.querySelector("#reset-game")
};

function shuffle(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function startGame() {
  state.round = 1;
  state.deck = shuffle(GAME_DATA.cards);
  state.hand = [];
  state.built = [];
  state.stats = { clarity: 0, reliability: 0, persona: 0, context: 0 };
  state.drift = 0;
  state.mission = GAME_DATA.missions[Math.floor(Math.random() * GAME_DATA.missions.length)];
  els.log.innerHTML = "";

  draw(5);
  addLog("新局開始：從 Makalot 組織脈絡與 Elly 溝通偏好抽取卡牌語彙。");
  render();
}

function draw(amount = 1) {
  for (let i = 0; i < amount; i += 1) {
    if (!state.deck.length) {
      state.deck = shuffle(state.built);
      state.built = [];
      addLog("牌庫耗盡，已把建構區洗回牌庫。");
    }

    const card = state.deck.shift();
    if (card) state.hand.push(card);
  }
}

function playCard(index) {
  const [card] = state.hand.splice(index, 1);
  if (!card) return;

  state.built.unshift(card);
  state.stats.clarity += card.clarity;
  state.stats.reliability += card.reliability;
  state.stats.persona += card.persona;
  state.stats.context += card.context;
  state.drift = clamp(state.drift + card.drift, 0, 12);

  const statLine = [
    card.clarity ? `清晰 +${card.clarity}` : "",
    card.reliability ? `可靠 +${card.reliability}` : "",
    card.persona ? `人格 +${card.persona}` : "",
    card.context ? `組織 +${card.context}` : ""
  ].filter(Boolean).join("、");

  addLog(`打出 ${card.name}：${statLine || "穩定架構"}。`);
  checkOutcome();
  render();
}

function endRound() {
  state.round += 1;
  const missingStructure = state.built.filter((card) => card.type === "架構" || card.type === "核心").length < 3;
  const personaHeavy = state.stats.persona > state.stats.reliability + 4;
  const driftGain = 1 + (missingStructure ? 1 : 0) + (personaHeavy ? 2 : 0);

  state.drift = clamp(state.drift + driftGain, 0, 12);
  draw(2);
  addLog(`第 ${state.round - 1} 回合結算：Drift +${driftGain}，抽 2 張卡。`);
  checkOutcome();
  render();
}

function checkOutcome() {
  const values = Object.values(state.stats);
  const complete = values.every((value) => value >= 8) && state.drift < 12;

  if (complete) {
    addLog("勝利：代理的架構與人格已經穩定成形。");
    els.endRound.disabled = true;
    els.drawCard.disabled = true;
  } else if (state.round > 6 || state.drift >= 12) {
    addLog("本局失敗：Drift 壓力過高或回合耗盡，重新調整 skill 結構吧。");
    els.endRound.disabled = true;
    els.drawCard.disabled = true;
  }
}

function currentPersona() {
  return [...GAME_DATA.personas]
    .reverse()
    .find((persona) => state.stats.persona >= persona.threshold);
}

function addLog(message) {
  const item = document.createElement("li");
  item.textContent = message;
  els.log.prepend(item);
}

function statPips(card) {
  const stats = [
    ["C", card.clarity],
    ["R", card.reliability],
    ["P", card.persona],
    ["X", card.context]
  ];

  return stats
    .filter(([, value]) => value)
    .map(([label, value]) => `<span>${label}+${value}</span>`)
    .join("");
}

function cardTemplate(card, index, playable) {
  const button = playable ? `<button type="button" data-card="${index}">打出</button>` : "";
  return `
    <article class="card ${card.type}" style="--tilt:${(index % 5) - 2}deg">
      <div class="card-top">
        <span>${card.type}</span>
        <small>${card.source}</small>
      </div>
      <h3>${card.name}</h3>
      <p>${card.text}</p>
      <blockquote>${card.quote}</blockquote>
      <div class="pips">${statPips(card)}</div>
      ${button}
    </article>
  `;
}

function render() {
  const persona = currentPersona();
  els.round.textContent = state.round;
  els.clarity.textContent = state.stats.clarity;
  els.reliability.textContent = state.stats.reliability;
  els.persona.textContent = state.stats.persona;
  els.context.textContent = state.stats.context;
  els.drift.textContent = state.drift;
  els.driftMeter.value = state.drift;
  els.missionTitle.textContent = state.mission.title;
  els.missionCopy.textContent = state.mission.copy;
  els.personaName.textContent = persona.name;
  els.personaDesc.textContent = persona.desc;
  els.hand.innerHTML = state.hand.map((card, index) => cardTemplate(card, index, true)).join("");
  els.built.innerHTML = state.built.slice(0, 8).map((card, index) => cardTemplate(card, index, false)).join("");
  els.builtCount.textContent = `${state.built.length} cards`;
  els.hand.querySelectorAll("button[data-card]").forEach((button) => {
    button.addEventListener("click", () => playCard(Number(button.dataset.card)));
  });
}

els.drawCard.addEventListener("click", () => {
  draw(1);
  state.drift = clamp(state.drift + 1, 0, 12);
  addLog("額外抽牌：獲得更多選擇，但 Drift +1。");
  checkOutcome();
  render();
});

els.endRound.addEventListener("click", endRound);
els.resetGame.addEventListener("click", () => {
  els.endRound.disabled = false;
  els.drawCard.disabled = false;
  startGame();
});

startGame();
