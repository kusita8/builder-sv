import { get } from "svelte/store";
import { ItemsStore } from "../stores/ItemsStore";
import { SelectedItemStore } from "../stores/SelectedItemStore";
import { StyleStore } from "../stores/StyleStore";
import selectedItemInput from "./selectedItemInput";

const isInput = (target) => {
  return target.closest("textarea") || target.closest("input");
};

window.addEventListener("keyup", (e) => {
  if (isInput(e.target)) return;

  const key = e.key;

  if (key === "Backspace") {
    // delete key pressed
    const selectedItem = get(SelectedItemStore);

    // there is a selected item
    if (selectedItem.id) {
      ItemsStore.delete(selectedItem);
      StyleStore.remove(selectedItem);
      selectedItemInput.remove(selectedItem);
    }
  }
});
