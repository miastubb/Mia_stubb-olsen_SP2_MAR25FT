/**
 * Returns the highest bid amount from a collection of bids.
 *
 * @param {Array<{ amount?: number }>} [bids=[]] - Auction bids to inspect.
 * @returns {number} Highest bid amount, or 0 when there are no valid bids.
 */
export function getCurrentBid(bids = []) {
  return bids.reduce((highestBid, bid) => {
    return Math.max(highestBid, Number(bid.amount) || 0);
  }, 0);
}

/**
 * Formats the remaining auction duration as hours, minutes, and seconds.
 *
 * @param {string} endsAt - ISO date when the auction ends.
 * @returns {string} Time formatted as `HH:MM:SS`, or `ENDED`.
 */
export function formatTimeRemaining(endsAt) {
  const remainingTime = new Date(endsAt).getTime() - Date.now();

  if (Number.isNaN(remainingTime) || remainingTime <= 0) {
    return "ENDED";
  }

  const totalSeconds = Math.floor(remainingTime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

/**
 * Determines whether an auction has ended or is ending within 24 hours.
 *
 * @param {string} endsAt - ISO date when the auction ends.
 * @returns {"ENDED" | "ENDING" | ""} Current auction status.
 */
export function getAuctionStatus(endsAt) {
  const remainingTime = new Date(endsAt).getTime() - Date.now();

  if (remainingTime <= 0) {
    return "ENDED";
  }

  if (remainingTime <= 24 * 60 * 60 * 1000) {
    return "ENDING";
  }

  return "";
}
