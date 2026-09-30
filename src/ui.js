import { STAGES } from "./data/stages.js";

export function render(root, game) {
  root.innerHTML = `
    <main class="shell" id="world">
      <header class="topbar">
        <div class="brand">
          <div class="mark" aria-hidden="true">H</div>
          <div>
            <strong>HISABATI</strong>
            <span>Mathematics adventure</span>
          </div>
        </div>
        <button id="restart" class="quiet" type="button">New journey</button>
      </header>

      <section class="hero" id="hero">
        <div>
          <p class="eyebrow" id="worldLabel"></p>
          <h1 id="stageName"></h1>
          <p id="stageDesc"></p>
        </div>
        <div class="stage-number">
          <span>STAGE</span>
          <b id="stage"></b>
        </div>
      </section>

      <section class="hud">
        <div><small>XP</small><b id="xp"></b></div>
        <div><small>COINS</small><b id="coins"></b></div>
        <div><small>STREAK</small><b id="streak"></b></div>
        <div><small>LIVES</small><b id="lives"></b></div>
      </section>

      <section class="map-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">YOUR JOURNEY</p>
            <h2>Number Valley</h2>
          </div>
          <span id="mapProgress"></span>
        </div>
        <div class="map" id="map"></div>
      </section>

      <section class="challenge" id="challenge">
        <div class="challenge-head">
          <div>
            <span id="encounter"></span>
            <span id="skill"></span>
            <span id="subskill"></span>
          </div>
          <div class="challenge-mode" id="mode"></div>
        </div>

        <div class="boss-banner" id="bossBanner" hidden>
          <div class="boss-mark">B</div>
          <div>
            <span class="boss-kicker">BOSS CHALLENGE</span>
            <strong id="bossName"></strong>
            <p>Prove your mastery. Your weakest skills are more likely to appear.</p>
          </div>
        </div>

        <div class="boss-meter" id="bossMeter" hidden>
          <div class="boss-meter-top">
            <span>Boss progress</span>
            <strong id="bossProgress"></strong>
          </div>
          <div class="meter-track"><span id="bossFill"></span></div>
        </div>

        <div class="question">
          <p>Challenge</p>
          <h2 id="question"></h2>
        </div>

        <form id="form">
          <label for="answer">Your answer</label>
          <div class="answer-row">
            <input id="answer" type="number" inputmode="decimal" step="any" placeholder="Enter a number" autocomplete="off" required>
            <button type="submit">Solve</button>
          </div>
        </form>
        <div class="feedback" id="feedback" aria-live="polite"></div>
        <div class="explanation" id="explanation" hidden>
          <div class="explanation-title">Why?</div>
          <p id="explanationText"></p>
        </div>
      </section>

      <section class="bottom">
        <article>
          <div class="card-head"><span>LEARNER PROFILE</span><b id="accuracy"></b></div>
          <p>Hisabati now tracks smaller learning skills, not just broad topics. Your weaker subskills are practised more often.</p>
          <div id="skills"></div>
        </article>
        <article>
          <div class="reward-icon" aria-hidden="true">★</div>
          <div>
            <span class="card-head">NEXT REWARD</span>
            <h3 id="reward"></h3>
            <p id="rewardText">Clear the stage to earn bonus coins and advance.</p>
          </div>
        </article>
      </section>

      <section class="complete" id="complete" hidden>
        <p class="eyebrow" id="completeEyebrow">STAGE COMPLETE</p>
        <h2 id="completeTitle">Stage cleared.</h2>
        <p id="completeText"></p>
        <button id="continue" type="button">Continue journey</button>
      </section>
    </main>
  `;

  root.querySelector("#form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = root.querySelector("#answer");
    const result = game.answer(input.value);

    if (result.type === "invalid") {
      feedback(root, result.message, "error");
      return;
    }

    feedback(root, result.message, result.type === "correct" ? "success" : "error");
    input.value = "";
    update(root, game.view());
    showExplanation(root, result);

    if (!game.stageComplete) input.focus();
  });

  root.querySelector("#restart").addEventListener("click", () => {
    if (confirm("Start a new journey? Your saved progress will be erased.")) {
      game.restart();
    }
  });

  root.querySelector("#continue").addEventListener("click", () => game.continue());
  update(root, game.view());
}

export function update(root, view) {
  hideExplanation(root);
  root.querySelector("#worldLabel").textContent = `WORLD ${view.stage.id} · ${view.stage.world}`;
  root.querySelector("#stageName").textContent = view.stage.name;
  root.querySelector("#stageDesc").textContent = view.stage.desc;
  root.querySelector("#stage").textContent = view.stage.id;
  root.querySelector("#xp").textContent = `${Math.floor(view.state.xp)} / ${view.xpTarget}`;
  root.querySelector("#coins").textContent = view.state.coins;
  root.querySelector("#streak").textContent = view.state.streak;
  root.querySelector("#lives").textContent = "♥".repeat(view.state.lives) + "♡".repeat(3 - view.state.lives);

  root.querySelector("#encounter").textContent = view.isBoss
    ? `BOSS ROUND ${view.state.stageTotal + 1} / ${view.encounterTarget}`
    : `ENCOUNTER ${view.state.encounter} / ${view.encounterTarget}`;

  root.querySelector("#skill").textContent = view.question.label;
  root.querySelector("#subskill").textContent = view.question.subskill;
  root.querySelector("#question").textContent = view.question.text;
  root.querySelector("#accuracy").textContent = `${view.accuracy}% accuracy`;
  root.querySelector("#mapProgress").textContent = `Stage ${view.state.stage} of ${view.stageCount}`;
  root.querySelector("#mode").textContent = view.isBoss ? "BOSS" : "ADVENTURE";

  const hero = root.querySelector("#hero");
  hero.classList.toggle("boss-hero", view.isBoss);

  const bossBanner = root.querySelector("#bossBanner");
  const bossMeter = root.querySelector("#bossMeter");
  bossBanner.hidden = !view.isBoss;
  bossMeter.hidden = !view.isBoss;

  if (view.isBoss) {
    root.querySelector("#bossName").textContent = view.stage.bossName;
    const progress = Math.min(view.stage.bossQuestions, view.state.stageTotal);
    const percent = (progress / view.stage.bossQuestions) * 100;
    root.querySelector("#bossProgress").textContent = `${view.state.stageCorrect} / ${view.masteryTarget} correct`;
    root.querySelector("#bossFill").style.width = `${percent}%`;
  }

  renderMap(root, view);
  renderSkills(root, view);
  renderReward(root, view);

  const complete = root.querySelector("#complete");
  complete.hidden = !view.stageComplete;

  if (view.stageComplete) {
    const completed = view.completedStage ?? view.stage;
    const bossCleared = Boolean(completed.boss);
    root.querySelector("#completeEyebrow").textContent = bossCleared ? "BOSS DEFEATED" : "STAGE COMPLETE";
    root.querySelector("#completeTitle").textContent = bossCleared
      ? `${view.stage.bossName} defeated.`
      : "Stage cleared.";
    root.querySelector("#completeText").textContent =
      view.state.stage >= view.stageCount
        ? "You reached the current summit. Hisabati has recorded what you learned."
        : "Your mastery has earned a new area. Your next challenges will continue adapting to your performance.";
  }
}

function renderMap(root, view) {
  const map = root.querySelector("#map");
  map.innerHTML = "";

  STAGES.forEach((stage) => {
    const node = document.createElement("div");
    node.className = "node";
    if (stage.id < view.state.stage) node.classList.add("cleared");
    if (stage.id === view.state.stage) node.classList.add("current");
    if (stage.id > view.state.stage) node.classList.add("locked");
    if (stage.boss) node.classList.add("boss-node");

    node.innerHTML = `
      <b>${stage.boss ? "B" : stage.id}</b>
      <span>${stage.name}</span>
    `;

    map.appendChild(node);
  });
}

function renderSkills(root, view) {
  const skills = root.querySelector("#skills");
  const grouped = {};

  Object.values(view.subskills).forEach((item) => {
    (grouped[item.skill] ??= []).push(item);
  });

  skills.innerHTML = Object.entries(grouped).map(([name, items]) => {
    const overall = Math.round((items.reduce((sum, item) => sum + item.level, 0) / (items.length * 8)) * 100);
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    const rows = items.map((item) => {
      const percent = Math.round((item.level / 8) * 100);
      const accuracy = item.attempts ? Math.round((item.correct / item.attempts) * 100) : null;
      return `
        <div class="subskill">
          <span>${item.name}</span>
          <i><em style="width:${percent}%"></em></i>
          <b>${accuracy === null ? "New" : `${accuracy}%`}</b>
        </div>`;
    }).join("");
    return `
      <div class="skill-group">
        <div class="skill-group-head"><strong>${label}</strong><span>${overall}%</span></div>
        ${rows}
      </div>`;
  }).join("");
}

function renderReward(root, view) {
  const remaining = Math.max(0, view.xpTarget - Math.floor(view.state.xp));
  root.querySelector("#reward").textContent = remaining
    ? `${remaining} XP to reward`
    : "Reward ready";
  root.querySelector("#rewardText").textContent = view.isBoss
    ? "Defeat the boss to earn the larger stage reward."
    : "Clear the stage to earn bonus coins and advance.";
}

function feedback(root, message, type) {
  const el = root.querySelector("#feedback");
  el.textContent = message;
  el.className = `feedback ${type}`;
}


function showExplanation(root, result) {
  const box = root.querySelector("#explanation");
  const text = root.querySelector("#explanationText");

  if (result.type !== "wrong" || !result.explanation) {
    box.hidden = true;
    return;
  }

  text.textContent = result.explanation;
  box.hidden = false;
}

function hideExplanation(root) {
  const box = root.querySelector("#explanation");
  if (box) box.hidden = true;
}
