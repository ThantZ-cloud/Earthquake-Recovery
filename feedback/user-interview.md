# User Interview — Earthquake & Recovery App

**Date:** July 10, 2026
**Interviewer:** Thant Zin Htun
**User:** Aung Myo (friend, UTYCC student, Myanmar)
**Device:** Android phone (Chrome browser)
**Duration:** ~15 minutes

---

## Context

Aung Myo is a third-year IT student at UTYCC who lives in Mandalay. He has experienced minor earthquakes before and follows Myanmar earthquake news on social media. He had not seen the app before this interview.

---

## Task 1: Open the app and find the earthquake map

**What happened:**
- Opened the live URL on his phone
- Map loaded in about 3 seconds
- He immediately noticed the colored circles and started scrolling around

**His words:**
> "Oh cool, it shows real earthquakes. I can see the ones near Mandalay."

**Issue found:** He tried to tap a small green circle and nothing happened — the marker was too small on mobile. After zooming in, tapping worked.

**Verdict:** ✅ Core feature works well. Small markers need better tap targets on mobile.

---

## Task 2: Check if there are dams near fault lines

**What happened:**
- He noticed the triangle markers (dams) but didn't know what they were
- After I explained, he tapped one and saw the risk level popup
- He was surprised that some dams were marked red (high risk)

**His words:**
> "I didn't know we had so many dams near fault lines. This is scary actually."

**Feedback:** He suggested adding a legend or tooltip that explains the triangle colors without needing to tap.

**Verdict:** ✅ Feature works but needs better discoverability.

---

## Task 3: Test the emergency alert system

**What happened:**
- He granted location permission
- The app showed his current location on the map
- He pressed the "Test Alert" button
- The siren sound played loudly

**His words:**
> "Whoa that's loud! But it's good — in a real emergency you need something loud."

**Feedback:** He said the siren is effective but suggested adding a "stop" button that's more visible (the current one was small).

**Verdict:** ✅ Alert system works. Stop button needs to be more prominent.

---

## Task 4: Search for emergency phone numbers

**What happened:**
- He tapped the red phone icon in the navbar
- Selected "Mandalay" from the dropdown
- Saw the list of emergency numbers

**His words:**
> "Oh nice, it has the fire brigade and police numbers. I didn't know some of these."

**Feedback:** He wanted to be able to tap a number to call directly (tel: link). Currently it's just text.

**Verdict:** ✅ Feature works. Add tel: links for one-tap calling.

---

## Task 5: Switch to Myanmar language

**What happened:**
- He found the language toggle
- Switched to Myanmar
- Most of the UI translated correctly

**His words:**
> "The translation is pretty natural, not too formal. Good."

**Feedback:** He noticed a few English strings still showing on the Recovery page (some bullet points weren't translated).

**Verdict:** ✅ i18n works well. A few strings still need translation.

---

## Overall Impressions

**What he liked:**
- Live earthquake data is "really cool" — he didn't know this was possible without an app
- The dark mode looks "clean"
- Emergency phone numbers are "actually useful"
- Myanmar language support is "surprisingly good"

**What he wants improved:**
- Bigger tap targets for small earthquake markers on mobile
- A visible legend for dam risk colors
- More prominent stop button for the siren
- Tap-to-call for emergency numbers
- Translate remaining English strings on Recovery page

**Rating (1-10):** 8/10

> "I would actually use this during earthquake season. The map and alerts are the best parts."

---

## Action Items

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1 | Small markers hard to tap on mobile | Medium | Open |
| 2 | Add legend for dam risk colors | Low | Open |
| 3 | More prominent siren stop button | Medium | Open |
| 4 | Add tel: links to emergency numbers | Low | Open |
| 5 | Translate remaining Recovery page strings | Low | Open |
