"use strict";
import { addListeners } from './utils.js';

// A function that takes a resource name string as the argument and updates
// that resource's value in the resource amounts object by its value in the
// gather rates object.  It then updates the counter that the player sees.
function gather(resourceType) {
    ResourceAmounts[resourceType] += GatherRates[resourceType];
    ResourceCounters[resourceType].innerText = 
      `${ResourceAmounts[resourceType]}`;
};

/* Function to limit clicking speed.  Autoclicker software often breaks
  these games.  Before gathering, global canGather is set to false.  An arrow
  function is then set to occur after a certain time (GatherRateLimit)
  that sets canGather back to true.*/
function tryGather(resourceType) {
  if (canGather) {
    canGather = false;
    gather(resourceType);
    setTimeout(
      () => { canGather = true; }, 
      GatherRateLimit
    );
  };
};

const GatherRateLimit = 90; // milliseconds between allowed gathers
let gatherInterval = null;
let canGather = true;

/* Create a list of strings of resource types, then iterate over them to
 initialize objects that hold the resource amounts, gather rates, ui
 counter elements, and gather buttons, then creates event listeners for
 those gather buttons.  */
const resourceTypes = [
  'water',
];

const ResourceAmounts = {};
const GatherRates = {};
const ResourceCounters = {};
const ResourceButtons = {};

for (const resourceType of resourceTypes) {
  ResourceAmounts[resourceType] = 0;
  GatherRates[resourceType] = 1;
  ResourceCounters[resourceType] = 
    document.getElementById(`${resourceType}-counter`);
  ResourceButtons[resourceType] = 
    document.getElementById(`gather-${resourceType}-button`);

  /* Add ability to gather resources by clicking */ 
  ResourceButtons[resourceType].addEventListener(
    "click",
    () => tryGather(resourceType)
  );

  /* Add ability to gather by holding down click or touch by setting an interval
    to tryGather on holding, then clearing the interval when releasing. */
  addListeners(
    ResourceButtons[resourceType],
    ["mousedown","touchstart"],
    () => {
      if (!(gatherInterval)) {
        gatherInterval = setInterval(() => tryGather(resourceType), 50);
      };
    },
  );
  addListeners(
    ResourceButtons[resourceType],
    ["mouseup","mouseleave","touchend","touchcancel","contextmenu",],
    () => {
      clearInterval(gatherInterval);
      gatherInterval = null;
    },
  );  
};

// Clear any gatherInterval running if the window loses focus or any other
// scenario that makes sense.  A sort of catch-all to clean up gatherInterval.
addListeners(
  window,
  ["mouseup","mouseleave","touchend","touchcancel","contextmenu","blur"],
  () => {
    clearInterval(gatherInterval);
    gatherInterval = null;
  },
);

//debug code, can remove later, but useful to have ready to go.
// window.addEventListener("blur", () => console.log("Window blurred"));
// window.addEventListener("contextmenu", () => 
//   console.log("Context menu fired"));
// window.addEventListener("mouseup", () => console.log("Mouse up"));
// window.addEventListener("mousedown", () => console.log("Mousedown"));