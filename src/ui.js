import {
  ARITHMETIC_LEVELS
} from "./data/levels.js";

const REVIVE_COST = 20;
const DAILY_TOTAL = 5;

let currentScreen = "home";
let activeGame = null;

export function setHisabatiGame(game) {
  activeGame = game;
}

export function render(root, game) {
  activeGame = game;

  root.innerHTML = `
    <main class="shell" id="world">

      <!-- IDENTITY SETUP -->
      <section
        class="identity-gate"
        id="identityGate"
        hidden
      >
        <div class="identity-card">

          <p class="eyebrow">
            WELCOME TO HISABATI
          </p>

          <h1>
            What should we call you?
          </h1>

          <p>
            Your name stays on this device
            and helps make your journey personal.
            No registration required.
          </p>

          <form id="identityForm">

            <label for="identityName">
              Display name
            </label>

            <input
              id="identityName"
              type="text"
              maxlength="24"
              autocomplete="nickname"
              placeholder="Enter your name"
              required
            >

            <button
              class="primary-button"
              type="submit"
            >
              Begin Journey
            </button>

            <p
              class="identity-error"
              id="identityError"
              hidden
            >
              Please enter a valid name.
            </p>

          </form>

        </div>
      </section>

      <!-- NAME EDIT MODAL -->
      <section
        class="profile-edit-overlay"
        id="profileEditOverlay"
        hidden
      >
        <div
          class="profile-edit-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editProfileTitle"
        >

          <div class="profile-edit-head">

            <div>
              <p class="eyebrow">
                YOUR IDENTITY
              </p>

              <h2 id="editProfileTitle">
                Change your name
              </h2>
            </div>

            <button
              id="closeProfileEdit"
              class="quiet"
              type="button"
              aria-label="Close"
            >
              ×
            </button>

          </div>

          <form id="profileEditForm">

            <label for="profileNameInput">
              Display name
            </label>

            <input
              id="profileNameInput"
              type="text"
              maxlength="24"
              autocomplete="nickname"
              placeholder="Enter your name"
              required
            >

            <p
              class="identity-error"
              id="profileEditError"
              hidden
            ></p>

            <div class="profile-edit-actions">

              <button
                id="cancelProfileEdit"
                class="secondary-button"
                type="button"
              >
                Cancel
              </button>

              <button
                class="primary-button"
                type="submit"
              >
                Save Name
              </button>

            </div>

          </form>

        </div>
      </section>

      <!-- TOP BAR -->
      <header class="topbar">

        <div class="brand">

          <div class="mark">
            H
          </div>

          <div>
            <strong>
              HISABATI
            </strong>

            <span>
              Mathematics adventure
            </span>
          </div>

        </div>

        <nav class="main-nav">

          <button
            class="nav-button active"
            data-screen="home"
            type="button"
          >
            Home
          </button>

          <button
            class="nav-button"
            data-screen="journey"
            type="button"
          >
            Journey
          </button>

          <button
            class="nav-button"
            data-screen="profile"
            type="button"
          >
            Profile
          </button>

        </nav>

        <button
          id="restart"
          class="quiet"
          type="button"
        >
          New journey
        </button>

      </header>

      <!-- HOME -->
      <section
        class="app-screen"
        id="homeScreen"
      >

        <section class="home-hero">

          <div>

            <p
              class="eyebrow"
              id="homeWelcome"
            >
              WELCOME TO HISABATI
            </p>

            <h1 id="homeGreeting">
              Begin your<br>
              mathematical journey.
            </h1>

            <p class="home-description">
              Keep building your skills through
              adaptive challenges designed around
              how you learn.
            </p>

          </div>

          <div class="home-hero-mark">
            H
          </div>

        </section>

        <section class="home-current">

          <div class="home-current-top">

            <div>

              <p
                class="eyebrow"
                id="homeChapter"
              ></p>

              <h2 id="homeLevelName"></h2>

              <p
                id="homeLevelDescription"
              ></p>

            </div>

            <div class="home-level-number">

              <span>
                LEVEL
              </span>

              <strong
                id="homeLevelNumber"
              ></strong>

            </div>

          </div>

          <div class="home-progress-track">

            <span
              id="homeProgressFill"
            ></span>

          </div>

          <div class="home-progress-bottom">

            <span
              id="homeProgressText"
            ></span>

            <button
              id="continueJourney"
              class="primary-button"
              type="button"
            >
              Continue Journey
            </button>

          </div>

        </section>

        <section class="stat-grid">

          <article class="stat-card">
            <small>XP</small>
            <strong id="homeXP"></strong>
            <span id="homeXPLabel"></span>
          </article>

          <article class="stat-card">
            <small>COINS</small>
            <strong id="homeCoins"></strong>
            <span>
              Use coins for rewards and revival.
            </span>
          </article>

          <article class="stat-card">
            <small>STREAK</small>
            <strong id="homeStreak"></strong>
            <span>
              Consecutive correct answers.
            </span>
          </article>

          <article class="stat-card">
            <small>HEARTS</small>
            <strong id="homeLives"></strong>
            <span id="homeLivesLabel"></span>
          </article>

        </section>

        <section class="home-columns">

          <article class="feature-card daily-card">

            <div class="feature-icon">
              ☀
            </div>

            <div>

              <p class="eyebrow">
                DAILY CHALLENGE
              </p>

              <h3 id="dailyHomeTitle">
                Five questions. One daily run.
              </h3>

              <p id="dailyHomeText">
                Test your current skills and earn
                a bonus for completing today's challenge.
              </p>

              <button
                id="startDaily"
                class="secondary-button"
                type="button"
              >
                Start Daily Challenge
              </button>

            </div>

          </article>

          <article class="feature-card reward-card">

            <div class="feature-icon">
              ★
            </div>

            <div>

              <p class="eyebrow">
                NEXT REWARD
              </p>

              <h3 id="homeReward"></h3>

              <p id="homeRewardText"></p>

              <button
                id="homeJourneyButton"
                class="secondary-button"
                type="button"
              >
                View Journey
              </button>

            </div>

          </article>

        </section>

        <section class="home-course">

          <div class="section-head">

            <div>

              <p class="eyebrow">
                YOUR COURSE
              </p>

              <h2>
                Arithmetic
              </h2>

            </div>

            <span
              id="homeCourseProgress"
            ></span>

          </div>

          <div class="course-summary">

            <div class="course-icon">
              ∑
            </div>

            <div class="course-summary-text">

              <strong>
                Arithmetic
              </strong>

              <span>
                Numbers, calculations and
                everyday mathematics.
              </span>

            </div>

            <button
              id="courseJourney"
              class="secondary-button"
              type="button"
            >
              Open Journey
            </button>

          </div>

        </section>

      </section>

      <!-- JOURNEY -->
      <section
        class="app-screen"
        id="journeyScreen"
        hidden
      >

        <section class="page-heading">

          <div>

            <p class="eyebrow">
              YOUR JOURNEY
            </p>

            <h1>
              Arithmetic
            </h1>

            <p>
              Progress through chapters,
              master new skills and face
              increasingly demanding challenges.
            </p>

          </div>

          <div class="page-heading-progress">

            <strong
              id="journeyProgress"
            ></strong>

            <span>
              levels cleared
            </span>

          </div>

        </section>

        <section class="map-card">

          <div id="map"></div>

        </section>

      </section>

      <!-- GAMEPLAY -->
      <section
        class="app-screen"
        id="gameplayScreen"
        hidden
      >

        <section class="game-topbar">

          <button
            id="backToJourney"
            class="back-button"
            type="button"
          >
            ← Journey
          </button>

          <div class="game-level-info">

            <span id="gameChapter"></span>

            <strong
              id="gameLevelName"
            ></strong>

          </div>

          <div
            class="game-mode"
            id="mode"
          ></div>

        </section>

        <section class="hud">

          <div>
            <small>XP</small>
            <b id="xp"></b>
          </div>

          <div>
            <small>COINS</small>
            <b id="coins"></b>
          </div>

          <div>
            <small>STREAK</small>
            <b id="streak"></b>
          </div>

          <div>
            <small>LIVES</small>
            <b id="lives"></b>
          </div>

          <button
            id="revive"
            class="revive-button"
            type="button"
          >
            ↻ Revive · 20 coins
          </button>

        </section>

        <section
          class="challenge"
          id="challenge"
        >

          <div class="challenge-head">

            <div>

              <span id="encounter"></span>

              <span id="skill"></span>

              <span id="subskill"></span>

            </div>

          </div>

          <div
            class="boss-banner"
            id="bossBanner"
            hidden
          >

            <div class="boss-mark">
              B
            </div>

            <div>

              <span class="boss-kicker">
                BOSS CHALLENGE
              </span>

              <strong id="bossName"></strong>

              <p>
                Prove your mastery.
                Your weaker skills are more likely to appear.
              </p>

            </div>

          </div>

          <div
            class="boss-meter"
            id="bossMeter"
            hidden
          >

            <div class="boss-meter-top">

              <span>
                Boss progress
              </span>

              <strong
                id="bossProgress"
              ></strong>

            </div>

            <div class="meter-track">

              <span
                id="bossFill"
              ></span>

            </div>

          </div>

          <div class="question">

            <p>
              Challenge
            </p>

            <h2 id="question"></h2>

          </div>

          <form id="form">

            <label for="answer">
              Your answer
            </label>

            <div class="answer-row">

              <input
                id="answer"
                type="number"
                inputmode="decimal"
                step="any"
                placeholder="Enter a number"
                autocomplete="off"
                required
              >

              <button type="submit">
                Solve
              </button>

            </div>

          </form>

          <div
            class="feedback"
            id="feedback"
            aria-live="polite"
          ></div>

          <div
            class="explanation"
            id="explanation"
            hidden
          >

            <div class="explanation-title">
              Why?
            </div>

            <p id="explanationText"></p>

          </div>

        </section>

        <section
          class="complete"
          id="complete"
          hidden
        >

          <p
            class="eyebrow"
            id="completeEyebrow"
          >
            LEVEL COMPLETE
          </p>

          <h2
            id="completeTitle"
          >
            Level cleared.
          </h2>

          <p
            id="completeText"
          ></p>

          <div
            class="level-up"
            id="levelUp"
            hidden
          >

            <span>
              NEXT
            </span>

            <strong
              id="nextLevelName"
            ></strong>

          </div>

          <button
            id="continueLevel"
            class="primary-button"
            type="button"
            hidden
          >
            Continue
          </button>

        </section>

      </section>

      <!-- DAILY -->
      <section
        class="app-screen"
        id="dailyScreen"
        hidden
      >

        <section class="daily-heading">

          <button
            id="exitDaily"
            class="back-button"
            type="button"
          >
            ← Home
          </button>

          <div>

            <p class="eyebrow">
              DAILY CHALLENGE
            </p>

            <h1>
              Today's Challenge
            </h1>

            <p>
              Five adaptive questions.
              Finish the run to claim
              your daily reward.
            </p>

          </div>

          <div class="daily-streak-box">

            <strong
              id="dailyStreak"
            ></strong>

            <span>
              day streak
            </span>

          </div>

        </section>

        <section class="daily-card">

          <div class="daily-progress-head">

            <span
              id="dailyProgressText"
            >
              QUESTION 1 OF 5
            </span>

            <strong
              id="dailyScore"
            >
              0 correct
            </strong>

          </div>

          <div class="daily-progress-track">

            <span
              id="dailyProgressFill"
            ></span>

          </div>

          <div class="daily-question-meta">

            <span
              id="dailySkill"
            ></span>

            <span
              id="dailySubskill"
            ></span>

          </div>

          <div class="question daily-question">

            <p>
              Today's Challenge
            </p>

            <h2
              id="dailyQuestion"
            ></h2>

          </div>

          <form id="dailyForm">

            <label for="dailyAnswer">
              Your answer
            </label>

            <div class="answer-row">

              <input
                id="dailyAnswer"
                type="number"
                inputmode="decimal"
                step="any"
                placeholder="Enter a number"
                autocomplete="off"
                required
              >

              <button type="submit">
                Solve
              </button>

            </div>

          </form>

          <div
            class="feedback"
            id="dailyFeedback"
            aria-live="polite"
          ></div>

          <div
            class="explanation"
            id="dailyExplanation"
            hidden
          >

            <div class="explanation-title">
              Why?
            </div>

            <p
              id="dailyExplanationText"
            ></p>

          </div>

        </section>

        <section
          class="daily-complete"
          id="dailyComplete"
          hidden
        >

          <div class="daily-complete-icon">
            ★
          </div>

          <p class="eyebrow">
            DAILY COMPLETE
          </p>

          <h2
            id="dailyCompleteTitle"
          ></h2>

          <p
            id="dailyCompleteText"
          ></p>

          <div class="daily-reward-row">

            <span
              id="dailyReward"
            ></span>

            <span
              id="dailyStreakReward"
            ></span>

          </div>

          <button
            id="dailyHomeButton"
            class="primary-button"
            type="button"
          >
            Return Home
          </button>

        </section>

      </section>

      <!-- PROFILE -->
      <section
        class="app-screen"
        id="profileScreen"
        hidden
      >

        <section class="identity-profile-card">

          <div
            class="identity-avatar"
            id="profileAvatar"
          >
            H
          </div>

          <div class="identity-profile-copy">

            <p class="eyebrow">
              YOUR IDENTITY
            </p>

            <h2
              id="profileName"
            >
              Explorer
            </h2>

            <strong
              id="profileTitle"
            >
              Number Explorer
            </strong>

            <span
              id="profileJoined"
            ></span>

          </div>

          <button
            id="editProfile"
            class="quiet"
            type="button"
          >
            Edit Name
          </button>

        </section>

        <section class="page-heading">

          <div>

            <p class="eyebrow">
              LEARNER PROFILE
            </p>

            <h1>
              Your Progress
            </h1>

            <p>
              Hisabati learns from your answers
              and adjusts future challenges around
              your strengths and weaknesses.
            </p>

          </div>

          <div class="profile-accuracy">

            <strong
              id="accuracy"
            ></strong>

            <span>
              overall accuracy
            </span>

          </div>

        </section>

        <section class="profile-summary">

          <article>
            <small>LEVEL</small>
            <strong
              id="profileLevel"
            ></strong>
            <span
              id="profileLevelName"
            ></span>
          </article>

          <article>
            <small>QUESTIONS</small>
            <strong
              id="profileQuestions"
            ></strong>
            <span>
              answered
            </span>
          </article>

          <article>
            <small>DAILY STREAK</small>
            <strong
              id="profileDailyStreak"
            ></strong>
            <span>
              days
            </span>
          </article>

          <article>
            <small>XP</small>
            <strong
              id="profileXP"
            ></strong>
            <span>
              experience earned
            </span>
          </article>

        </section>

        <section class="profile-card">

          <div class="section-head">

            <div>

              <p class="eyebrow">
                ADAPTIVE MASTERY
              </p>

              <h2>
                Your Skills
              </h2>

            </div>

          </div>

          <p class="profile-intro">
            Weaker areas receive more practice
            while stronger areas gradually become
            more demanding.
          </p>

          <div id="skills"></div>

        </section>

        <section class="profile-card">

          <div class="section-head">

            <div>

              <p class="eyebrow">
                NEXT REWARD
              </p>

              <h2
                id="reward"
              ></h2>

            </div>

            <div class="reward-icon">
              ★
            </div>

          </div>

          <p
            id="rewardText"
          ></p>

        </section>

      </section>

    </main>
  `;

  /*
   * NAVIGATION
   */

  root
    .querySelectorAll("[data-screen]")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          showScreen(
            root,
            game,
            button.dataset.screen
          );
        }
      );
    });

  /*
   * FIRST NAME SETUP
   */

  root
    .querySelector("#identityForm")
    .addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const input =
          root.querySelector(
            "#identityName"
          );

        const error =
          root.querySelector(
            "#identityError"
          );

        const saved =
          game.setProfile({
            name: input.value
          });

        if (!saved) {
          error.textContent =
            "Please enter a valid name.";

          error.hidden = false;

          input.focus();

          return;
        }

        error.hidden = true;

        root.querySelector(
          "#identityGate"
        ).hidden = true;

        update(
          root,
          game.view()
        );

        showScreen(
          root,
          game,
          "home"
        );
      }
    );

  /*
   * OPEN NAME EDITOR
   */

  root
    .querySelector("#editProfile")
    .addEventListener(
      "click",
      () => {
        const view =
          game.view();

        const currentName =
          view.state.profile?.name ??
          "";

        const input =
          root.querySelector(
            "#profileNameInput"
          );

        const error =
          root.querySelector(
            "#profileEditError"
          );

        input.value =
          currentName;

        error.hidden = true;

        root.querySelector(
          "#profileEditOverlay"
        ).hidden = false;

        requestAnimationFrame(
          () => {
            input.focus();
            input.select();
          }
        );
      }
    );

  /*
   * SAVE CHANGED NAME
   */

  root
    .querySelector("#profileEditForm")
    .addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const input =
          root.querySelector(
            "#profileNameInput"
          );

        const error =
          root.querySelector(
            "#profileEditError"
          );

        const saved =
          game.setProfile({
            name: input.value
          });

        if (!saved) {
          error.textContent =
            "Your name cannot be empty.";

          error.hidden = false;

          input.focus();

          return;
        }

        error.hidden = true;

        root.querySelector(
          "#profileEditOverlay"
        ).hidden = true;

        /*
         * IMPORTANT:
         * game.setProfile() emits a new view.
         * We explicitly refresh here as well so
         * the name is immediately visible.
         */

        update(
          root,
          game.view()
        );

        showScreen(
          root,
          game,
          currentScreen
        );
      }
    );

  /*
   * CANCEL NAME EDIT
   */

  root
    .querySelector(
      "#cancelProfileEdit"
    )
    .addEventListener(
      "click",
      () => {
        closeProfileEditor(
          root
        );
      }
    );

  root
    .querySelector(
      "#closeProfileEdit"
    )
    .addEventListener(
      "click",
      () => {
        closeProfileEditor(
          root
        );
      }
    );

  /*
   * CLOSE EDITOR WITH ESCAPE
   */

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        !root.querySelector(
          "#profileEditOverlay"
        ).hidden
      ) {
        closeProfileEditor(
          root
        );
      }
    }
  );

  /*
   * HOME
   */

  root
    .querySelector(
      "#continueJourney"
    )
    .addEventListener(
      "click",
      () => {
        showScreen(
          root,
          game,
          "gameplay"
        );
      }
    );

  root
    .querySelector(
      "#homeJourneyButton"
    )
    .addEventListener(
      "click",
      () => {
        showScreen(
          root,
          game,
          "journey"
        );
      }
    );

  root
    .querySelector(
      "#courseJourney"
    )
    .addEventListener(
      "click",
      () => {
        showScreen(
          root,
          game,
          "journey"
        );
      }
    );

  /*
   * GAMEPLAY
   */

  root
    .querySelector(
      "#backToJourney"
    )
    .addEventListener(
      "click",
      () => {
        showScreen(
          root,
          game,
          "journey"
        );
      }
    );

  root
    .querySelector(
      "#continueLevel"
    )
    .addEventListener(
      "click",
      () => {
        if (!game.stageComplete) {
          return;
        }

        const view =
          game.view();

        if (
          view.state.stage >=
          view.stageCount
        ) {
          showScreen(
            root,
            game,
            "journey"
          );

          return;
        }

        game.continue();

        showScreen(
          root,
          game,
          "gameplay"
        );
      }
    );

  /*
   * DAILY
   */

  root
    .querySelector(
      "#startDaily"
    )
    .addEventListener(
      "click",
      () => {
        const started =
          game.startDaily();

        if (
          started ||
          game.view().state.daily.completed
        ) {
          showScreen(
            root,
            game,
            "daily"
          );
        }
      }
    );

  root
    .querySelector(
      "#exitDaily"
    )
    .addEventListener(
      "click",
      () => {
        if (
          game.view().mode ===
          "daily"
        ) {
          game.exitDaily();
        }

        showScreen(
          root,
          game,
          "home"
        );
      }
    );

  root
    .querySelector(
      "#dailyHomeButton"
    )
    .addEventListener(
      "click",
      () => {
        game.exitDaily();

        showScreen(
          root,
          game,
          "home"
        );
      }
    );

  /*
   * NORMAL ANSWER
   */

  root
    .querySelector("#form")
    .addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const input =
          root.querySelector(
            "#answer"
          );

        const result =
          game.answer(
            input.value
          );

        if (
          result.type ===
          "invalid"
        ) {
          feedback(
            root,
            "#feedback",
            result.message,
            "error"
          );

          return;
        }

        feedback(
          root,
          "#feedback",
          result.message,
          result.type ===
            "correct"
            ? "success"
            : "error"
        );

        input.value = "";

        update(
          root,
          game.view()
        );

        showExplanation(
          root,
          result,
          "#explanation",
          "#explanationText"
        );

        if (
          !game.stageComplete
        ) {
          input.focus();
        }
      }
    );

  /*
   * DAILY ANSWER
   */

  root
    .querySelector(
      "#dailyForm"
    )
    .addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const input =
          root.querySelector(
            "#dailyAnswer"
          );

        const result =
          game.answer(
            input.value
          );

        if (
          result.type ===
          "invalid"
        ) {
          feedback(
            root,
            "#dailyFeedback",
            result.message,
            "error"
          );

          return;
        }

        feedback(
          root,
          "#dailyFeedback",
          result.message,
          result.type ===
            "correct"
            ? "success"
            : "error"
        );

        input.value = "";

        update(
          root,
          game.view()
        );

        showExplanation(
          root,
          result,
          "#dailyExplanation",
          "#dailyExplanationText"
        );

        if (
          !game.view()
            .state
            .daily
            .completed
        ) {
          input.focus();
        }
      }
    );

  /*
   * NEW JOURNEY
   */

  root
    .querySelector("#restart")
    .addEventListener(
      "click",
      () => {
        if (
          confirm(
            "Start a new journey? Your saved progress will be erased."
          )
        ) {
          game.restart();

          showScreen(
            root,
            game,
            "home"
          );
        }
      }
    );

  /*
   * REVIVE
   */

  root
    .querySelector("#revive")
    .addEventListener(
      "click",
      () => {
        const before =
          game.view();

        game.revive();

        const after =
          game.view();

        if (
          after.state.lives >
          before.state.lives
        ) {
          feedback(
            root,
            "#feedback",
            "Revived! Your hearts have been restored.",
            "success"
          );
        } else {
          feedback(
            root,
            "#feedback",
            "You need 20 coins and fewer than 3 hearts to revive.",
            "error"
          );
        }

        update(
          root,
          after
        );
      }
    );

  /*
   * INITIAL STATE
   */

  const initialView =
    game.view();

  update(
    root,
    initialView
  );

  if (
    initialView.hasProfile
  ) {
    root.querySelector(
      "#identityGate"
    ).hidden = true;

    showScreen(
      root,
      game,
      "home"
    );
  } else {
    root.querySelector(
      "#identityGate"
    ).hidden = false;

    showScreen(
      root,
      game,
      "home"
    );

    requestAnimationFrame(
      () => {
        root
          .querySelector(
            "#identityName"
          )
          ?.focus();
      }
    );
  }
}

export function update(
  root,
  view
) {
  updateHome(
    root,
    view
  );

  updateGameplay(
    root,
    view
  );

  updateDaily(
    root,
    view
  );

  renderMap(
    root,
    view
  );

  renderProfile(
    root,
    view
  );
}

function closeProfileEditor(
  root
) {
  root.querySelector(
    "#profileEditOverlay"
  ).hidden = true;
}

function showScreen(
  root,
  game,
  screen
) {
  currentScreen =
    screen;

  const screens = {
    home:
      root.querySelector(
        "#homeScreen"
      ),

    journey:
      root.querySelector(
        "#journeyScreen"
      ),

    gameplay:
      root.querySelector(
        "#gameplayScreen"
      ),

    daily:
      root.querySelector(
        "#dailyScreen"
      ),

    profile:
      root.querySelector(
        "#profileScreen"
      )
  };

  Object.entries(
    screens
  ).forEach(
    ([name, element]) => {
      element.hidden =
        name !== screen;
    }
  );

  root
    .querySelectorAll(
      "[data-screen]"
    )
    .forEach(
      (button) => {
        button.classList.toggle(
          "active",
          button.dataset.screen ===
            screen
        );
      }
    );

  if (
    screen ===
    "gameplay"
  ) {
    root
      .querySelectorAll(
        "[data-screen]"
      )
      .forEach(
        (button) =>
          button.classList.remove(
            "active"
          )
      );

    root
      .querySelector(
        "#answer"
      )
      ?.focus();
  }

  if (
    screen ===
    "daily"
  ) {
    root
      .querySelectorAll(
        "[data-screen]"
      )
      .forEach(
        (button) =>
          button.classList.remove(
            "active"
          )
      );

    if (
      !game.view()
        .state
        .daily
        .completed
    ) {
      root
        .querySelector(
          "#dailyAnswer"
        )
        ?.focus();
    }
  }
}

function updateHome(
  root,
  view
) {
  const stage =
    view.stage;

  const name =
    view.state.profile?.name?.trim();

  const displayName =
    name || "Explorer";

  root.querySelector(
    "#homeWelcome"
  ).textContent =
    name
      ? `WELCOME BACK, ${displayName.toUpperCase()}`
      : "WELCOME TO HISABATI";

  root.querySelector(
    "#homeGreeting"
  ).innerHTML =
    name
      ? `Continue your<br>mathematical journey.`
      : `Begin your<br>mathematical journey.`;

  const total =
    view.stageCount ??
    ARITHMETIC_LEVELS.length;

  const completed =
    Math.max(
      0,
      stage.id - 1
    );

  const progress =
    Math.min(
      100,
      (completed / total) *
        100
    );

  root.querySelector(
    "#homeChapter"
  ).textContent =
    `CHAPTER ${stage.chapter} · ${stage.chapterName}`;

  root.querySelector(
    "#homeLevelName"
  ).textContent =
    stage.name;

  root.querySelector(
    "#homeLevelDescription"
  ).textContent =
    stage.desc ?? "";

  root.querySelector(
    "#homeLevelNumber"
  ).textContent =
    stage.id;

  root.querySelector(
    "#homeProgressFill"
  ).style.width =
    `${progress}%`;

  root.querySelector(
    "#homeProgressText"
  ).textContent =
    `Level ${stage.id} of ${total}`;

  root.querySelector(
    "#homeXP"
  ).textContent =
    Math.floor(
      view.state.xp
    );

  const xpRemaining =
    Math.max(
      0,
      view.xpTarget -
        Math.floor(
          view.state.xp
        )
    );

  root.querySelector(
    "#homeXPLabel"
  ).textContent =
    xpRemaining
      ? `${xpRemaining} XP to next reward`
      : "Reward ready";

  root.querySelector(
    "#homeCoins"
  ).textContent =
    view.state.coins;

  root.querySelector(
    "#homeStreak"
  ).textContent =
    view.state.streak;

  root.querySelector(
    "#homeLives"
  ).textContent =
    "♥".repeat(
      view.state.lives
    ) +
    "♡".repeat(
      Math.max(
        0,
        3 -
          view.state.lives
      )
    );

  root.querySelector(
    "#homeLivesLabel"
  ).textContent =
    view.state.lives === 3
      ? "Full hearts."
      : `${view.state.lives} hearts remaining.`;

  root.querySelector(
    "#homeReward"
  ).textContent =
    xpRemaining
      ? `${xpRemaining} XP to reward`
      : "Reward ready";

  root.querySelector(
    "#homeRewardText"
  ).textContent =
    view.isBoss
      ? "Defeat the boss to earn the larger reward."
      : "Clear the level to earn bonus coins and advance.";

  root.querySelector(
    "#homeCourseProgress"
  ).textContent =
    `Level ${stage.id} of ${total}`;

  const dailyDone =
    view.state.daily.completed;

  const dailyButton =
    root.querySelector(
      "#startDaily"
    );

  const dailyTitle =
    root.querySelector(
      "#dailyHomeTitle"
    );

  const dailyText =
    root.querySelector(
      "#dailyHomeText"
    );

  if (dailyDone) {
    dailyTitle.textContent =
      "Today's challenge complete.";

    dailyText.textContent =
      `${view.state.daily.correct}/${DAILY_TOTAL} correct · ${view.state.daily.streak} day streak. Come back tomorrow for a new run.`;

    dailyButton.textContent =
      "Completed Today";

    dailyButton.disabled =
      true;
  } else {
    dailyTitle.textContent =
      "Five questions. One daily run.";

    dailyText.textContent =
      `Complete today's adaptive challenge for bonus XP and coins. Current streak: ${view.state.daily.streak} days.`;

    dailyButton.textContent =
      "Start Daily Challenge";

    dailyButton.disabled =
      false;
  }
}

function updateGameplay(
  root,
  view
) {
  const stage =
    view.stage;

  root.querySelector(
    "#gameChapter"
  ).textContent =
    `CHAPTER ${stage.chapter} · ${stage.chapterName}`;

  root.querySelector(
    "#gameLevelName"
  ).textContent =
    stage.name;

  root.querySelector(
    "#xp"
  ).textContent =
    `${Math.floor(view.state.xp)} / ${view.xpTarget}`;

  root.querySelector(
    "#coins"
  ).textContent =
    view.state.coins;

  root.querySelector(
    "#streak"
  ).textContent =
    view.state.streak;

  root.querySelector(
    "#lives"
  ).textContent =
    "♥".repeat(
      view.state.lives
    ) +
    "♡".repeat(
      Math.max(
        0,
        3 -
          view.state.lives
      )
    );

  const revive =
    root.querySelector(
      "#revive"
    );

  revive.disabled =
    view.state.lives >= 3 ||
    view.state.coins <
      REVIVE_COST ||
    view.stageComplete;

  revive.textContent =
    view.state.lives >= 3
      ? "♥ Full Hearts"
      : view.state.coins <
          REVIVE_COST
        ? "↻ Revive · Need 20 coins"
        : "↻ Revive · 20 coins";

  const round =
    Math.min(
      view.encounterTarget,
      view.state.stageTotal + 1
    );

  root.querySelector(
    "#encounter"
  ).textContent =
    view.isBoss
      ? `BOSS ROUND ${round} / ${view.encounterTarget}`
      : `ENCOUNTER ${view.state.encounter} / ${view.encounterTarget}`;

  root.querySelector(
    "#skill"
  ).textContent =
    view.question?.label ??
    "";

  root.querySelector(
    "#subskill"
  ).textContent =
    view.question?.subskill ??
    "";

  root.querySelector(
    "#question"
  ).textContent =
    view.question?.text ??
    "";

  root.querySelector(
    "#mode"
  ).textContent =
    view.isBoss
      ? "BOSS"
      : "ADVENTURE";

  const bossBanner =
    root.querySelector(
      "#bossBanner"
    );

  const bossMeter =
    root.querySelector(
      "#bossMeter"
    );

  bossBanner.hidden =
    !view.isBoss;

  bossMeter.hidden =
    !view.isBoss;

  if (
    view.isBoss
  ) {
    root.querySelector(
      "#bossName"
    ).textContent =
      stage.bossName;

    const percent =
      (
        Math.min(
          stage.bossQuestions,
          view.state.stageTotal
        ) /
        stage.bossQuestions
      ) * 100;

    root.querySelector(
      "#bossProgress"
    ).textContent =
      `${view.state.stageCorrect} / ${view.masteryTarget} correct`;

    root.querySelector(
      "#bossFill"
    ).style.width =
      `${percent}%`;
  }

  const complete =
    root.querySelector(
      "#complete"
    );

  complete.hidden =
    !view.stageComplete;

  if (
    view.stageComplete
  ) {
    const completed =
      view.completedStage ??
      stage;

    const boss =
      Boolean(
        completed.boss
      );

    root.querySelector(
      "#completeEyebrow"
    ).textContent =
      boss
        ? "BOSS DEFEATED"
        : "LEVEL COMPLETE";

    root.querySelector(
      "#completeTitle"
    ).textContent =
      boss
        ? `${completed.bossName ?? stage.bossName} defeated.`
        : `${completed.name} cleared.`;

    root.querySelector(
      "#completeText"
    ).textContent =
      view.state.stage >=
      view.stageCount
        ? "You have reached the current summit. Hisabati has recorded your progress."
        : "Your mastery has unlocked the next level.";

    const levelUp =
      root.querySelector(
        "#levelUp"
      );

    const continueButton =
      root.querySelector(
        "#continueLevel"
      );

    if (
      view.state.stage <
      view.stageCount
    ) {
      const nextLevel =
        ARITHMETIC_LEVELS.find(
          (level) =>
            level.id ===
            view.state.stage
        );

      levelUp.hidden =
        false;

      root.querySelector(
        "#nextLevelName"
      ).textContent =
        nextLevel
          ? `Level ${nextLevel.id} · ${nextLevel.name}`
          : `Level ${view.state.stage}`;

      continueButton.hidden =
        false;

      continueButton.textContent =
        "Continue to Next Level";
    } else {
      levelUp.hidden =
        true;

      continueButton.hidden =
        false;

      continueButton.textContent =
        "Return to Journey";
    }
  } else {
    root.querySelector(
      "#continueLevel"
    ).hidden =
      true;

    root.querySelector(
      "#levelUp"
    ).hidden =
      true;
  }
}

function updateDaily(
  root,
  view
) {
  const daily =
    view.state.daily;

  const completed =
    daily.completed;

  const answered =
    daily.total;

  const progress =
    Math.min(
      100,
      (answered /
        DAILY_TOTAL) *
        100
    );

  root.querySelector(
    "#dailyStreak"
  ).textContent =
    daily.streak;

  root.querySelector(
    "#dailyProgressText"
  ).textContent =
    completed
      ? "CHALLENGE COMPLETE"
      : `QUESTION ${Math.min(
          answered + 1,
          DAILY_TOTAL
        )} OF ${DAILY_TOTAL}`;

  root.querySelector(
    "#dailyScore"
  ).textContent =
    `${daily.correct} correct`;

  root.querySelector(
    "#dailyProgressFill"
  ).style.width =
    `${progress}%`;

  if (
    view.dailyQuestion
  ) {
    root.querySelector(
      "#dailyQuestion"
    ).textContent =
      view.dailyQuestion.text;

    root.querySelector(
      "#dailySkill"
    ).textContent =
      view.dailyQuestion.label;

    root.querySelector(
      "#dailySubskill"
    ).textContent =
      view.dailyQuestion.subskill;
  }

  const form =
    root.querySelector(
      "#dailyForm"
    );

  const complete =
    root.querySelector(
      "#dailyComplete"
    );

  const card =
    root.querySelector(
      ".daily-card"
    );

  if (completed) {
    form.hidden =
      true;

    card.classList.add(
      "is-complete"
    );

    complete.hidden =
      false;

    const perfect =
      daily.correct ===
      DAILY_TOTAL;

    root.querySelector(
      "#dailyCompleteTitle"
    ).textContent =
      perfect
        ? "Perfect run."
        : "Daily challenge complete.";

    root.querySelector(
      "#dailyCompleteText"
    ).textContent =
      `${daily.correct} of ${DAILY_TOTAL} correct. Your daily progress has been recorded.`;

    root.querySelector(
      "#dailyReward"
    ).textContent =
      perfect
        ? "+40 XP · +20 coins"
        : "+25 XP · +10 coins";

    root.querySelector(
      "#dailyStreakReward"
    ).textContent =
      `${daily.streak} day streak`;
  } else {
    form.hidden =
      false;

    card.classList.remove(
      "is-complete"
    );

    complete.hidden =
      true;
  }
}

function renderMap(
  root,
  view
) {
  const map =
    root.querySelector(
      "#map"
    );

  if (!map) {
    return;
  }

  map.innerHTML =
    "";

  const currentLevel =
    view.state.stage;

  const chapters = [];

  ARITHMETIC_LEVELS.forEach(
    (level) => {
      let chapter =
        chapters.find(
          (item) =>
            item.id ===
            level.chapter
        );

      if (!chapter) {
        chapter = {
          id:
            level.chapter,

          name:
            level.chapterName,

          levels: []
        };

        chapters.push(
          chapter
        );
      }

      chapter.levels.push(
        level
      );
    }
  );

  root.querySelector(
    "#journeyProgress"
  ).textContent =
    `${Math.max(
      0,
      currentLevel - 1
    )} / ${ARITHMETIC_LEVELS.length}`;

  chapters.forEach(
    (chapter) => {
      const section =
        document.createElement(
          "div"
        );

      section.className =
        "journey-chapter";

      const cleared =
        chapter.levels.filter(
          (level) =>
            level.id <
            currentLevel
        ).length;

      section.innerHTML = `
        <div class="journey-chapter-head">
          <span>
            Chapter ${chapter.id}
            · ${chapter.name}
          </span>

          <span>
            ${cleared}/${chapter.levels.length}
            cleared
          </span>
        </div>

        <div class="journey-levels"></div>
      `;

      const levels =
        section.querySelector(
          ".journey-levels"
        );

      chapter.levels.forEach(
        (level) => {
          const node =
            document.createElement(
              "div"
            );

          const isCleared =
            level.id <
            currentLevel;

          const isCurrent =
            level.id ===
            currentLevel;

          const isLocked =
            level.id >
            currentLevel;

          node.className =
            "journey-level";

          if (isCleared) {
            node.classList.add(
              "cleared"
            );
          }

          if (isCurrent) {
            node.classList.add(
              "current"
            );
          }

          if (isLocked) {
            node.classList.add(
              "locked"
            );
          }

          if (level.boss) {
            node.classList.add(
              "boss"
            );
          }

          const status =
            isCleared
              ? "CLEARED"
              : isCurrent
                ? level.boss
                  ? "CURRENT BOSS"
                  : "CURRENT"
                : level.boss
                  ? "BOSS"
                  : "LOCKED";

          node.innerHTML = `
            <div class="journey-level-number">
              ${level.boss ? "B" : level.id}
            </div>

            <span class="journey-level-name">
              ${level.name}
            </span>

            <span class="journey-status">
              ${status}
            </span>
          `;

          if (isCurrent) {
            node.addEventListener(
              "click",
              () => {
                showScreen(
                  root,
                  activeGame,
                  "gameplay"
                );
              }
            );
          }

          levels.appendChild(
            node
          );
        }
      );

      map.appendChild(
        section
      );
    }
  );
}

function renderProfile(
  root,
  view
) {
  const name =
    view.state.profile?.name?.trim() ||
    "Explorer";

  const initial =
    name
      .charAt(0)
      .toUpperCase();

  const createdAt =
    view.state.profile?.createdAt;

  root.querySelector(
    "#profileAvatar"
  ).textContent =
    initial;

  root.querySelector(
    "#profileName"
  ).textContent =
    name;

  root.querySelector(
    "#profileTitle"
  ).textContent =
    view.playerTitle;

  root.querySelector(
    "#profileJoined"
  ).textContent =
    createdAt
      ? `Journey started ${new Date(
          createdAt
        ).toLocaleDateString(
          undefined,
          {
            day: "numeric",
            month: "short",
            year: "numeric"
          }
        )}`
      : "Journey starting today";

  root.querySelector(
    "#accuracy"
  ).textContent =
    `${view.accuracy}%`;

  root.querySelector(
    "#profileLevel"
  ).textContent =
    view.state.stage;

  root.querySelector(
    "#profileLevelName"
  ).textContent =
    view.stage.name;

  root.querySelector(
    "#profileQuestions"
  ).textContent =
    Object.values(
      view.subskills
    ).reduce(
      (
        total,
        item
      ) =>
        total +
        (
          item.attempts ??
          0
        ),
      0
    );

  root.querySelector(
    "#profileDailyStreak"
  ).textContent =
    view.state.daily.streak;

  root.querySelector(
    "#profileXP"
  ).textContent =
    Math.floor(
      view.state.xp
    );

  renderSkills(
    root,
    view
  );

  const remaining =
    Math.max(
      0,
      view.xpTarget -
        Math.floor(
          view.state.xp
        )
    );

  root.querySelector(
    "#reward"
  ).textContent =
    remaining
      ? `${remaining} XP to reward`
      : "Reward ready";

  root.querySelector(
    "#rewardText"
  ).textContent =
    view.isBoss
      ? "Defeat the boss to earn the larger reward."
      : "Clear the level to earn bonus coins and advance.";
}

function renderSkills(
  root,
  view
) {
  const skills =
    root.querySelector(
      "#skills"
    );

  const grouped = {};

  Object.values(
    view.subskills
  ).forEach(
    (item) => {
      (
        grouped[item.skill] ??=
        []
      ).push(item);
    }
  );

  skills.innerHTML =
    Object.entries(
      grouped
    )
      .map(
        ([name, items]) => {
          const overall =
            Math.round(
              (
                items.reduce(
                  (
                    sum,
                    item
                  ) =>
                    sum +
                    item.level,
                  0
                ) /
                (
                  items.length *
                  8
                )
              ) *
                100
            );

          const label =
            name
              .charAt(0)
              .toUpperCase() +
            name.slice(1);

          const rows =
            items
              .map(
                (item) => {
                  const percent =
                    Math.round(
                      (
                        item.level /
                        8
                      ) *
                        100
                    );

                  const accuracy =
                    item.attempts
                      ? Math.round(
                          (
                            item.correct /
                            item.attempts
                          ) *
                            100
                        )
                      : null;

                  return `
                    <div class="subskill">

                      <span>
                        ${item.name}
                      </span>

                      <i>
                        <em
                          style="width:${percent}%"
                        ></em>
                      </i>

                      <b>
                        ${
                          accuracy ===
                          null
                            ? "New"
                            : `${accuracy}%`
                        }
                      </b>

                    </div>
                  `;
                }
              )
              .join("");

          return `
            <div class="skill-group">

              <div class="skill-group-head">
                <strong>
                  ${label}
                </strong>

                <span>
                  ${overall}%
                </span>
              </div>

              ${rows}

            </div>
          `;
        }
      )
      .join("");
}

function feedback(
  root,
  selector,
  message,
  type
) {
  const element =
    root.querySelector(
      selector
    );

  element.textContent =
    message;

  element.className =
    `feedback ${type}`;
}

function showExplanation(
  root,
  result,
  boxSelector,
  textSelector
) {
  const box =
    root.querySelector(
      boxSelector
    );

  const text =
    root.querySelector(
      textSelector
    );

  if (
    !result.explanation
  ) {
    box.hidden =
      true;

    return;
  }

  text.textContent =
    result.explanation;

  box.hidden =
    false;
}

export function gameIsActive() {
  return Boolean(
    activeGame
  );
}