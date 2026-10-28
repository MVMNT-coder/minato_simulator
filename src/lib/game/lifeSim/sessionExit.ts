// ============================================================
// sessionExit — セッションを離脱する瞬間の競合を防ぐための小さなフラグ。
// reset() は phase を "name_entry" に戻すため、離脱中の一瞬だけ
// useSimSync の phase→route 補正(router.replace)が発火し、
// こちらの router.push("/") と競合して /sim へ戻されてしまうことがある。
// 離脱直前にこのフラグを立てて、その一瞬だけ補正を止める。
// ============================================================
let leaving = false;

export function markSessionLeaving() {
  leaving = true;
}

export function clearSessionLeaving() {
  leaving = false;
}

export function isSessionLeaving() {
  return leaving;
}
