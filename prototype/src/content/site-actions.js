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
