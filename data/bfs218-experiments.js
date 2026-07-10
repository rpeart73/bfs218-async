window.BFS218_EXPERIMENTS = {
  1: {
    title: 'The first glance',
    setup: 'Look at the scene above: a student surrounded by a phone, a camera, a tap-to-pay terminal, and an ID kiosk. Ordinary tools, an ordinary day. One of them is sorting people right now.',
    commit: 'Before the course tells you anything: which one?',
    options: [
      { label: 'The camera. Watching is the obvious sorting machine.', lens: 'visibility', tag: 'THE CAMERA' },
      { label: 'The payment terminal. Money is where people get sorted.', lens: 'money', tag: 'THE PAYMENT' },
      { label: 'None of them. They are just tools until someone misuses them.', lens: 'neutral-tools', tag: 'JUST TOOLS' }
    ],
    outcome: {
      headline: 'All four were sorting the whole time.',
      body: 'The phone ranks what you see, the camera decides who looks like a match, the terminal decides whose tap clears, and the kiosk decides whose face verifies. Each one keeps a record and applies a rule, quietly. That is the Week 1 move this course starts with: harm can travel through normal tools, not only through openly hostile people.'
    },
    mirrors: {
      visibility: 'You went to the camera, the tool that looks like surveillance. Reasonable, and it is the easy one to see. The course will keep asking about the tools that do not look like watching: the ranker, the wallet, the verifier. The obvious suspect can crowd out the quiet ones.',
      money: 'You followed the money, and payment systems do sort. Notice what that instinct passes over: the tools that sort without charging anything. The most consequential sorting this term often happens where no transaction is visible.',
      'neutral-tools': 'You held that tools are neutral until misused. That is the instinct this whole course examines: the rules are already inside the tools before anyone uses them well or badly. Keep this prediction; Week 2 tests it directly.'
    },
    reflect: 'Name one tool you used today that kept a record of you. One sentence.'
  },
2: {
    title: 'Same file, two histories',
    setup: 'A screening rule reads two applications. They are identical in every way a person would check: same qualifications, same answers. File A carries an old flag from a database built years ago; File B carries none. The rule is brand new, and it treats every file by exactly the same steps.',
    commit: 'Before you run it: what does the rule do?',
    options: [
      { label: 'Both get through. The rule is new and neutral, so identical files get identical results.', lens: 'neutrality', tag: 'BOTH PASS' },
      { label: 'File A is slowed or denied. The old flag rides along inside the neutral rule.', lens: 'outcome', tag: 'FILE A DENIED' },
      { label: 'File B gets extra checks. A file with no history looks riskier to a new system.', lens: 'unfamiliar', tag: 'EXTRA CHECKS' }
    ],
    outcome: {
      headline: 'File A is routed to DENIED.',
      body: 'The rule scored both files by the same steps, and that is exactly the problem: it read the old flag as a fact about the person instead of a fact about the old database. Nothing in the rule mentions race, history, or intent. The discrimination arrived in the data the rule trusted. This is what Week 2 calls engineered inequity and default discrimination: a neutral-looking process carrying an old pattern forward (Benjamin, 2019).'
    },
    mirrors: {
      neutrality: 'You trusted the rule because it was new and treated the files identically. That is the neutrality assumption: judging a system by its intentions and freshness instead of its inputs and outcomes. It is the most common way this kind of harm stays invisible, which is why Week 2 trains the opposite move (Benjamin, 2019).',
      outcome: 'You predicted the old flag would ride along, which is the Week 2 move working: judge the system by what it does, not what it claims. One caution for the rest of the course: assuming every system must be biased tells you nothing on its own. The finding is the mechanism, and here it was the inherited data, not the rule.',
      unfamiliar: 'You placed the risk on the file with no history, expecting the system to distrust what it had not seen. It did the reverse: it trusted the old record more than the blank one. Notice the pull to locate danger in the unfamiliar; systems usually encode the past they were fed, not the newcomers they meet (Benjamin, 2019).'
    },
    reflect: 'Where in your own field could an old flag ride along inside a neutral rule? One sentence.'
  },
  10: {
    title: 'Set the cutoff',
    setup: 'A support program has limited seats, and a prediction tool scores every student. Records above the line get a seat; records below it wait. The tool’s maker shipped it with the line at 71. You are the administrator today, and the line is yours to place.',
    commit: 'Where do you set the cutoff?',
    options: [
      { label: 'Lower it to 65. More students get through to support.', lens: 'inclusion', tag: 'LOWER TO 65' },
      { label: 'Keep it at 71. The maker set the default for a reason.', lens: 'default', tag: 'KEEP AT 71' },
      { label: 'Raise it to 78. Focus the seats on the clearest need the score can show.', lens: 'efficiency', tag: 'RAISE TO 78' }
    ],
    outcome: {
      headline: 'Whichever line you chose, the same thing happened just below it.',
      body: 'Two records sat just under your line. One score dipped in the term a parent was ill; one was dragged down by attendance from a long commute. The score cannot see either story, and the line cannot ask. And the maker’s 71 was set to fit the budget, not to measure need. A cutoff turns support into a gate: the number looks objective, but where the line sits is a judgment somebody made, exactly the gatekeeping pattern Week 10 examines in education (Bird, 2023).'
    },
    mirrors: {
      inclusion: 'You widened the gate. Notice the instinct that more inclusion fixes the tool: the records at 64 are still waiting, and the line is still blind to context. Moving a cutoff redistributes who is unseen; it does not teach the system to see. The Week 10 question is who reviews the line, not only where it sits.',
      default: 'You kept the maker’s number. That is the default-trust move from Week 4 returning: a shipped setting feels like a measured fact, and 71 was a budget decision wearing a number. Defaults are choices someone else made early; Week 10 asks who gets to challenge them.',
      efficiency: 'You tightened the line to concentrate on the clearest cases. That is the efficiency instinct: fewer weak positives, and more people the system never sees at all. Every cutoff optimizes for something; the experiment is asking you to notice what you were optimizing for, and who pays for it.'
    },
    reflect: 'Think of a cutoff in your own field, a score, a wait time, a quota. Who set it, and who reviews it? One sentence.'
  },
  3: {
    title: 'The clean slate',
    setup: 'An organization is embarrassed by its biased decision history. It deletes the old case files, keeps the scoring tool those files trained, and relaunches it as a fresh start.',
    commit: 'Does the new system start clean?',
    options: [
      { label: 'Yes. The biased records are gone, so the bias went with them.', lens: 'clean-slate', tag: 'STARTS CLEAN' },
      { label: 'No. The scores are the old records wearing new clothes.', lens: 'laundering', tag: 'SCORES REMEMBER' },
      { label: 'Mostly. New cases will gradually wash the old pattern out.', lens: 'dilution', tag: 'WASHES OUT' }
    ],
    outcome: {
      headline: 'The pattern survived its own deletion.',
      body: 'The tool learned its thresholds from the deleted files, so every new score still carries them. Deleting the evidence did not delete the rule the evidence built. This is Week 3 in one sentence: unequal outcomes can be built into a process, and a cleaner name on the process changes nothing by itself.'
    },
    mirrors: {
      'clean-slate': 'You treated the data as the bias and the tool as a container. The tool is a memory: it kept what the data taught it. Watch for fresh-start language this term; it is often the moment the old pattern becomes hardest to see.',
      laundering: 'You saw the scores as laundered history, which is the Week 3 mechanism exactly. The caution: name how it survives, or the claim will not persuade anyone who trusts the relaunch. The mechanism is the argument.',
      dilution: 'You expected time to wash it out. But the tool scores the new cases, so the new cases arrive pre-sorted by the old pattern; the wash cycle is running the stain back in. Gradualism feels safe and often just defers the audit.'
    },
    reflect: 'Where have you seen a fresh start that kept the old machinery? One sentence.'
  },
  4: {
    title: 'Whose default?',
    setup: 'A new campus system ships with settings already chosen: a default language, a default name format, a default way to prove who you are. Most people click straight through.',
    commit: 'What is a default, really?',
    options: [
      { label: 'A necessity. Something has to be pre-chosen, or nothing works.', lens: 'necessity', tag: 'A NECESSITY' },
      { label: 'A decision. It advantages whoever it already fits.', lens: 'choice', tag: 'A DECISION' },
      { label: 'A suggestion. Anyone can change it, so it hardly matters.', lens: 'agency', tag: 'JUST A SUGGESTION' }
    ],
    outcome: {
      headline: 'The default decided before anyone noticed.',
      body: 'Most users never change a default, so the pre-chosen setting became the real rule. Whoever fit it moved through without friction; everyone else adapted, one small cost at a time. Week 4 calls this default discrimination: the setting was a choice someone made, and the cost of not fitting it was distributed silently.'
    },
    mirrors: {
      necessity: 'You accepted the default as inevitable, and something does have to be pre-set. The move this week separates that something must be chosen from what got chosen and who it fits. Necessity explains the existence of a default, never its contents.',
      choice: 'You read the default as a decision with a beneficiary, which is the Week 4 lens working. Keep the pressure on yourself too: which defaults are you inside of right now, fitting so well you cannot feel them?',
      agency: 'You trusted that changeable means harmless. Changeability is real for the person with the time, the language, and the confidence to dig into settings. The cost of a default is priced in exactly the friction you discounted.'
    },
    reflect: 'Name one default you have never changed. Who does it fit? One sentence.'
  },
  6: {
    title: 'The flag follows',
    setup: 'A checkpoint system wrongly flags a traveller. At the desk, a human catches the error in minutes and clears them to continue.',
    commit: 'What happens to the flag itself?',
    options: [
      { label: 'It is deleted. The error was found and fixed at the source.', lens: 'correction', tag: 'FLAG DELETED' },
      { label: 'It has already travelled. Copies reached other systems before the fix.', lens: 'propagation', tag: 'FLAG TRAVELS' },
      { label: 'It stays, but marked as disputed, so future systems will know.', lens: 'annotation', tag: 'MARKED DISPUTED' }
    ],
    outcome: {
      headline: 'The person was cleared. The flag kept travelling.',
      body: 'The scan became a label the moment it fired, and the label was shared onward before the desk ever saw the error. The correction lived in one database; the flag lived in several. Week 6 is about exactly this: watching turns movement into data, data travels between systems, and corrections travel slower than flags.'
    },
    mirrors: {
      correction: 'You trusted the fix to reach as far as the error. That is a fairness instinct projected onto plumbing: systems copy forward eagerly and reconcile backward rarely. Ask where a correction has to travel, and who is responsible for carrying it.',
      propagation: 'You predicted the copies would outrun the fix, the Week 6 mechanism itself. The follow-up matters just as much: who could have been accountable for the flag, and why was the appeal desk so far from the checkpoint?',
      annotation: 'You imagined the systems would at least keep the dispute attached. That is how careful institutions should work, and notice you assumed the infrastructure for it exists. Building that annotation layer is an accountability demand, not a feature that ships by default.'
    },
    reflect: 'What is the checkpoint in your own field, and where would its wrong flags travel? One sentence.'
  },
  7: {
    title: 'What fades first',
    setup: 'Half the course is behind you. Before you review, make a prediction about your own memory.',
    commit: 'Which of your course knowledge has decayed the most?',
    options: [
      { label: 'The newest ideas. They have had the least rehearsal.', lens: 'recency', tag: 'NEWEST FADES' },
      { label: 'The earliest weeks. Time has worn them down.', lens: 'decay', tag: 'OLDEST FADES' },
      { label: 'The ideas I was surest about. I stopped checking them.', lens: 'confidence', tag: 'SUREST FADES' }
    ],
    outcome: {
      headline: 'The costliest fading is the one you cannot feel.',
      body: 'Early material does fade, and new material is fragile. But the pattern your own Knowledge Checks track all term is the confident miss: the answer you were sure of and got wrong. Sureness switches off rehearsal, so confident knowledge decays invisibly while feeling solid. That is why this review week exists, and why the checks ask how sure you were before showing you how you did.'
    },
    mirrors: {
      recency: 'You bet against the new material. Fragile, yes, but you still check new ideas because they feel uncertain. It is the knowledge that feels finished that goes unwatched. Run Set A of an early week and compare the feeling to the score.',
      decay: 'You bet on time as the eraser, the common-sense model of forgetting. Time only erases what goes unrehearsed, and what goes unrehearsed is what feels certain. Your calendar is not the risk; your confidence is.',
      confidence: 'You suspected your own certainty, which is the rarest and most useful prediction on this list. Hold onto that: it is the same move the course asks you to make about systems that feel reliable. Test what feels finished.'
    },
    reflect: 'Pick one idea you were sure of in Week 2 or 3. Re-check it this week. What did you find? One sentence.'
  },
  8: {
    title: 'Whose story?',
    setup: 'A dataset about a community exists. It is accurate. A project wants to use it to improve services, and everyone involved means well.',
    commit: 'What is the first question to settle?',
    options: [
      { label: 'Is the data accurate enough to act on?', lens: 'accuracy', tag: 'IS IT ACCURATE?' },
      { label: 'Who consented, and who controls what the data says and does?', lens: 'sovereignty', tag: 'WHO CONTROLS IT?' },
      { label: 'Will using it help more people than it could harm?', lens: 'utility', tag: 'DOES IT HELP?' }
    ],
    outcome: {
      headline: 'Accurate, useful, and still not theirs.',
      body: 'The data was collected about the community, and the decisions about its use were made somewhere else. Week 8 names the missing question: data about people is also a story about them, and sovereignty asks who holds authority over its collection, its use, and its meaning. Accuracy and good intentions can both be present while control stays taken; that is precisely how it usually happens.'
    },
    mirrors: {
      accuracy: 'You reached for data quality, the professional reflex. Accuracy answers whether the story is well told; it never answers whose story it is to tell. A perfectly accurate dataset can be a perfectly executed taking.',
      sovereignty: 'You went to control and consent first, which is the Week 8 move. Keep it concrete in your own work: authority means the community can refuse, correct, and end a use, not just be consulted about it.',
      utility: 'You weighed help against harm, the ethics-committee reflex. Notice who sits outside that calculation: the people the data describes, doing neither the weighing nor the deciding. A favourable balance struck by someone else is still someone else striking it.'
    },
    reflect: 'In your field, who holds data about people who cannot refuse its use? One sentence.'
  },
  9: {
    title: 'Who gets accused?',
    setup: 'Three students submit essays for the same assignment. Amara Osei wrote hers in English, her third language, using the careful academic style she spent years learning. Jordan Miller drafted his with an AI chatbot and lightly edited the result. Thu Nguyen, bilingual since childhood, wrote hers unaided the night before it was due. The college runs every submission through an AI-writing detector that advertises near-perfect accuracy.',
    commit: 'The detector flags at least one essay. Which one?',
    options: [
      { label: 'The AI-assisted essay. Catching that is the whole point of the tool.', lens: 'trust', tag: 'THE AI ESSAY' },
      { label: 'The strongest essay. Polished writing is what looks machine-made.', lens: 'polish', tag: 'THE POLISHED ONE' },
      { label: 'The multilingual writers. The tool reads learned English as machine English.', lens: 'bias', tag: 'MULTILINGUAL WRITERS' }
    ],
    outcome: {
      headline: 'The detector flagged the two human writers and passed the AI essay.',
      body: 'This is the documented pattern, not a thought experiment. Liang and colleagues (2023) ran human-written essays through seven widely used AI detectors: on average the detectors wrongly flagged 61 percent of essays by non-native English writers as machine-generated, while judging native speakers\' essays almost perfectly, and nearly one in five of those human essays was flagged by every single detector. The reason sits in the tool\'s own logic. Detectors score how predictable the wording is, and carefully learned academic English is predictable in exactly that way. Meanwhile lightly edited AI text can slip under the same threshold. A tool marketed as protecting fairness quietly redistributes suspicion along lines of language, culture, and race, and the accused student is left to prove a negative.'
    },
    mirrors: {
      trust: 'You trusted the tool to do what its marketing says, which is the reasonable default. It is also exactly the gap Week 9 names: a benevolent purpose does not guarantee a benevolent mechanism. Ask what the tool actually measures, not what it promises to catch.',
      polish: 'You guessed the tell would be quality. Close to the mechanism, but inverted: detectors do not flag good writing, they flag predictable writing, and the writers most likely to sound predictable are the ones who learned academic English by the book. The suspicion lands on effort, not on polish.',
      bias: 'You saw where the suspicion would land, which is the Week 9 lens working. The harder second step: the harm is not only the wrong flag, it is the process after it. The flagged student faces an accusation that is nearly impossible to disprove, while the actual AI user walks away. Name both the error and the burden it assigns.'
    },
    reflect: 'One sentence: knowing the detector fails in this patterned way, what should a fair first step be when a submission gets flagged?'
  },
  11: {
    title: 'Fix the gate',
    setup: 'A screening gate has been harming the same group for years, and now there is budget to respond, once. You choose the move.',
    commit: 'Spend it:',
    options: [
      { label: 'Retrain the system on bigger, better, more diverse data.', lens: 'patch', tag: 'RETRAIN IT' },
      { label: 'Fund an appeal seat with real authority, staffed from the affected community.', lens: 'power', tag: 'FUND THE SEAT' },
      { label: 'Replace the vendor with one whose product audits cleaner.', lens: 'swap', tag: 'SWAP VENDOR' }
    ],
    outcome: {
      headline: 'Run the Week 11 test: after your move, who decides?',
      body: 'Retraining and vendor swaps improve the gate and leave every decision where it was; the same people own the thresholds, the appeals, and the definition of success. The funded seat is the only move on the list that shifts an actual decision to the people carrying the harm. That is the reform-or-repair test this week teaches: a real repair moves power, not just error rates (Benjamin, 2019; Costanza-Chock, 2020).'
    },
    mirrors: {
      patch: 'You reached for better inputs, the engineering reflex. It can genuinely lower the error rate, and it converts a power problem into a data problem, which is why institutions prefer it. Ask what your fix leaves untouched; that is usually the point of it.',
      power: 'You moved a decision instead of a metric, the design-justice move. Now hold it to the same standard: a seat without authority is consultation wearing a chair. Real authority means the seat can overturn outcomes and change the rule.',
      swap: 'You changed the vendor, the procurement reflex. A cleaner product in the same structure serves the same structure; the gate still stands, better calibrated. Week 11 asks the prior question: should this gate exist, and who gets to ask that?'
    },
    reflect: 'One system in your field: name a patch it has received, and the repair it has not. One sentence.'
  },
  12: {
    title: 'Where the fix sticks',
    setup: 'A harmful tool is exposed in the news. Everyone agrees it is bad. Three forces move to stop it.',
    commit: 'Which one most reliably stops it, everywhere, for good?',
    options: [
      { label: 'Public pressure. Shame moves fast and companies fear it.', lens: 'attention', tag: 'PUBLIC PRESSURE' },
      { label: 'The company itself. It promises reform and self-regulates.', lens: 'goodwill', tag: 'SELF-REGULATION' },
      { label: 'Law that binds every vendor, with enforcement and appeal.', lens: 'structure', tag: 'BINDING LAW' }
    ],
    outcome: {
      headline: 'The stack decided, like it always does.',
      body: 'Public pressure retired one product; the pattern reappeared under a new name. Self-regulation lasted one leadership change. Only the binding rule reached every vendor at once, and even it protects no one where enforcement is missing, which is the gap Week 12 keeps pointing at. Accountability has levels: a fix at one level is only as durable as the level above it allows.'
    },
    mirrors: {
      attention: 'You bet on visibility, and visibility does win sprints. It cannot hold ground: attention moves on and the incentive that built the tool stays. Ask what the pressure is FOR; pressure that does not land in a rule evaporates.',
      goodwill: 'You trusted the institution to police itself. Sometimes sincere, always revocable: self-regulation is a policy with one stakeholder. The Week 12 question is what happens when keeping the promise gets expensive.',
      structure: 'You went up the stack to binding rules, the durable layer. Keep the week\'s honesty with it: law without enforcement, or with no appeal for the people harmed, is the gap wearing the uniform. Name the level AND its missing piece.'
    },
    reflect: 'Pick one harm from this course. Which level is currently holding it back, and which level is missing? One sentence.'
  }
};

