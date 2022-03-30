/**
 * This macro is used to manage the different masks a changeling character might have. It does NOT
 * change any information on the character sheet. To see which mask you are currently wearing, you
 * need to invoke this macro and a summary will be displayed.
 */

/**
 * You can define any number of masks here. While the JavaScript syntax might be irksome to some,
 * it is simple enough that I don't see the use in having anything more complex.
 *
 * Be careful not to use the same name for two different masks. The name is used as an identifier.
 *
 * One of the masks MUST be your default mask by setting `isDefault` to `true`. Only the first
 * default mask will be considered when determining the default mask.
 */
const masks = [
  {
    name: "John Doe",
    race: "Human",
    age: 20,
    description: "A great description",
    eyes: "Brown",
    gender: "Male",
    hair: "Black",
    height: `5' 4"`,
    skin: "Pale",
    weight: 140,
    isDefault: true,
  },
  {
    name: "Jane Doe",
    race: "Elf",
    age: 20,
    description: "A better description",
    eyes: "Brown",
    gender: "Female",
    hair: "Black",
    height: `5' 4"`,
    skin: "Pale",
    weight: 155,
  },
];

const selectMask = (mask) => {
  window.localStorage.setItem(storageKey, JSON.stringify(mask));
  ui.notifications.info(`You are now ${mask.name}!`);
};

const pickMaskDialog = new Dialog({
  title: "Select a mask",
  content: `
    <h2>Your masks</h2>
    <form class="flexcol">
      <div class="form-group">
        <label>Available Masks</label>
        <select>
          <option disabled selected> -- Choose a mask -- </option>
          ${masks.map(
            (mask) =>
              `<option value="${mask.name}">${mask.name} (${mask.age} yrs. old ${mask.gender} ${mask.race})</option>`
          )}
        </select>
      </div>
    </form>`,
  buttons: {
    choose: {
      label: "Confirm",
      icon: "<i class='fas fa-user'></i>",
      callback: (html) => {
        const selectedMask = masks.find(
          (mask) => mask.name === $(html).find(":selected").val()
        );

        selectedMask
          ? selectMask(selectedMask)
          : ui.notifications.error(`No mask selected`);
      },
    },
    cancel: {
      label: "Cancel",
      icon: "<i class='fas fa-ban'></i>",
    },
  },
});

const storageKey = "fvtt-changeling-masks";
const defaultMask = masks.find((mask) => mask.isDefault);
const currentMask =
  JSON.parse(window.localStorage.getItem(storageKey)) || defaultMask;

new Dialog({
  title: "Change Mask",
  content: `
    <h2>You currently wear ${currentMask.name}'s mask.</h2>
    <p>A ${
      currentMask.age
    } years old ${currentMask.gender.toLowerCase()} ${currentMask.race.toLowerCase()} with ${currentMask.eyes.toLowerCase()} eyes, ${currentMask.hair.toLowerCase()} hair and ${currentMask.skin.toLowerCase()} skin.</p>
    <p>They weight ${currentMask.weight} pounds and mesure ${
    currentMask.height
  }.</p>
    <p>${currentMask.description}</p>
  `,
  buttons: {
    default: {
      label: defaultMask.name,
      callback: () => {
        selectMask(defaultMask);
      },
      icon: "<i class='fas fa-user'></i>",
    },
    random: {
      label: "Pick",
      icon: "<i class='fas fa-check'></i>",
      callback: () => pickMaskDialog.render(true),
    },
    cancel: {
      label: "Cancel",
      icon: "<i class='fas fa-ban'></i>",
    },
  },
  default: "default",
}).render(true);
