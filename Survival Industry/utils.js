// Utilities for export
"use strict";

export function addListeners(element, eventTypes, handler) {
    eventTypes.foreach(e => element.addEventListener(e, handler));
}