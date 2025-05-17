// Utilities for export
"use strict";

export function addListeners(element, eventTypes, handler) {
    eventTypes.forEach(e => element.addEventListener(e, handler));
}