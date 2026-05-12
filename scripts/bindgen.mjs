import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const didTarget = resolve(root, "src/backend/dist/backend.did");
const wasmTarget = resolve(root, "src/backend/dist/backend.wasm");
const legacyDidTarget = resolve(root, "src/backend/main.did");
const frontendIdlSource = resolve(root, "src/frontend/src/declarations/backend.did.js");
const frontendIdlTarget = resolve(root, "src/frontend/src/backend-idl.ts");
const didFallbackSource = resolve(root, "src/backend/.mops/.build/backend.did");
const wasmFallbackSource = resolve(root, "src/backend/.mops/.build/backend.wasm");

function ensureParent(path) {
  mkdirSync(dirname(path), { recursive: true });
}

const didSource = existsSync(didTarget)
  ? didTarget
  : existsSync(didFallbackSource)
    ? didFallbackSource
    : didTarget;
const wasmSource = existsSync(wasmTarget)
  ? wasmTarget
  : existsSync(wasmFallbackSource)
    ? wasmFallbackSource
    : wasmTarget;

if (!existsSync(didSource)) {
  console.error("Missing backend.did. Build the backend before running bindgen.");
  process.exit(1);
}

ensureParent(didTarget);
if (didSource !== didTarget) {
  copyFileSync(didSource, didTarget);
}
ensureParent(legacyDidTarget);
if (didSource !== legacyDidTarget) {
  copyFileSync(didSource, legacyDidTarget);
}

if (existsSync(wasmSource)) {
  ensureParent(wasmTarget);
  if (wasmSource !== wasmTarget) {
    copyFileSync(wasmSource, wasmTarget);
  }
}

if (existsSync(frontendIdlSource)) {
  ensureParent(frontendIdlTarget);
  copyFileSync(frontendIdlSource, frontendIdlTarget);
}

console.log("Synced backend DID/Wasm and preserved the checked-in frontend bindings.");
