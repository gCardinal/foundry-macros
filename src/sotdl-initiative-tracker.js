/**
 * Even though we're playing D&D5, we use a simple version of the Shadow of the Demon Lord's initiative system.
 * This macro helps in keeping track of which turn we currently are on. Could be a module, but, eh. This works fine!
 *
 * @see https://worldbuilderblog.me/2017/07/20/shadow-of-the-demon-lord-initiative-for-5e-take-two/
 */

const storageKey = "gy@currentTurn";

const turnTypes = [
  "💤 Player Fast Turn",
  "💤 Enemies Fast Turn",
  "🕐 Player Slow Turn",
  "🕐 Enemies Slow Turn",
];
const colors = ["#398AB9", "#EF6D6D", "#398AB9", "#EF6D6D"];

const getCurrentTurn = () => {
  return parseInt(window.sessionStorage.getItem(storageKey)) || 0;
};

const goToTurn = (turn) => {
  if (turn >= turnTypes.length) {
    turn = 0;
  }

  ChatMessage.create({
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    content:
      "<hr /><h2 style='text-align: center; color: " +
      colors[turn] +
      "'>" +
      turnTypes[turn] +
      "</h2>",
  });
};

const persistCurrentTurn = () => {
  let currentTurn = getCurrentTurn() + 1;

  if (currentTurn >= turnTypes.length) {
    currentTurn = 0;
  }

  window.sessionStorage.setItem(storageKey, currentTurn);
};

const openDialog = () => {
  new Dialog({
    title: "Initiative Tracker",
    content: `<h1>We're currently on turn ${turnTypes[getCurrentTurn()]}</h1>`,
    buttons: {
      next: {
        label: "Next turn",
        callback: () => {
          goToTurn(getCurrentTurn() + 1);
          persistCurrentTurn();

          openDialog();
        },
        icon: "<i class='fas fa-dice-d20'></i>",
      },
      end: {
        label: "End Encounter",
        callback: () => {
          window.sessionStorage.removeItem(storageKey);

          ChatMessage.create({
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content:
              "<hr /><h2 style='text-align: center; opacity: 0.7'>Battle Finished!</h2>",
          });
        },
        icon: "<i class='fas fa-ban'></i>",
      },
    },
    close: () => {
      window.sessionStorage.removeItem(storageKey);
    },
  }).render(true);
};

goToTurn(getCurrentTurn());
openDialog();
