"use strict";
import { addListeners } from './utils.js';

// A function that takes a resource name string as the argument and updates
// that resource's value in the resource amounts object by its value in the
// gather rates object.  It then updates the counter that the player sees.
function gather(resource_name) {
    ResourceAmounts[resource_name] += GatherRates[resource_name];
    ResourceCounters[resource_name].innerText = 
      `${ResourceAmounts[resource_name]}`;
};

const GatherRateLimit = 300; // milliseconds between allowed gathers
const GatherCooldowns = {};
const GatherIntervals = {};

/* Create a list of strings of resource types, then iterate over them to
 initialize objects that hold the resource amounts, gather rates, ui
 counter elements, and gather buttons, then creates click event listeners for
 those gather buttons.  */
const resource_types = [
  'water',
]



const ResourceAmounts = {};
const GatherRates = {};
const ResourceCounters = {};
const ResourceButtons = {};

for (const resource_type of resource_types) {
  ResourceAmounts[resource_type] = 0;
  GatherRates[resource_type] = 1;
  ResourceCounters[resource_type] = 
    document.getElementById(`${resource_type}-counter`);
  ResourceButtons[resource_type] = 
    document.getElementById(`gather-${resource_type}-button`);

  // Note:  Due to closure, each iteration (resource) has its own canGather.
  let canGather = true;

  /* Function to limit clicking speed.  Autoclicker software often breaks
  these games.  After gathering, canGather is set to false.  An arrow
  function is then set to occur after a certain time (GatherRateLimit)
  that sets canGather back to true.*/
  function tryGather() {
    if (canGather) {
      gather(resource_type);
      canGather = false;
      setTimeout(
        () => { canGather = true; }, 
        GatherRateLimit
      );
    }
  }
  ResourceButtons[resource_type].addEventListener("click", () => tryGather());

  /* Add ability to gather by holding down click or touch by setting an interval
    to tryGather on holding, then clearing the interval when releasing. */
  addListeners(
    ResourceButtons[resource_type],
    ["mousedown","touchstart"],
    () => {GatherIntervals[resource_type] = setInterval(tryGather, 50);},
  )
  addListeners(
    ResourceButtons[resource_type],
    ["mouseup","mouseleave","touchend","touchcancel"],
    () => {clearInterval(GatherIntervals[resource_type]);},
  )
};

