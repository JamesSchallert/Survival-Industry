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

const GatherRateLimit = 90; // milliseconds between allowed gathers
const GatherCooldowns = {};
let gather_interval = null;

/* Create a list of strings of resource types, then iterate over them to
 initialize objects that hold the resource amounts, gather rates, ui
 counter elements, and gather buttons, then creates event listeners for
 those gather buttons.  */
const resource_types = [
  'water',
];



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

  

  /* Function to limit clicking speed.  Autoclicker software often breaks
  these games.  After gathering, canGather is set to false.  An arrow
  function is then set to occur after a certain time (GatherRateLimit)
  that sets canGather back to true.*/

  // Note:  Due to closure, each iteration (resource) has its own canGather.
  let canGather = true;

  function tryGather() {
    if (canGather) {
      gather(resource_type);
      canGather = false;
      setTimeout(
        () => { canGather = true; }, 
        GatherRateLimit
      );
    };
  };
  ResourceButtons[resource_type].addEventListener("click", () => tryGather());

  /* Add ability to gather by holding down click or touch by setting an interval
    to tryGather on holding, then clearing the interval when releasing. */
  addListeners(
    ResourceButtons[resource_type],
    ["mousedown","touchstart"],
    () => {
      if (!(gather_interval)) {
        gather_interval = setInterval(tryGather, 50);
      };
    },
  );
  addListeners(
    ResourceButtons[resource_type],
    ["mouseup","mouseleave","touchend","touchcancel","contextmenu",],
    () => {
      clearInterval(gather_interval);
      gather_interval = null;
    },
  );  
};

// Clear any gather_interval running if the window loses focus or any other
// scenario that makes sense.  A sort of catch-all to clean up gather_interval.
addListeners(
  window,
  ["mouseup","mouseleave","touchend","touchcancel","contextmenu","blur"],
  () => {
    clearInterval(gather_interval);
    gather_interval = null;
  },
);

//debug code, can remove later, but useful to have ready to go.
// window.addEventListener("blur", () => console.log("Window blurred"));
// window.addEventListener("contextmenu", () => 
//   console.log("Context menu fired"));
// window.addEventListener("mouseup", () => console.log("Mouse up"));
// window.addEventListener("mousedown", () => console.log("Mousedown"));