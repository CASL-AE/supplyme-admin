/*
 * Is mobile or tablet?
 *
 * @return {Boolean}
 */
export function isMobileAndTablet() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return true
  } else {
    return false
  }
  //return window.innerWidth <= 800 && window.innerHeight <= 600;
}
