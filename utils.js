import asciiText from "ascii-text-generator";

/**
 * converts number into a fancy time format
 * @param {number} duration
 */
export function timeModifier(duration) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + "h " + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + "m " + (secs < 10 ? "0" : "");
  ret += "" + secs + "s";
  return ret;
}

export const fancyTimeFormat = (duration) =>
  asciiText(timeModifier(duration), "2");
