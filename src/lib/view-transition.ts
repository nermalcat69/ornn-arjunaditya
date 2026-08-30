// ponytail: no router view-transitions wired in this app, so this is a stub.
// If page transitions are added later, fire `cb(true)` on start and `cb(false)`
// on finish so the canvas pauses during the transition.
export function onTransitionChange(_cb: (active: boolean) => void): () => void {
  return () => {};
}
