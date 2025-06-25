// utils/eventUtils.js
import moment from "moment";
import { Event } from "../models/event.model.js";

export async function getMostPopularFutureEvent() {
  const today = moment();
  const events = await Event.find().sort({ likesCount: -1 }).lean();

  const futureEvents = events.filter((event) =>
    event.dates.some((dateStr) => {
      const date = moment(dateStr, "DD/MM/YYYY");
      return date.isSameOrAfter(today, "day");
    })
  );

  return futureEvents.length > 0 ? futureEvents[0] : null;
}
