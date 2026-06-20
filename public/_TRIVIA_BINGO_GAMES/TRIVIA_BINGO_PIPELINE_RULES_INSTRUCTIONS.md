# AMI Trivia Bingo: Master Creation Pipeline & Script Rules

This document outlines the end-to-end pipeline for generating Trivia Bingo games, ensuring consistent audio pacing, clean data architecture, and flawless ElevenLabs voice generation. 

## 1. Game Design & Category Matrix
Every Trivia Bingo game requires exactly **75 unique questions**. To ensure gameplay variety, the 75 questions must be distributed across a 7-category matrix. 
*(Example based on Country Music theme)*:
*   **Landmarks & Locations (10)**
*   **Nicknames & Aliases (10)**
*   **Pop Culture & Screen (10)**
*   **Behind the Music (10)**
*   **Finish the Lyric (10)**
*   **By the Numbers (10)** (Unique numerical/date answers)
*   **The Classics / Who Sang... (15)**

## 2. Script Writing Rules & Constraints
To ensure the ElevenLabs AI reads the text naturally and the Python post-processing script can accurately slice the audio, you must adhere strictly to these scripting rules:

### A. Question Formatting Constraints
*   **No Answer-in-Question:** Never use the answer within the wording of the question (e.g., Do not ask "What movie featured the song 'Nine to Five'?" if the answer is "Nine to Five").
*   **Strict Uniqueness:** Every single answer (and therefore, every filename) MUST be 100% unique. 
*   **Punctuation for Pacing:** Use exclamation marks mixed with question marks (`?!`) to force higher energy and natural host excitement.

### B. The Break Tag Timings
ElevenLabs alters its delivery speed based on break tags. To prevent the "speed-up glitch," we cap internal breaks and rely on Python to extend them later.
*   **Conversational Pauses (1.0s):** Use `<break time="1.0s" />` between sentences, intros, and fun facts to give the host a natural breath.
*   **Think-Time Pauses (2.0s):** Use `<break time="2.0s" />` immediately after asking a question to create a targetable gap for the Python padding script.
*   **End Buffers:** **None.** Do not put break tags at the end of the script; the Python post-processor handles this to save API character costs.

### C. The "3-Ask" Script Flow Template
Every trivia script must follow this exact formula:
1.  **Intro phrasing:** "Pay attention to this next one!" + `<break time="1.0s" />`
2.  **Ask 1:** "Question text?!" + `<break time="2.0s" />`
3.  **Ask 2:** "Second time around, we're lookin' for [rephrased question]?!" + `<break time="2.0s" />`
4.  **Ask 3:** "Last call!" + `<break time="1.0s" />` + "Question text?!" + `<break time="2.0s" />`
5.  **The Reveal:** "The answer we're lookin' for is [Answer]!" + `<break time="1.0s" />`
6.  **The Confirmation:** "That's [Answer]!" + `<break time="1.0s" />`
7.  **The Fun Fact:** "[Related Trivia Fact]!"

### D. Host Audio & Milestones
*   **File Naming:** The start file must be explicitly named `00_HOST_1_START_UNCLE_BULL` (or current persona) to force absolute alphabetical sorting in Windows.
*   **Intro Content:** The intro must explicitly state the transition to "Trivia Bingo," explain that answers are on the cards, note that questions are read three times, and remind players to check the winning pattern.

## 3. CSV Formatting & Export
The CSV must be generated via a Python script (using `csv.QUOTE_MINIMAL`) or strictly validated to ensure commas within the trivia questions do not shift the columns in Excel.
*   **Required Columns:** `Voice Name (Persona)`, `Category`, `Script Text`, `FILENAME`, `Question Only`, `Answer Only`, `Stability`, `Similarity`, `Style`
*   **Default Voice Settings:** Stability: `0.8`, Similarity: `0.8`, Style: `0`

## 4. ElevenLabs Audio Generation Pipeline
*   **Environment:** Must use **Python 3.12** (Do not use 3.13+ to avoid `audioop` library deprecation crashes).
*   **CSV Encoding:** When reading the CSV using Pandas, explicitly use `encoding='cp1252'` to prevent crashes caused by Windows smart quotes and em dashes.

## 5. Audio Post-Processing (The Silence Injector)
To give players exactly 8 seconds of "Think Time" without breaking ElevenLabs' pacing, we run a post-processing script using `pydub`.
*   **Prerequisites:** FFmpeg must be installed (via gyan.dev) and added to the Windows PATH.
*   **Detection Logic:** The script scans for silences `min_silence_len=1500` (1500ms). This safely ignores the 1.0s conversational breaks but perfectly captures the 2.0s Think-Time breaks.
*   **Midpoint Injection:** The script cuts the detected 2.0s silence directly in half (at 1.0s) and injects the digital silence padding into the middle. This surrounds the new silence with natural AI room tone, eliminating transient "blips" or "clicks."
*   **End Buffer:** Appends exactly 5.0 seconds of silence to the end of every file.