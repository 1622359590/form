export const contactDetails = Object.freeze({
  email: "huanglb118@gmail.com",
  name: "Huang Libo",
  title: "Director",
  company: "联广科技 × 贵真科技",
  address: "上海市崇明区庙镇宏海公路2050号（上海庙镇经济开发区）",
  timezone: "Asia/Shanghai",
  meetingMinutes: 30,
});

export function buildMailto({ subject, body }) {
  return `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const actionLinks = Object.freeze({
  requestDeck: buildMailto({
    subject: "Request for the Lianguang Technology full deck",
    body: "Hello Huang Libo,\n\nI would like to request a copy of the full presentation deck.\n\nThank you.",
  }),
  contact: "#contact",
  schedule: "#booking",
  requestBp: buildMailto({
    subject: "Request for the Lianguang Technology full business plan",
    body: "Hello Huang Libo,\n\nI would like to request a copy of the full business plan when it is available.\n\nThank you.",
  }),
});

export function getShanghaiDateInputValue(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: contactDetails.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function validateMeetingRequest(
  values,
  today = getShanghaiDateInputValue(),
) {
  if (!values.name.trim()) return "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    return "Enter a valid reply email.";
  }
  if (!values.date) return "Choose a preferred date.";
  if (values.date < today) return "Choose today or a future date.";
  if (!/^\d{2}:\d{2}$/.test(values.time)) return "Choose a preferred time.";
  if (!new Set(["online", "in-person"]).has(values.format)) {
    return "Choose a meeting format.";
  }
  return null;
}

export function buildMeetingRequest(values) {
  const inPerson = values.format === "in-person";
  const format = inPerson ? "In person · Shanghai Chongming" : "Online";
  const location = inPerson
    ? contactDetails.address
    : "Online link to be confirmed";
  const topic = values.topic.trim() || "Not specified";
  const subject = `Meeting request — ${values.date} ${values.time} — ${values.name.trim()}`;
  const body = [
    `Hello ${contactDetails.name},`,
    "",
    `I would like to request a ${contactDetails.meetingMinutes}-minute meeting.`,
    "",
    `Name: ${values.name.trim()}`,
    `Reply email: ${values.email.trim()}`,
    `Preferred date: ${values.date}`,
    `Preferred time: ${values.time} (${contactDetails.timezone})`,
    `Duration: ${contactDetails.meetingMinutes} minutes`,
    `Format: ${format}`,
    `Location: ${location}`,
    `Topic: ${topic}`,
    "",
    "Please confirm whether this time works.",
  ].join("\n");

  return {
    href: buildMailto({ subject, body }),
    text: `To: ${contactDetails.email}\nSubject: ${subject}\n\n${body}`,
  };
}
