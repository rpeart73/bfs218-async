/* BFS218 ASYNCHRONOUS per-page how-to registry (2026-07-25). Every screen carries
   its own "How to use this page" panel so students can teach themselves each surface.
   tour.file is the chaptered video tour; each page's clip value is a
   media-fragment time range inside that one file (filled in later). Plain language, no dashes.
   Collapsed aliases (sub-views keyed to their parent entry, matching howtoKey):
     library -> journey
     detail, reading -> readings
     assignment-program, assignment-details, assignment-rubric, assignment-release,
       assignment-ai, assignment-faq, starter -> assignments
     sandbox -> activity */
window.BFS218_HOWTO = {
  "tour": { "file": "videos/howto-tour.mp4", "note": "Silent screen tour with on-screen captions." },
  "byScreen": {
    "journey": {
      "title": "How to use your home page",
      "intro": "This page is your course map. Every week is a station on one journey, and because this section is fully self-paced, this page is also where you steer.",
      "steps": [
        { "do": "Find the current week.", "detail": "The suggested-pace card names the week the calendar sits in. Click it, or click any station below, to open that week's page. The pace is a suggestion; the only fixed points are the two due dates." },
        { "do": "Read the station badge before you click.", "detail": "Each station shows its dates, how many readings it carries, and whether you have started it. The final project weeks carry no new material." },
        { "do": "Track your driven weeks.", "detail": "The progress panel counts a week as driven once you check off its four steps on the week page. The two assessment windows under it show what is open and when it is due." },
        { "do": "Read the five moves.", "detail": "The orientation panel explains how to run a self-paced course well: you set the pace, the weekly experience carries the teaching, and you check your own understanding." },
        { "do": "Use the Study Compass.", "detail": "The compass box suggests what to do next based on what you have already done on this device. It is a suggestion, never a requirement. Adding your first name is optional." },
        { "do": "Pick your program lens if you want one.", "detail": "The Viewing as chip personalizes examples to your field of study. The course content stays the same for everyone; only the framing changes. You can turn it off any time." }
      ],
      "saves": "Your visited weeks, step check-offs, optional first name, and program lens choice are saved only in this browser on this device. Nothing is sent anywhere.",
      "graded": "Nothing on this page is graded or reported to your professor.",
      "next": "Open the current week's station and start its four-step path.",
      "clip": "4,18"
    },
    "station": {
      "title": "How to use a week page",
      "intro": "Each week page is your whole classroom for that week: the lecture, the readings, the experience, the practice, and your notes. The page opens folded so you can see its shape first.",
      "steps": [
        { "do": "Start with the hero card.", "detail": "It names the week's question and its route: Read, See, Try, Reflect. The Start button takes you to the right first section." },
        { "do": "Check off the four steps in You drive this week.", "detail": "No one paces you here. Ticking the four steps as you finish them keeps you honest, and it is what marks the week as driven on your home page." },
        { "do": "Play the weekly lecture in Listen to this week.", "detail": "Your professor wrote it; a disclosed AI narrator reads it. Use the player to pause, skip, change speed, download, or open the transcript. It keeps playing while you move around the site." },
        { "do": "Watch This week in 80 seconds, then work the readings.", "detail": "The short video overview is made with NotebookLM from the week's readings and reviewed by your instructor. Each reading names exactly what to read. If you are behind, Reading Rescue gives you one anchor source, one concept, and one question as the shortest honest way back in." },
        { "do": "Enter the weekly experience.", "detail": "With no live class, the immersive experience is where the teaching happens. Enter it, move through its scenes and evidence, and come back to the readings to anchor what it showed you." },
        { "do": "Open the activity and run the experiment.", "detail": "The activity page starts with a predict, run, and reveal experiment, then a simulation and a hands-on workbench. The gap between your guess and the outcome is where the learning is." },
        { "do": "Close with the checks, your reflection, and Generate Your Weekly Notes.", "detail": "Rate the same ideas you rated at the start, use the Study Guide before the Knowledge Check, write your reflection, then generate the Word file that collects your week on Seneca letterhead." }
      ],
      "saves": "Your ratings, notes, step check-offs, reflections, and practice results are saved only in this browser on this device. Download your weekly notes file to keep a copy no browser can lose.",
      "graded": "Every check on this page is practice. None of it is scored, recorded, or visible to your professor.",
      "next": "When the four steps are checked, return Home and open the next station.",
      "clip": "18,32"
    },
    "site": {
      "title": "How to use this page",
      "intro": "This page explains how the whole site works. The panel you are reading now appears on every page, always tuned to that page.",
      "steps": [
        { "do": "Read the success guide first.", "detail": "Five habits for doing an asynchronous course well: plan your times, learn from the experience, quiz yourself honestly, have a plan for being stuck, and keep your own evidence." },
        { "do": "Skim the cards in order.", "detail": "They cover privacy, copyright, translation, accessibility, and the site's known limits, including that saved work lives only in this browser." },
        { "do": "Use the diagram to keep this site and Blackboard straight.", "detail": "You learn and practise here. You submit, discuss, and get grades on Blackboard. If the two ever disagree, Blackboard wins." },
        { "do": "Look for the How to use this page bar anywhere you go.", "detail": "Every page carries its own version of this panel with steps for that page. Open it whenever a page feels unfamiliar." },
        { "do": "Report anything broken.", "detail": "The report button opens your own email with the page details filled in. You add what happened and press send. Nothing is collected by this site." },
        { "do": "Use Clear my saved work on a shared computer.", "detail": "It removes every note, answer, and setting this site has saved in this browser. Download your weekly notes first if you want to keep them." }
      ],
      "saves": "Everything you type or rate on this site stays in this browser on this device. Clear my saved work wipes it.",
      "graded": "Nothing on this site is graded. Blackboard is the only official gradebook.",
      "next": "Head back Home and open the current week.",
      "clip": "32,45"
    },
    "pathways": {
      "title": "How to use Course Pathways",
      "intro": "This page shows how a week works when the weekly page is the classroom, so the rhythm never surprises you.",
      "steps": [
        { "do": "Read the five moves of the weekly rhythm.", "detail": "Start with the weekly page, learn from the experience and readings, practise with the activity and checks, capture notes as you go, and finish by generating your weekly record." },
        { "do": "Notice what is fixed and what is yours.", "detail": "You can move ahead or catch up freely. The only fixed points in the term are the two due dates." },
        { "do": "Treat the experience as your lecture.", "detail": "Enter it first, then anchor its teaching in the readings. Re-enter it whenever you want to examine an idea again." },
        { "do": "Use the closing buttons to jump.", "detail": "They take you straight to the Week 2 learning room, your program's connection to the course, Career Choices, and the assignment pages." }
      ],
      "saves": "This page stores nothing.",
      "graded": "Nothing here is graded.",
      "next": "Open Calendar and Due Dates to put exact dates against this rhythm.",
      "clip": "45,59"
    },
    "readings": {
      "title": "How to use Readings and Media",
      "intro": "This is the course library: every assigned source in one place, with practice attached.",
      "steps": [
        { "do": "Browse or filter to find a source.", "detail": "Filter by week or by topic, or just scan the cards." },
        { "do": "Open a source's detail page.", "detail": "It shows the full citation, where to access it, roughly how long it takes, the core idea, and an evidence profile that names what the source does not prove." },
        { "do": "Open the reading itself.", "detail": "The read button opens the full text in a new tab. The site never hosts the reading; some sources go through Blackboard or the Seneca library." },
        { "do": "Use Source Practice on sources you have read.", "detail": "Pick one source, choose a lens, write your answers, then reveal what a strong response covers. Quick check questions tell you whether the reading actually landed." },
        { "do": "Add two or three sources to the compare tray.", "detail": "Use the columns button on any card or detail page, then take them into Compare Sources." }
      ],
      "saves": "Your Source Practice answers and notes stay in this browser on this device.",
      "graded": "Source Practice is never scored.",
      "next": "Take two or three sources into Compare Sources and hold them side by side.",
      "clip": "59,73"
    },
    "compare": {
      "title": "How to use Compare Sources",
      "intro": "Comparison is where course thinking gets real. This page holds two or three sources next to each other so you can see what each one argues.",
      "steps": [
        { "do": "Pick two or three sources.", "detail": "Use the picker on the right. Readings, videos, and audio can sit together, so choose sources that speak to the same question from different angles." },
        { "do": "Read the side-by-side panels.", "detail": "Each panel keeps the source's core idea, its evidence type, and what it does not prove visible." },
        { "do": "Press Synthesize when you are ready.", "detail": "The synthesis builds a frame across your chosen sources. Use it as a thinking scaffold, not as sentences to copy." },
        { "do": "Save, copy, or print the synthesis.", "detail": "Save to my notes keeps it on this device so you can return to it later." },
        { "do": "Write your own take.", "detail": "One or two sentences in your own words are worth more than the whole generated frame. Put them in your weekly notes." }
      ],
      "saves": "A synthesis you keep with Save to my notes stays in this browser on this device.",
      "graded": "Comparisons are never graded. They exist to sharpen your written work.",
      "next": "Carry your comparison insight into this week's reflection or your next assignment.",
      "clip": "73,86"
    },
    "walkthroughs": {
      "title": "How to use Weekly Experiences",
      "intro": "In this self-paced section the weekly experience carries the teaching. Each one walks the week's idea as a sequence of scenes, evidence rooms, decisions, diagrams, and reflection.",
      "steps": [
        { "do": "Pick a week and enter.", "detail": "The experience opens over the page. Nothing behind it is lost." },
        { "do": "Move with the arrows or arrow keys.", "detail": "Each slide is one move: a scene, an evidence room, a decision, or a diagram. The bar at the top shows your progress." },
        { "do": "Open Accessibility for narration and text size.", "detail": "Voice narration reads the current chapter with a voice and speed you choose. The text size controls are in the header. All of it is optional." },
        { "do": "Leave any time; return any time.", "detail": "Close or press Escape to return to the page you came from. The button says Re-enter once you have started, and the experience remembers where you left off on this device." },
        { "do": "Anchor it in the readings after.", "detail": "The experience teaches the idea; the readings carry the citations and evidence your graded work needs." }
      ],
      "saves": "Your position in each experience is saved in this browser on this device.",
      "graded": "Experiences are teaching, not testing. Nothing is scored.",
      "next": "After an experience, open the same week's readings and Study Guide to lock the idea in.",
      "clip": "86,100"
    },
    "lectures": {
      "title": "How to use Lectures",
      "intro": "Every teaching week has a short audio lecture. Your professor wrote each one; a disclosed AI narrator reads it for clarity and accessibility.",
      "steps": [
        { "do": "Press play on any week.", "detail": "The lecture keeps playing while you move around the site, so you can listen while you read or review." },
        { "do": "Use the mini player.", "detail": "While a lecture plays, a small player stays on screen. It can pause, jump you to that week's page, or close." },
        { "do": "Open the week for the full player.", "detail": "The week page adds skip, speed, download, a follow-along transcript, and other narration voices and languages. Download before you travel; the subway has no signal." },
        { "do": "Treat it as a companion, not a substitute.", "detail": "The lecture explains how the week fits together. The readings still carry the citations and evidence your graded work needs." }
      ],
      "saves": "This page stores nothing. Downloaded lectures go to your own device.",
      "graded": "Listening is never tracked or graded.",
      "next": "Open the week the lecture belongs to and work its readings.",
      "clip": "100,113"
    },
    "videos": {
      "title": "How to use Videos and Podcasts",
      "intro": "This gallery collects scholar media for the course: the researchers you are reading, speaking for themselves.",
      "steps": [
        { "do": "Filter by week or by kind.", "detail": "Each card names the scholar, what the item explains, and why it is worth your minutes." },
        { "do": "Play inside the page or follow the link out.", "detail": "Embeddable videos use official platform players and nothing loads until you press play. Podcasts and restricted media link out to the source site." },
        { "do": "Use the watch-for prompts.", "detail": "Each card tells you what to watch or listen for, and which reading move to make next. A talk is a way into a source, not a replacement for reading it." },
        { "do": "Write the note on the card.", "detail": "After the media, write one sentence you can prove from the reading. It lands in your weekly notes file." }
      ],
      "saves": "Your media notes stay in this browser on this device and appear in Generate Your Weekly Notes.",
      "graded": "Watching is never tracked or graded.",
      "next": "Open the reading the video connects to in Readings and Media.",
      "clip": "113,127"
    },
    "glossary": {
      "title": "How to use the Glossary",
      "intro": "Every key term and thinker in the course lives here, with real definitions and real citations.",
      "steps": [
        { "do": "Search or browse by week.", "detail": "Terms are written in full sentences, enough to actually understand, and each carries the citation it comes from." },
        { "do": "Use terms to speak precisely.", "detail": "Ideas like the New Jim Code and intersectionality do exact work in this course. Written work reads stronger when the vocabulary is used accurately." },
        { "do": "Meet the scholars.", "detail": "Each week lists the scholars behind its readings, with a one-line version of what each argues. Click a name to open the source's detail page." },
        { "do": "Follow a term back to its week.", "detail": "Each entry names its home week, so you can revisit the fuller context." }
      ],
      "saves": "This page stores nothing.",
      "graded": "Nothing here is graded.",
      "next": "Turn terms into memory with Concept Flashcards.",
      "clip": "127,141"
    },
    "cards": {
      "title": "How to use Concept Flashcards",
      "intro": "One flip card per course concept: the term in front, the definition behind.",
      "steps": [
        { "do": "Try to answer before you flip.", "detail": "Recalling before revealing is what makes flashcards work. Guessing first, even wrongly, strengthens the memory." },
        { "do": "Filter by week.", "detail": "Before a Knowledge Check, run the cards for that week plus one earlier week." },
        { "do": "Work the Self-Check Studio above the cards.", "detail": "It turns the week's readings into a short see-it-for-yourself check, so you test the idea, not just the wording." },
        { "do": "Say the definition out loud in your own words.", "detail": "If you can only repeat the card's wording, flip it again tomorrow." }
      ],
      "saves": "The flip cards store nothing. Your Self-Check Studio answers stay in this browser on this device.",
      "graded": "Cards are pure practice.",
      "next": "Take the week's Knowledge Check and see what stuck.",
      "clip": "141,154"
    },
    "assignments": {
      "title": "How to use Starting Your Assignment",
      "intro": "The five assignments build one map across the term. These pages explain the arc, the rooms, the dates, and the rules, so the blank page never wins.",
      "steps": [
        { "do": "Start with the overview.", "detail": "Five assignments, each worth 20 percent: notice, interpret, investigate, repair, integrate. Together they build your Personal Cartography." },
        { "do": "Note the two deadlines.", "detail": "First half due October 25; second half due December 11. Everything is due by 11:59 p.m. Eastern Time, and nothing is due in the final week." },
        { "do": "Open one assignment room at a time.", "detail": "Each room shows the purpose, what to submit, the marking criteria, and your program connection. Separate pages cover how stronger work grows, release dates, AI use, and the FAQ." },
        { "do": "Set your program lens for examples.", "detail": "The lens tailors the rooms and starter questions to your field. It never changes the prompt, the grading, or the due dates." },
        { "do": "Open the Assignment Start Lab when you want a working session.", "detail": "Fixed course rules, no AI, build a private start plan you can print or save. For Compass Check, the lab gives readiness steps only; that assessment is a closed, timed Blackboard sitting." },
        { "do": "Build a first-draft plan, then submit on Blackboard, always.", "detail": "The starter page turns your answers into a Word planning document. The official assignment, rubric, and submission all live on Blackboard." }
      ],
      "saves": "Your starter answers and program lens choice stay in this browser on this device.",
      "graded": "Nothing here is submitted or graded. Blackboard is the only submission channel.",
      "next": "Block one hour, open the lab, and leave with a plan.",
      "clip": "154,168"
    },
    "career": {
      "title": "How to use Career Choices",
      "intro": "This page connects the course to your own field of study, whatever you are here to become.",
      "steps": [
        { "do": "Pick your area of study, or your exact program.", "detail": "General stream and Still exploring are real options and have their own write-ups." },
        { "do": "Read the lens first.", "detail": "The Read the course this way line gives you one question to carry through the whole course from your field's point of view." },
        { "do": "Work the systems and the scenario.", "detail": "Each field names the systems to watch, the artifacts that count as evidence, and a concrete picture of the course ideas operating in that world." },
        { "do": "Follow the week links.", "detail": "Each field points at the weeks that matter most for it, and those links jump straight to the stations." },
        { "do": "Write the reflection.", "detail": "One honest paragraph about how this course touches your field is a seed for assignments later." }
      ],
      "saves": "Your field choice and reflection stay in this browser on this device. The chip follows you around the site until you turn it off.",
      "graded": "The graded curriculum is identical for every student. The lens changes examples and framing only.",
      "next": "Visit a week the page recommends for your field and watch the framing follow you.",
      "clip": "168,182"
    },
    "activity": {
      "title": "How to use an activity page",
      "intro": "Each teaching week's activity opens on its own page: the experiment first, then the simulation, then the workbench where you practise the idea.",
      "steps": [
        { "do": "Make your prediction before anything runs.", "detail": "Commit to one of the predictions, then press run. The gap between your guess and the outcome is where the learning is, so do not skip the commit." },
        { "do": "Read the reveal and the mirror.", "detail": "The reveal shows what actually happened; the mirror shows what your prediction says about the lens you carry. Keep one sentence from it in the note box." },
        { "do": "Run the simulation more than once.", "detail": "Choose the case, the system, and the safeguard, run one case, then run one hundred. One run contains luck; the batch shows what the system makes more likely. It is a teaching model, not real population numbers." },
        { "do": "Practise in the workbench.", "detail": "Every choice gives instant feedback: match examples to mechanisms, make decisions, flip defaults, assemble a system, or weigh policy levers. Week 5's activity is a bias audit that re-enacts Buolamwini and Gebru's Gender Shades study, and it can save your audit as a Word file." },
        { "do": "Write the activity note before you leave.", "detail": "One sentence about what the activity helped you notice. It lands in Generate Your Weekly Notes when you return to the week." }
      ],
      "saves": "Your predictions, simulation runs, workbench choices, and notes stay in this browser on this device.",
      "graded": "The activity is practice. Nothing is scored, recorded, or visible to your professor.",
      "next": "Go back to the week page for the reflection and your weekly notes.",
      "clip": "182,196"
    },
    "calendar": {
      "title": "How to use Calendar and Due Dates",
      "intro": "Every date that matters in one place: openings, deadlines, Study Week, and the end of term.",
      "steps": [
        { "do": "Scan the term at a glance.", "detail": "Seneca red marks the days you hand something in; the greys are the schedule. The deadlines cluster on October 25 and December 11, and everything is due by 11:59 p.m. Eastern Time." },
        { "do": "Click any assignment.", "detail": "It opens that assignment's page so you can see what the date actually asks of you." },
        { "do": "Subscribe on your phone.", "detail": "The subscription is a live calendar feed, not a downloaded copy. Your calendar app can refresh it if the course schedule changes." },
        { "do": "Treat Blackboard as the official source.", "detail": "If anything ever differs, Blackboard and your professor's announcements win." }
      ],
      "saves": "This page stores nothing.",
      "graded": "Nothing here is graded.",
      "next": "Put the two deadline dates into your own planner now, before they are close.",
      "clip": "196,209"
    }
  }
};
