/* ============================================================
   BFS218 Knowledge Check 2.0, Set C additions.
   Per content week (1 to 12): 2 scenario MC items, 1 matching
   set (4 rows, shared options, answers a 0-3 bijection), and
   1 short item with a model answer.
   Grounding: every item carries a trailing comment naming the
   corpus record id (window.BFS218.records) or the WEEKPAGE
   concept in app.js that supports it. No claim goes beyond
   those on-disk sources.
   ============================================================ */
window.BFS218_KC_SETC_ADDITIONS = {

  /* ---------- WEEK 1 : Introduction to the Course ---------- */
  "1": [
    { kind: "scenario", diff: 2,
      q: "A property management company replaces its human screening staff with tenant screening software. A classmate says this removes racism from the process because no person makes the decision any more. Based on Week 1, what is the problem with that claim?",
      options: [
        "Software is always more harmful than a human landlord, so the company made things worse on purpose",
        "The claim is fine, because racism requires a person acting on conscious prejudice",
        "Techno-racism means bias can be embedded in the algorithms, datasets, defaults, and design choices themselves, so an automated system can enact exclusion at scale while appearing neutral",
        "The only real issue is that some tenants lack internet access to apply" ],
      answer: 2,
      why: "Techno-racism names racial bias embedded inside technical systems. Where a landlord can refuse one tenant, a screening algorithm can refuse thousands at once, quietly, while appearing neutral.",
      whyWrong: {
        0: "The course does not claim automation is always worse or deliberately sabotaged; the point is scale and apparent neutrality, not intent.",
        1: "Week 1's core move is that racism can operate through technology, not only through individual attitudes, so removing the person does not remove the bias.",
        3: "Access gaps matter elsewhere in the course, but techno-racism names bias inside a system's design and data, not a shortage of connections." } }, // grounded in: WEEKPAGE.BFS218[1] concept "Techno-racism"
    { kind: "scenario", diff: 3,
      q: "A vendor pitches a hiring tool to your workplace with the line: unlike biased human managers, our system is purely objective. Using Benjamin's New Jim Code, what should you notice about that pitch?",
      options: [
        "The claim of objectivity is exactly the promotion Benjamin warns about: it invites less scrutiny, which helps a system carry existing inequities forward as if they were progress",
        "The pitch proves the tool is safe, because an objective system cannot reproduce inequity",
        "The pitch is a problem only if an engineer at the vendor holds racist views",
        "The pitch guarantees regulators will ban the tool, since objectivity claims are prohibited" ],
      answer: 0,
      why: "Benjamin defines the New Jim Code as new technologies that reflect and reproduce existing inequities while being promoted and perceived as more objective or progressive than earlier systems; the objectivity framing itself lowers scrutiny.",
      whyWrong: {
        1: "Taking the neutrality claim at face value is the trap: being perceived as objective is part of how the reproduced inequity passes as an improvement.",
        2: "The New Jim Code does not require proof of an individual designer's intent; a system can carry racism forward by design without any racist engineer.",
        3: "The course names no rule that bans objectivity claims; the warning is about lowered scrutiny, not automatic regulation." } }, // grounded in: record benjamin2019 (coreIdea and abstract)
    { kind: "match", mgroup: "w1m2", mlabel: "Match each Week 1 idea to its meaning.", diff: 2,
      q: "The New Jim Code", answer: 1,
      options: [
        "Racial bias embedded in the algorithms, datasets, defaults, and design choices that shape digital life",
        "New technologies that reflect and reproduce existing inequities while being promoted as more objective or progressive than earlier systems",
        "The idea that race, gender, class, and other categories overlap, so harm at the intersection can be missed by looking at one category alone",
        "Your course-long map of your own relationship to digital technology, including moments of being seen, sorted, watched, or misread by a machine" ],
      why: "Benjamin's New Jim Code names new technologies that reproduce existing inequities while being promoted as more objective or progressive than earlier systems." }, // grounded in: record benjamin2019 (coreIdea)
    { kind: "match", mgroup: "w1m2", diff: 2,
      q: "Intersectionality", answer: 2,
      options: [
        "Racial bias embedded in the algorithms, datasets, defaults, and design choices that shape digital life",
        "New technologies that reflect and reproduce existing inequities while being promoted as more objective or progressive than earlier systems",
        "The idea that race, gender, class, and other categories overlap, so harm at the intersection can be missed by looking at one category alone",
        "Your course-long map of your own relationship to digital technology, including moments of being seen, sorted, watched, or misread by a machine" ],
      why: "Crenshaw's intersectionality holds that categories of identity and power overlap, so harm at the intersection can be missed by single-category analysis." }, // grounded in: WEEKPAGE.BFS218[1] term "Intersectionality" (Crenshaw, 1991)
    { kind: "match", mgroup: "w1m2", diff: 2,
      q: "Personal Cartography", answer: 3,
      options: [
        "Racial bias embedded in the algorithms, datasets, defaults, and design choices that shape digital life",
        "New technologies that reflect and reproduce existing inequities while being promoted as more objective or progressive than earlier systems",
        "The idea that race, gender, class, and other categories overlap, so harm at the intersection can be missed by looking at one category alone",
        "Your course-long map of your own relationship to digital technology, including moments of being seen, sorted, watched, or misread by a machine" ],
      why: "The Personal Cartography is your map of your own relationship to digital technology, the tools you use and the moments you have felt seen, sorted, watched, or misread by a machine." }, // grounded in: WEEKPAGE.BFS218[1] term "Personal Cartography"
    { kind: "match", mgroup: "w1m2", diff: 2,
      q: "Techno-racism", answer: 0,
      options: [
        "Racial bias embedded in the algorithms, datasets, defaults, and design choices that shape digital life",
        "New technologies that reflect and reproduce existing inequities while being promoted as more objective or progressive than earlier systems",
        "The idea that race, gender, class, and other categories overlap, so harm at the intersection can be missed by looking at one category alone",
        "Your course-long map of your own relationship to digital technology, including moments of being seen, sorted, watched, or misread by a machine" ],
      why: "Techno-racism is racial bias embedded inside technical systems: the algorithms, datasets, defaults, and design choices that shape digital life." }, // grounded in: WEEKPAGE.BFS218[1] term "Techno-racism"
    { type: "short", diff: 2,
      q: "In two or three sentences, explain to a friend why this course says racism can operate through technology even when no programmer holds racist views.",
      model: "Techno-racism names racial bias embedded in the technical system itself: its algorithms, datasets, defaults, and design choices. Because the New Jim Code describes technologies that reproduce existing inequities while being promoted as objective or progressive, a system can do the old work of exclusion at scale without any individual intending it. That is why the course studies what systems do, not only what their makers believe." } // grounded in: WEEKPAGE.BFS218[1] concepts "Techno-racism" and "The New Jim Code"
  ],

  /* ---------- WEEK 2 : Critical Race Theory and the New Jim Code ---------- */
  "2": [
    { kind: "scenario", diff: 3,
      q: "Your workplace reviews a screening system after complaints of racially uneven results. The review concludes: we interviewed the developers and none of them are prejudiced, so there is no racism here. Using Week 2's critical race theory lens, what is wrong with that conclusion?",
      options: [
        "Nothing, because racism can only exist where a prejudiced person acts on it",
        "It uses an intentions lens where an outcomes lens is needed: structural racism lives in how a system is designed and routinely operates, so unequal outcomes can recur with no villain to find",
        "The review simply needed to interview more developers before deciding",
        "The conclusion is wrong because every algorithm is deliberately designed to discriminate" ],
      answer: 1,
      why: "The key analytic shift this week is from asking whether a system intends harm to asking what it does, to whom, and who pays. Structural racism can produce recurring unequal outcomes even when no single person intends them.",
      whyWrong: {
        0: "Critical race theory holds that racism is ordinary and structural, built into laws, institutions, and everyday systems, not only into individual prejudice.",
        2: "More interviews stay inside the intentions lens; the problem is the lens, not the sample size, because a guilty designer is not required for a racial harm.",
        3: "The course claims the opposite: a system with no discriminatory intent at all can still produce racial harm, which is why the outcomes lens matters." } }, // grounded in: WEEKPAGE.BFS218[2] concepts "Intentions versus outcomes" and "Structural and systemic racism"
    { kind: "scenario", diff: 3,
      q: "An audit of a hiring tool checks outcomes by race, then separately by gender, and finds no clear disadvantage on either axis. A colleague concludes the tool is fair for everyone. Drawing on Crenshaw's intersectionality, why might that conclusion be premature?",
      options: [
        "Because audits are never useful and should be abandoned",
        "Because fairness can only be judged by the designers' intentions",
        "Because gender never affects hiring outcomes, so checking it wasted time",
        "Because single-axis checks can miss a harm that lands specifically on people at the intersection, such as Black women, which neither the race check nor the gender check surfaces on its own" ],
      answer: 3,
      why: "Crenshaw shows that analysis running one axis at a time can obscure experiences produced where systems of power overlap; a harm at the intersection of race and gender can be invisible to both single-axis checks.",
      whyWrong: {
        0: "Intersectionality does not reject auditing; it asks the audit to examine overlapping categories rather than one axis at a time.",
        1: "Week 2's move is away from intentions and toward outcomes; the gap here is in how the outcomes were sliced, not in reading anyone's mind.",
        2: "The claim is not that gender is irrelevant; it is that race and gender together can produce a harm that either check alone would miss." } }, // grounded in: record crenshaw1991 (coreIdea)
    { kind: "match", mgroup: "w2m2", mlabel: "Match each Week 2 idea to its meaning.", diff: 2,
      q: "Structural racism", answer: 1,
      options: [
        "A broad field of scholarship examining how racism can be embedded in law, institutions, and ordinary systems, not only in individual prejudice",
        "Racism that lives in how systems are designed and routinely operate, so unequal outcomes recur even when no single person intends them",
        "The analysis of how overlapping systems such as race and gender can produce experiences that a one-axis account obscures",
        "The analytic shift from asking whether a system intends harm to asking what it does, to whom, and who pays" ],
      why: "Structural racism lives in how systems are designed and routinely operate, so unequal outcomes recur even when no single person intends them." }, // grounded in: WEEKPAGE.BFS218[2] term "Structural and systemic racism"
    { kind: "match", mgroup: "w2m2", diff: 2,
      q: "The outcomes lens", answer: 3,
      options: [
        "A broad field of scholarship examining how racism can be embedded in law, institutions, and ordinary systems, not only in individual prejudice",
        "Racism that lives in how systems are designed and routinely operate, so unequal outcomes recur even when no single person intends them",
        "The analysis of how overlapping systems such as race and gender can produce experiences that a one-axis account obscures",
        "The analytic shift from asking whether a system intends harm to asking what it does, to whom, and who pays" ],
      why: "The outcomes lens is the week's analytic shift: stop asking whether a system intends harm and ask what it does, to whom, and who pays." }, // grounded in: WEEKPAGE.BFS218[2] concept "Intentions versus outcomes"
    { kind: "match", mgroup: "w2m2", diff: 2,
      q: "Critical race theory", answer: 0,
      options: [
        "A broad field of scholarship examining how racism can be embedded in law, institutions, and ordinary systems, not only in individual prejudice",
        "Racism that lives in how systems are designed and routinely operate, so unequal outcomes recur even when no single person intends them",
        "The analysis of how overlapping systems such as race and gender can produce experiences that a one-axis account obscures",
        "The analytic shift from asking whether a system intends harm to asking what it does, to whom, and who pays" ],
      why: "Critical race theory is a broad field of scholarship examining how racism can be embedded in law, institutions, and ordinary systems, including systems that present themselves as neutral." }, // grounded in: WEEKPAGE.BFS218[2] term "Critical race theory (CRT)"
    { kind: "match", mgroup: "w2m2", diff: 2,
      q: "Intersectionality (Crenshaw, 1991)", answer: 2,
      options: [
        "A broad field of scholarship examining how racism can be embedded in law, institutions, and ordinary systems, not only in individual prejudice",
        "Racism that lives in how systems are designed and routinely operate, so unequal outcomes recur even when no single person intends them",
        "The analysis of how overlapping systems such as race and gender can produce experiences that a one-axis account obscures",
        "The analytic shift from asking whether a system intends harm to asking what it does, to whom, and who pays" ],
      why: "Crenshaw's intersectional analysis shows that systems such as race and gender can overlap, so a one-axis account can obscure experiences produced at their intersection." }, // grounded in: record crenshaw1991 (coreIdea)
    { type: "short", diff: 3,
      q: "A friend says: systems are just code, so a system cannot be racist unless its maker is. In two or three sentences, respond using structural racism and the intentions versus outcomes shift from this week.",
      model: "Structural racism lives in how systems are designed and how they routinely operate, so racially unequal outcomes can recur even when no single person intends them. That is why the course shifts from an intentions lens, which hunts for a guilty designer, to an outcomes lens, which asks what the system does, to whom, and who pays. On that view a system can produce racial harm with no racist maker anywhere in the story, and the evidence is in its outcomes, not its authors' hearts." } // grounded in: WEEKPAGE.BFS218[2] concepts "Structural and systemic racism" and "Intentions versus outcomes"
  ],

  /* ---------- WEEK 3 : Engineered Inequity ---------- */
  "3": [
    { kind: "scenario", diff: 3,
      q: "A city adopts a service app that makes reporting problems faster for neighbourhoods that already get quick responses, while doing little for neighbourhoods that were already underserved. Someone objects: the app did not create the gap, so it cannot be blamed. Using engineered inequity, what is the best reply?",
      options: [
        "Engineered inequity is exactly this pattern: the design does not invent the inequality, it amplifies an existing hierarchy, widening a gap that was already there while presenting itself as neutral or efficient",
        "The app is harmless because only technologies that create brand new inequality count as harmful",
        "The app is harmful only if its developers intended to disadvantage the underserved neighbourhoods",
        "The gap will close on its own once everyone downloads the app" ],
      answer: 0,
      why: "The key word for this dimension is amplify, not create: the inequality is already in society, and the design widens it, speeds it up, or hardens it while presenting itself as neutral or efficient.",
      whyWrong: {
        1: "The week's careful move is the opposite: engineered inequity is defined by amplifying existing hierarchies, so not creating the gap is no defence.",
        2: "The framework directs attention to design outcomes whether or not discriminatory intent can be shown; a design can widen a hierarchy with no ill will anywhere.",
        3: "Nothing in the reading supports self-correction through adoption; the concern is that the design itself widens the existing gap." } }, // grounded in: WEEKPAGE.BFS218[3] concepts "Engineered inequity" and "Amplify, not create"
    { kind: "scenario", diff: 2,
      q: "In a discussion, a classmate argues: a machine has no feelings, so asking whether robots are racist is a category mistake. How does Benjamin answer that question in Week 3?",
      options: [
        "She agrees that without hatred there can be no racial harm",
        "She argues machines become racist only when a racist programmer deliberately codes hatred into them",
        "She argues robots can be racist in effect: a machine built inside a society already structured by racism can carry that structure forward by design, no hatred and no racist programmer required",
        "She argues the question is unanswerable, so the course sets it aside" ],
      answer: 2,
      why: "Benjamin's answer to her framing question is that robots can be racist, not because a machine feels hatred, but because it is designed inside a society already structured by racism and carries that structure forward.",
      whyWrong: {
        0: "This keeps racism tied to emotion and intent, which is exactly the frame the question is built to move you past.",
        1: "The point of the question is that no deliberate racist coding is needed; the structure enters through design made inside an already unequal society.",
        3: "The course does not set the question aside; it uses it to move analysis from intent to design." } }, // grounded in: WEEKPAGE.BFS218[3] concept "Are robots racist?"
    { kind: "match", mgroup: "w3m2", mlabel: "Match each Week 3 idea to its meaning.", diff: 2,
      q: "Are robots racist?", answer: 2,
      options: [
        "Technology that, by its design, amplifies existing social hierarchies of race, class, and gender while presenting itself as neutral or efficient",
        "The idea that this dimension widens an inequality that already exists rather than inventing one from nothing",
        "Benjamin's framing question, answered by showing that a machine can do racial harm by design without hatred or a racist programmer",
        "Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair" ],
      why: "Are robots racist? is Benjamin's framing question for the dimension, and her answer is that a machine can do racial harm by design, with no hatred and no racist programmer." }, // grounded in: WEEKPAGE.BFS218[3] term "Are robots racist?"
    { kind: "match", mgroup: "w3m2", diff: 2,
      q: "The New Jim Code", answer: 3,
      options: [
        "Technology that, by its design, amplifies existing social hierarchies of race, class, and gender while presenting itself as neutral or efficient",
        "The idea that this dimension widens an inequality that already exists rather than inventing one from nothing",
        "Benjamin's framing question, answered by showing that a machine can do racial harm by design without hatred or a racist programmer",
        "Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair" ],
      why: "The New Jim Code is Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair; engineered inequity is its first dimension." }, // grounded in: WEEKPAGE.BFS218[3] term "The New Jim Code"
    { kind: "match", mgroup: "w3m2", diff: 2,
      q: "Engineered inequity, the first dimension", answer: 0,
      options: [
        "Technology that, by its design, amplifies existing social hierarchies of race, class, and gender while presenting itself as neutral or efficient",
        "The idea that this dimension widens an inequality that already exists rather than inventing one from nothing",
        "Benjamin's framing question, answered by showing that a machine can do racial harm by design without hatred or a racist programmer",
        "Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair" ],
      why: "Engineered inequity is technology that, by its design, amplifies existing social hierarchies of race, class, and gender while presenting itself as neutral or efficient." }, // grounded in: WEEKPAGE.BFS218[3] term "Engineered inequity"
    { kind: "match", mgroup: "w3m2", diff: 2,
      q: "The key word: amplify, not create", answer: 1,
      options: [
        "Technology that, by its design, amplifies existing social hierarchies of race, class, and gender while presenting itself as neutral or efficient",
        "The idea that this dimension widens an inequality that already exists rather than inventing one from nothing",
        "Benjamin's framing question, answered by showing that a machine can do racial harm by design without hatred or a racist programmer",
        "Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair" ],
      why: "Amplify, not create captures how engineered inequity widens an inequality that already exists rather than inventing one from nothing." }, // grounded in: WEEKPAGE.BFS218[3] term "Amplify, not create"
    { type: "short", diff: 3,
      q: "In two or three sentences, explain why the phrase amplify, not create matters for deciding how to fix engineered inequity.",
      model: "Engineered inequity does not conjure inequality out of nothing; it takes a hierarchy that already exists in society and makes it wider, faster, or harder to escape. Because the harm is built into design rather than into anyone's intentions, the fix has to be different design, not better intentions. Naming the amplification also keeps the response honest: removing one tool does not remove the underlying inequality, but design choices decide whether technology widens it or not." } // grounded in: WEEKPAGE.BFS218[3] concept "Amplify, not create" and term "Amplify, not create"
  ],

  /* ---------- WEEK 4 : Default Discrimination ---------- */
  "4": [
    { kind: "scenario", diff: 3,
      q: "Google Maps read Malcolm X Boulevard aloud as Malcolm Ten because the system treated the X as a Roman numeral. A commentator calls this a one-off glitch that a patch will fix. Using Benjamin's question from Week 4, what is the stronger reading?",
      options: [
        "It proves an engineer deliberately mocked the street name",
        "It is meaningless, because voice systems make random errors all the time",
        "It shows that street names should be removed from mapping apps entirely",
        "Ask whether the glitch is systemic: the failure is the predictable result of defaults built around one group's world, which is default discrimination rather than a random accident" ],
      answer: 3,
      why: "Benjamin describes database design as worldbuilding: the system read the X as a Roman numeral because of the assumptions projected into it. Her framing question asks whether a so-called glitch is really the predictable result of how the system was built.",
      whyWrong: {
        0: "Default discrimination needs no deliberate mockery; the harm arrives through defaults and assumptions, not through an intentional act.",
        1: "Calling it random is exactly what the glitch framing does; Benjamin's question exists to test whether the failure is instead predictable from the system's defaults.",
        2: "The reading points to redesigning assumptions and defaults, not to deleting features; removal is not the analytic move this week teaches." } }, // grounded in: WEEKPAGE.BFS218[4] concepts "Design as worldbuilding" and "Is the glitch systemic?"
    { kind: "scenario", diff: 2,
      q: "A design team ships a product with settings, sample data, and assumptions drawn entirely from the team's own world, and the product then fails repeatedly for users outside that world. No one on the team typed anything hateful. Which Week 4 idea names what happened?",
      options: [
        "Coded exposure, because the users were watched too closely",
        "Default discrimination: harm arriving through defaults that treat one group's world as the norm, which needs no racist designer, only an existing inequity left sitting in the settings",
        "Technological benevolence, because the product was promoted as an act of care",
        "The digital divide, because the users lacked internet access" ],
      answer: 1,
      why: "Default discrimination is Benjamin's second dimension: harm that arrives through the settings, data, and assumptions that treat one group's world as the norm, with no racist designer required.",
      whyWrong: {
        0: "Coded exposure is about the uneven distribution of visibility, being over-watched or unrecognized; this scenario is about defaults treating one world as normal.",
        2: "Technological benevolence concerns harm wrapped in the promise of help; nothing here turns on the product being sold as care.",
        3: "The users could connect fine; the failure came from the system's assumptions, not from missing access." } }, // grounded in: WEEKPAGE.BFS218[4] concept "Default discrimination"
    { kind: "match", mgroup: "w4m2", mlabel: "Match each Week 4 idea to its meaning.", diff: 2,
      q: "Design as worldbuilding", answer: 2,
      options: [
        "Harm that arrives through a system's settings, data, and assumptions when they treat one group's world as the norm",
        "Benjamin's question asking whether a repeated failure is really an accident or the predictable result of how the system was built",
        "Benjamin's phrase for how database design projects the programmers' assumptions and worldview into a system",
        "The way everyday tools such as credit scores, hiring algorithms, and risk assessments sort people at scale, carrying old inequities forward in their defaults" ],
      why: "Benjamin describes database design as an exercise in worldbuilding: programmers project their assumptions and view of the world into the system." }, // grounded in: WEEKPAGE.BFS218[4] term "Design as worldbuilding"
    { kind: "match", mgroup: "w4m2", diff: 2,
      q: "Automating anti-Blackness", answer: 3,
      options: [
        "Harm that arrives through a system's settings, data, and assumptions when they treat one group's world as the norm",
        "Benjamin's question asking whether a repeated failure is really an accident or the predictable result of how the system was built",
        "Benjamin's phrase for how database design projects the programmers' assumptions and worldview into a system",
        "The way everyday tools such as credit scores, hiring algorithms, and risk assessments sort people at scale, carrying old inequities forward in their defaults" ],
      why: "Automating anti-Blackness names how everyday tools such as credit scores, hiring algorithms, and risk assessments sift and sort people at scale, carrying old inequities forward in their defaults." }, // grounded in: WEEKPAGE.BFS218[4] term "Automating anti-Blackness"
    { kind: "match", mgroup: "w4m2", diff: 2,
      q: "Is the glitch systemic?", answer: 1,
      options: [
        "Harm that arrives through a system's settings, data, and assumptions when they treat one group's world as the norm",
        "Benjamin's question asking whether a repeated failure is really an accident or the predictable result of how the system was built",
        "Benjamin's phrase for how database design projects the programmers' assumptions and worldview into a system",
        "The way everyday tools such as credit scores, hiring algorithms, and risk assessments sort people at scale, carrying old inequities forward in their defaults" ],
      why: "Is the glitch systemic? asks whether a failure called a glitch is really an accident or the predictable result of how the system was built." }, // grounded in: WEEKPAGE.BFS218[4] term "Is the glitch systemic?"
    { kind: "match", mgroup: "w4m2", diff: 2,
      q: "Default discrimination, the second dimension", answer: 0,
      options: [
        "Harm that arrives through a system's settings, data, and assumptions when they treat one group's world as the norm",
        "Benjamin's question asking whether a repeated failure is really an accident or the predictable result of how the system was built",
        "Benjamin's phrase for how database design projects the programmers' assumptions and worldview into a system",
        "The way everyday tools such as credit scores, hiring algorithms, and risk assessments sort people at scale, carrying old inequities forward in their defaults" ],
      why: "Default discrimination is harm that arrives through the defaults of a system, the settings, data, and assumptions that treat one group's world as the norm." }, // grounded in: WEEKPAGE.BFS218[4] term "Default discrimination"
    { type: "short", diff: 3,
      q: "Pick a tool you use often and imagine it keeps failing for the same group of people. In two or three sentences, apply Benjamin's question, is the glitch systemic, and explain what the answer would change.",
      model: "A strong answer names a real tool and asks whether its repeated failure is a brief irregularity someone will patch or the predictable result of how the system was built. If the same error keeps landing on the same group, that pattern points past accident to defaults, data, and assumptions that treat one group's world as the norm. Answering systemic changes the response: instead of waiting for a patch, you examine and redesign the defaults themselves, because the failure was built in rather than random." } // grounded in: WEEKPAGE.BFS218[4] concepts "Is the glitch systemic?" and "Default discrimination"
  ],

  /* ---------- WEEK 5 : Coded Exposure ---------- */
  "5": [
    { kind: "scenario", diff: 3,
      q: "A facial recognition system identifies people at a protest with very high accuracy. An official argues that high accuracy means the system is safe to deploy there. What does Week 5's idea, accurate is not the same as safe, say about this?",
      options: [
        "The official is right: once error rates are low, no harm remains",
        "The system is unsafe only because it must still be making hidden errors",
        "Even a system that recognizes people correctly can put them in danger by watching and exposing them, so the real question is not only how often it is wrong but who it gets used against",
        "Accuracy and safety are the same thing measured on different scales" ],
      answer: 2,
      why: "A face scanner that works perfectly at a protest does not protect the people it identifies, it exposes them. The harm of being watched and tracked does not depend on the system making mistakes.",
      whyWrong: {
        0: "This equates low error with safety, which is the exact assumption the week's concept rejects: correct identification can itself be the exposure.",
        1: "Grounding the harm in hidden errors keeps the analysis inside accuracy; the week's point is that a fully accurate system can still endanger the people it sees.",
        3: "The concept separates the two on purpose: accuracy measures how often a system is wrong, while safety turns on who the system is used against." } }, // grounded in: WEEKPAGE.BFS218[5] concept "Accurate is not the same as safe"
    { kind: "scenario", diff: 3,
      q: "Your classmate reads that a commercial facial-analysis product performs well overall and concludes there is no bias problem. Based on the Gender Shades study, what did looking beyond the overall number reveal for the three systems tested?",
      options: [
        "Broken down by intersecting gender and skin type, error rates reached up to 34.7 percent for darker-skinned women while the maximum for lighter-skinned men was 0.8 percent, a disparity the overall number conceals",
        "The systems failed lighter-skinned men most often once the data was split",
        "The study proved one single cause of bias operating in every facial-analysis product on the market",
        "The overall numbers were fabricated, and the systems were equally inaccurate for everyone" ],
      answer: 0,
      why: "Buolamwini and Gebru built a benchmark balanced by gender and skin type and found darker-skinned women were the most misclassified group, with error rates up to 34.7 percent, against a maximum of 0.8 percent for lighter-skinned men; aggregate results can conceal that disparity.",
      whyWrong: {
        1: "This reverses the finding: lighter-skinned men had the lowest maximum error in the systems tested, not the highest.",
        2: "The audit measured disparities in three products without full access to their training processes, so it did not establish one cause for every system; that is the study's stated evidence boundary.",
        3: "The study did not allege fabrication, and it did not find equal inaccuracy; its point is that a strong-looking aggregate can conceal uneven failure that intersectional breakdowns reveal." } }, // grounded in: record buolamwini2018 (abstract, coreIdea, evidenceLimit)
    { kind: "match", mgroup: "w5m2", mlabel: "Match each Week 5 idea to its meaning.", diff: 2,
      q: "The coded gaze (Buolamwini)", answer: 1,
      options: [
        "The uneven, designed way technology makes some people highly visible and others invisible",
        "Whose face a system is built and tested to see well, and whose it is not",
        "The warning that a system can identify you correctly and still endanger you by exposing you, so ask who it gets used against",
        "Koenecke and colleagues' finding that five commercial systems averaged a 0.35 word error rate for Black speakers against 0.19 for white speakers" ],
      why: "The coded gaze is Joy Buolamwini's name for the way a system is designed and tested around some faces and not others." }, // grounded in: WEEKPAGE.BFS218[5] term "The coded gaze" (Buolamwini & Gebru, 2018)
    { kind: "match", mgroup: "w5m2", diff: 2,
      q: "Speech recognition bias", answer: 3,
      options: [
        "The uneven, designed way technology makes some people highly visible and others invisible",
        "Whose face a system is built and tested to see well, and whose it is not",
        "The warning that a system can identify you correctly and still endanger you by exposing you, so ask who it gets used against",
        "Koenecke and colleagues' finding that five commercial systems averaged a 0.35 word error rate for Black speakers against 0.19 for white speakers" ],
      why: "Koenecke and colleagues tested five commercial speech systems and found an average word error rate of 0.35 for Black speakers against 0.19 for white speakers, bounded to the speakers, audio, and systems tested." }, // grounded in: record koenecke2020 (abstract, coreIdea)
    { kind: "match", mgroup: "w5m2", diff: 2,
      q: "Coded exposure, the third dimension", answer: 0,
      options: [
        "The uneven, designed way technology makes some people highly visible and others invisible",
        "Whose face a system is built and tested to see well, and whose it is not",
        "The warning that a system can identify you correctly and still endanger you by exposing you, so ask who it gets used against",
        "Koenecke and colleagues' finding that five commercial systems averaged a 0.35 word error rate for Black speakers against 0.19 for white speakers" ],
      why: "Coded exposure is the uneven, designed way technology makes some people highly visible and others invisible." }, // grounded in: WEEKPAGE.BFS218[5] term "Coded exposure"
    { kind: "match", mgroup: "w5m2", diff: 2,
      q: "Accurate is not the same as safe", answer: 2,
      options: [
        "The uneven, designed way technology makes some people highly visible and others invisible",
        "Whose face a system is built and tested to see well, and whose it is not",
        "The warning that a system can identify you correctly and still endanger you by exposing you, so ask who it gets used against",
        "Koenecke and colleagues' finding that five commercial systems averaged a 0.35 word error rate for Black speakers against 0.19 for white speakers" ],
      why: "Even a system that recognizes you correctly can put you in danger by watching and exposing you, so the real question is who the system gets used against." }, // grounded in: WEEKPAGE.BFS218[5] concept "Accurate is not the same as safe"
    { type: "short", diff: 3,
      q: "In two or three sentences, explain how being over-watched and being unrecognized can both harm the same community, using the idea of coded exposure.",
      model: "Coded exposure names the uneven, designed way technology hands out visibility: some people are watched, scanned, and tracked far more than others, while some are barely recognized at all. Being over-watched is a harm because surveillance exposes people to scrutiny and risk, and being unseen is also a harm when a system cannot read your face or will not serve you. These are not opposites: depending on the system and setting, racialized communities can experience both at once." } // grounded in: WEEKPAGE.BFS218[5] concepts "Visibility is handed out by design" and "Being seen can hurt, and so can being unseen"
  ],

  /* ---------- WEEK 6 : Algorithms in Canada ---------- */
  "6": [
    { kind: "scenario", diff: 3,
      q: "The Privacy Commissioner found that the RCMP's use of Clearview AI facial recognition violated federal privacy law, but only after the tool had already been deployed. Singh argues this pattern is not an accident. What structural problem does he point to?",
      options: [
        "Canadian police are forbidden from using any algorithmic tool, so the deployment was a rogue act",
        "Algorithmic policing tools have largely been authorized through court rulings and common law rather than dedicated legislation, so oversight is reactive and arrives only after harm has happened",
        "The federal Privacy Act no longer exists, leaving no law that could apply",
        "The finding shows Canadian oversight always catches unlawful tools before they are deployed" ],
      answer: 1,
      why: "Singh's central argument is that these surveillance tools have been authorized through Supreme Court jurisprudence and common-law authorities rather than legislation passed by Parliament, which is why a regulator could only catch the Clearview deployment after the fact.",
      whyWrong: {
        0: "No source claims a blanket prohibition; the problem Singh names is the absence of dedicated legislation governing these tools, not a ban that was broken.",
        2: "The OPC finding was made under the federal Privacy Act, so the statute clearly exists; the gap is the lack of dedicated law governing the technologies in advance.",
        3: "The Clearview case shows the opposite: the finding arrived after deployment, which is exactly the reactive oversight Singh criticizes." } }, // grounded in: records opc2021 and singh2021 (and the opc2021|singh2021 synthesis)
    { kind: "scenario", diff: 3,
      q: "After reading the 2020 report To Surveil and Predict, a classmate posts: this report proves algorithmic policing is in widespread use across Canada. What did the report actually say about its own evidence?",
      options: [
        "It confirmed that every Canadian police service uses predictive policing",
        "It refused to discuss any Canadian examples at all",
        "It found that no Canadian police service has ever used an algorithmic tool",
        "It analysed Canadian examples and possible uses and their human rights risks, while stating that the factual record was incomplete and that widespread use did not appear established at the time" ],
      answer: 3,
      why: "Robertson, Khoo, and Song analysed documented Canadian examples and possible uses of predictive policing, facial recognition, and algorithmic social-media surveillance, and they explicitly described an incomplete factual record without establishing widespread use.",
      whyWrong: {
        0: "The authors stated the opposite: widespread use did not appear established at the time of writing, and the factual record was incomplete.",
        1: "The report is built on Canadian examples and possible uses; the caution is about prevalence claims, not about discussing cases.",
        2: "The report documents real Canadian examples; the boundary is that examples do not add up to proof of widespread use." } }, // grounded in: record robertson2020 (coreIdea, evidenceLimit)
    { kind: "match", mgroup: "w6m2", mlabel: "Match each Week 6 idea to the source it comes from.", diff: 2,
      q: "The oversight gap", answer: 2,
      options: [
        "Canada's privacy regulator concluded that the RCMP's use of a facial recognition tool violated federal privacy law",
        "Molnar's analysis of how border technologies can render people on the move as security objects under weak oversight",
        "The space that opens when powerful tools are authorized by court rulings rather than debated legislation",
        "The pattern Nagra and Maurutto's interview participants described: being treated as potential security risks through racialized and religious categorization" ],
      why: "The oversight gap names the space that opens when a technology is authorized by court rulings rather than debated legislation, so powerful tools run without clear rules; the idea comes from Singh." }, // grounded in: WEEKPAGE.BFS218[6] term "Oversight gap" (record singh2021)
    { kind: "match", mgroup: "w6m2", diff: 2,
      q: "The OPC finding on Clearview AI", answer: 0,
      options: [
        "Canada's privacy regulator concluded that the RCMP's use of a facial recognition tool violated federal privacy law",
        "Molnar's analysis of how border technologies can render people on the move as security objects under weak oversight",
        "The space that opens when powerful tools are authorized by court rulings rather than debated legislation",
        "The pattern Nagra and Maurutto's interview participants described: being treated as potential security risks through racialized and religious categorization" ],
      why: "The Office of the Privacy Commissioner of Canada found that the RCMP's use of Clearview AI facial recognition violated federal privacy law." }, // grounded in: record opc2021 (coreIdea)
    { kind: "match", mgroup: "w6m2", diff: 2,
      q: "The security category", answer: 3,
      options: [
        "Canada's privacy regulator concluded that the RCMP's use of a facial recognition tool violated federal privacy law",
        "Molnar's analysis of how border technologies can render people on the move as security objects under weak oversight",
        "The space that opens when powerful tools are authorized by court rulings rather than debated legislation",
        "The pattern Nagra and Maurutto's interview participants described: being treated as potential security risks through racialized and religious categorization" ],
      why: "The security category is the course term for the pattern described by Nagra and Maurutto's participants: being treated as potential security risks through racialized and religious categorization, with the evidence bounded to that participant group." }, // grounded in: WEEKPAGE.BFS218[6] term "The security category" (record nagra2016)
    { kind: "match", mgroup: "w6m2", diff: 2,
      q: "Logics of exclusion", answer: 1,
      options: [
        "Canada's privacy regulator concluded that the RCMP's use of a facial recognition tool violated federal privacy law",
        "Molnar's analysis of how border technologies can render people on the move as security objects under weak oversight",
        "The space that opens when powerful tools are authorized by court rulings rather than debated legislation",
        "The pattern Nagra and Maurutto's interview participants described: being treated as potential security risks through racialized and religious categorization" ],
      why: "Logics of exclusion is Molnar's analysis of how border technologies can reinforce exclusion by rendering people on the move as security objects under weak oversight." }, // grounded in: WEEKPAGE.BFS218[6] term "Logics of exclusion" (record molnar2023)
    { type: "short", diff: 3,
      q: "In two or three sentences, explain the difference between a possible use, a documented use, and a legal finding, using this week's Canadian sources.",
      model: "A possible use is a tool a source discusses without establishing deployment: Robertson, Khoo, and Song analysed Canadian examples and possible uses while stating their factual record was incomplete. A documented use is a deployment that actually happened, such as the RCMP's use of Clearview AI. A legal finding goes one step further: the Office of the Privacy Commissioner concluded that this documented use violated federal privacy law. Keeping the three separate protects you from turning one case into a claim about prevalence." } // grounded in: records robertson2020 and opc2021 (and the opc2021|robertson2020 synthesis)
  ],

  /* ---------- WEEK 7 : Assembling the Anatomy ---------- */
  "7": [
    { kind: "scenario", diff: 3,
      q: "A tenant screening service leaves an old, inequitable pattern sitting in its default risk settings, so the same group keeps being scored as risky even though nobody set out to discriminate. Assembling the anatomy, which dimension is at work here?",
      options: [
        "Default discrimination, because the harm arrives through settings, data, and assumptions that treat one group's world as normal, and the repeating error invites the question of whether the glitch is systemic",
        "Engineered inequity, because the service invented an inequality that did not exist before",
        "Technological benevolence, because the service was promoted as an act of care",
        "No dimension fits, because a dimension applies only when a designer intends the harm" ],
      answer: 0,
      why: "Default discrimination is the dimension where harm rides the defaults: settings, data, and assumptions treating one group's world as normal, with the key question being whether the recurring failure is systemic.",
      whyWrong: {
        1: "Engineered inequity names design that actively amplifies an existing hierarchy, and the anatomy's careful word is amplify, not create; no dimension claims technology invents inequality from nothing.",
        2: "Technological benevolence turns on harm wrapped in the promise of help; nothing in this case depends on a story of care.",
        3: "The whole anatomy works without intent: each dimension describes how systemic racism enters technology even when no one means harm." } }, // grounded in: WEEKPAGE.BFS218[7] concept "Default discrimination: ride the defaults"
    { kind: "scenario", diff: 3,
      q: "While assembling your map, you notice one Canadian policing case seems to involve uneven visibility, harmful defaults, and an amplified hierarchy all at once. What does Week 7 say about that?",
      options: [
        "You must pick exactly one dimension per system, because the dimensions never overlap",
        "Overlap means you have analysed the case incorrectly",
        "That is expected: the dimensions are not separate machines but three ways the same systemic racism enters technology, and a single real system can show more than one at once",
        "Overlap shows the case is not really an example of the New Jim Code" ],
      answer: 2,
      why: "Week 7's assembling move is exactly this: the three dimensions are three ways the same systemic racism enters technology, and a single real system can show more than one at once, as the Canadian cases did.",
      whyWrong: {
        0: "The week explicitly rejects the one-dimension-per-system picture; assembling the anatomy means seeing how the whole system produces harm.",
        1: "Finding several dimensions in one case is a sign of careful analysis, not an error, because the dimensions describe one anatomy.",
        3: "Showing multiple dimensions makes a case a fuller example of the New Jim Code, not a weaker one." } }, // grounded in: WEEKPAGE.BFS218[7] concept "Not separate machines: one anatomy"
    { kind: "match", mgroup: "w7m2", mlabel: "Match each part of the assembled anatomy to its description.", diff: 2,
      q: "Coded exposure (dimension three)", answer: 2,
      options: [
        "Technology that, by its design, amplifies an existing hierarchy; the key word is amplify, not create",
        "Harm that arrives through settings, data, and assumptions treating one group's world as normal; the key question is whether the glitch is systemic",
        "The uneven, designed distribution of visibility; the key question is whether visibility is a trap",
        "Law enforcement's use of data-driven tools such as predictive policing, facial recognition, and social media surveillance" ],
      why: "Coded exposure is the third dimension: the uneven, designed distribution of visibility, with the key question being whether visibility is a trap." }, // grounded in: WEEKPAGE.BFS218[7] term "Coded exposure (dimension three)"
    { kind: "match", mgroup: "w7m2", diff: 2,
      q: "Engineered inequity (dimension one)", answer: 0,
      options: [
        "Technology that, by its design, amplifies an existing hierarchy; the key word is amplify, not create",
        "Harm that arrives through settings, data, and assumptions treating one group's world as normal; the key question is whether the glitch is systemic",
        "The uneven, designed distribution of visibility; the key question is whether visibility is a trap",
        "Law enforcement's use of data-driven tools such as predictive policing, facial recognition, and social media surveillance" ],
      why: "Engineered inequity is the first dimension: technology that, by its design, amplifies an existing hierarchy, and the key word is amplify, not create." }, // grounded in: WEEKPAGE.BFS218[7] term "Engineered inequity (dimension one)"
    { kind: "match", mgroup: "w7m2", diff: 2,
      q: "Algorithmic policing", answer: 3,
      options: [
        "Technology that, by its design, amplifies an existing hierarchy; the key word is amplify, not create",
        "Harm that arrives through settings, data, and assumptions treating one group's world as normal; the key question is whether the glitch is systemic",
        "The uneven, designed distribution of visibility; the key question is whether visibility is a trap",
        "Law enforcement's use of data-driven tools such as predictive policing, facial recognition, and social media surveillance" ],
      why: "Algorithmic policing is law enforcement's use of data-driven tools such as predictive policing, facial recognition, and social media surveillance, the Canadian ground where the dimensions appeared together." }, // grounded in: WEEKPAGE.BFS218[7] term "Algorithmic policing" (record robertson2020)
    { kind: "match", mgroup: "w7m2", diff: 2,
      q: "Default discrimination (dimension two)", answer: 1,
      options: [
        "Technology that, by its design, amplifies an existing hierarchy; the key word is amplify, not create",
        "Harm that arrives through settings, data, and assumptions treating one group's world as normal; the key question is whether the glitch is systemic",
        "The uneven, designed distribution of visibility; the key question is whether visibility is a trap",
        "Law enforcement's use of data-driven tools such as predictive policing, facial recognition, and social media surveillance" ],
      why: "Default discrimination is the second dimension: harm that arrives through defaults treating one group's world as normal, with the key question being whether the glitch is systemic." }, // grounded in: WEEKPAGE.BFS218[7] term "Default discrimination (dimension two)"
    { type: "short", diff: 3,
      q: "In two or three sentences, explain to a classmate how the three dimensions you assembled this week differ, using one key word or question for each.",
      model: "Engineered inequity is design that actively widens an existing hierarchy, and its key word is amplify, not create. Default discrimination is harm that rides the defaults, the settings and assumptions that treat one group's world as normal, and its key question is whether the glitch is systemic. Coded exposure is the uneven, designed distribution of visibility, and its key question is whether visibility is a trap; together they are not separate machines but three ways the same systemic racism enters technology." } // grounded in: WEEKPAGE.BFS218[7] concepts (all four, "one anatomy")
  ],

  /* ---------- WEEK 8 : Indigenous Data Sovereignty ---------- */
  "8": [
    { kind: "scenario", diff: 3,
      q: "A university team wants to collect health data from a First Nations community, store it on university servers, and decide later who can see it. Under the OCAP principles, what is the core problem?",
      options: [
        "The data would be too expensive for the university to store",
        "Health data can never be collected in any community for any purpose",
        "The problem is purely technical: university servers might be hacked",
        "OCAP holds that a First Nations community owns its information, controls how it is collected and used, has access to it, and can possess it, so an outside institution deciding those questions reverses that governance" ],
      answer: 3,
      why: "OCAP names four First Nations data governance principles, Ownership, Control, Access, and Possession, stewarded by the First Nations Information Governance Centre; the plan puts every one of those decisions in outside hands.",
      whyWrong: {
        0: "Cost is not the issue OCAP raises; the principles concern who governs the data, not what storage costs.",
        1: "OCAP does not prohibit data collection; it establishes that the community governs collection, use, access, and possession.",
        2: "Security matters, but the core problem is governance: even perfectly secure servers would still leave ownership and control with the wrong party." } }, // grounded in: WEEKPAGE.BFS218[8] concept "OCAP: Ownership, Control, Access, Possession" (FNIGC, 2014)
    { kind: "scenario", diff: 3,
      q: "For an essay on internet access today, a student quotes connectivity figures from Smillie-Adjarkwa's 2005 report as if they describe current conditions in every Indigenous community. What is wrong with that use of the source?",
      options: [
        "Nothing, because published numbers stay accurate forever",
        "The report is historical evidence of access debates: its figures and some terminology are dated, it does not provide current estimates, and it cannot be generalized across distinct Indigenous Peoples and communities",
        "The report is unusable because internship reports never contain evidence",
        "The figures were wrong even in 2005, so the report proves the opposite of what it says" ],
      answer: 1,
      why: "The course flags this exact evidence boundary: the 2005 report synthesized then-available connectivity data and is useful as historical evidence, but its figures must not be presented as current or generalized across distinct peoples.",
      whyWrong: {
        0: "Connectivity data is time-bound; treating 2005 figures as current misrepresents what the source can support.",
        2: "The report has real value as historical evidence of access debates; the correction is about how it is used, not whether it counts.",
        3: "Nothing in the corpus says the 2005 figures were wrong for their time; the problem is projecting them onto the present and onto all communities." } }, // grounded in: record smillie2005 (abstract, evidenceLimit)
    { kind: "match", mgroup: "w8m2", mlabel: "Match each Week 8 framework or idea to its description.", diff: 2,
      q: "The OCAP principles", answer: 1,
      options: [
        "The right of First Nations, Inuit, and Métis peoples to govern the collection, ownership, and use of data about their own communities, lands, and knowledge",
        "Four First Nations data governance principles, Ownership, Control, Access, and Possession, stewarded as a registered trademark by the First Nations Information Governance Centre",
        "The pattern in which AI tools built elsewhere are imposed on communities while power and benefit flow back to those who built them",
        "Collective benefit, Authority to control, Responsibility, and Ethics: people and purpose principles from the Global Indigenous Data Alliance" ],
      why: "OCAP names Ownership, Control, Access, and Possession, four First Nations data governance principles stewarded by the First Nations Information Governance Centre." }, // grounded in: WEEKPAGE.BFS218[8] term "OCAP (Ownership, Control, Access, Possession)"
    { kind: "match", mgroup: "w8m2", diff: 2,
      q: "Indigenous data sovereignty (the week's core idea)", answer: 0,
      options: [
        "The right of First Nations, Inuit, and Métis peoples to govern the collection, ownership, and use of data about their own communities, lands, and knowledge",
        "Four First Nations data governance principles, Ownership, Control, Access, and Possession, stewarded as a registered trademark by the First Nations Information Governance Centre",
        "The pattern in which AI tools built elsewhere are imposed on communities while power and benefit flow back to those who built them",
        "Collective benefit, Authority to control, Responsibility, and Ethics: people and purpose principles from the Global Indigenous Data Alliance" ],
      why: "Indigenous data sovereignty is the right of First Nations, Inuit, and Métis peoples to govern the collection, ownership, and use of data about their own communities, lands, and knowledge." }, // grounded in: WEEKPAGE.BFS218[8] term "Indigenous data sovereignty"
    { kind: "match", mgroup: "w8m2", diff: 2,
      q: "CARE Principles", answer: 3,
      options: [
        "The right of First Nations, Inuit, and Métis peoples to govern the collection, ownership, and use of data about their own communities, lands, and knowledge",
        "Four First Nations data governance principles, Ownership, Control, Access, and Possession, stewarded as a registered trademark by the First Nations Information Governance Centre",
        "The pattern in which AI tools built elsewhere are imposed on communities while power and benefit flow back to those who built them",
        "Collective benefit, Authority to control, Responsibility, and Ethics: people and purpose principles from the Global Indigenous Data Alliance" ],
      why: "The CARE Principles, Collective benefit, Authority to control, Responsibility, and Ethics, come from the Global Indigenous Data Alliance and sit alongside data-sharing rules to keep Indigenous rights in view." }, // grounded in: WEEKPAGE.BFS218[8] term "CARE Principles for Indigenous Data Governance" (GIDA, 2019)
    { kind: "match", mgroup: "w8m2", diff: 2,
      q: "Algorithmic colonialism", answer: 2,
      options: [
        "The right of First Nations, Inuit, and Métis peoples to govern the collection, ownership, and use of data about their own communities, lands, and knowledge",
        "Four First Nations data governance principles, Ownership, Control, Access, and Possession, stewarded as a registered trademark by the First Nations Information Governance Centre",
        "The pattern in which AI tools built elsewhere are imposed on communities while power and benefit flow back to those who built them",
        "Collective benefit, Authority to control, Responsibility, and Ethics: people and purpose principles from the Global Indigenous Data Alliance" ],
      why: "Algorithmic colonialism is the pattern Mohamed, Png, and Isaac warn against: tools built elsewhere are imposed on communities while power and benefit flow back outward to those who built them." }, // grounded in: WEEKPAGE.BFS218[8] term "Algorithmic colonialism" (record mohamed2020)
    { type: "short", diff: 3,
      q: "In two or three sentences, explain why this week insists that OCAP is specifically a First Nations framework rather than a template for all Indigenous Peoples.",
      model: "OCAP is a set of First Nations principles stewarded by the First Nations Information Governance Centre, and the week's aim is accurate application: no framework is treated as interchangeable across all Indigenous Peoples or all communities. The broader CARE Principles from the Global Indigenous Data Alliance sit alongside it, and the course's decolonial-AI reading is distinct from both. Collapsing these into one generic template would repeat the erasure that data sovereignty resists, because distinct peoples hold the right to govern their own data on their own terms." } // grounded in: WEEKPAGE.BFS218[8] purpose and concepts "OCAP" and "Indigenous data sovereignty"
  ],

  /* ---------- WEEK 9 : Technological Benevolence ---------- */
  "9": [
    { kind: "scenario", diff: 3,
      q: "A company markets a monitoring app for your neighbourhood as a safety upgrade offered free to residents, and criticism of it is dismissed as opposing help. Which Week 9 idea explains why this framing makes the harm harder to fight?",
      options: [
        "The oversight gap, because no dedicated legislation governs the app",
        "Amplify, not create, because the app widens a gap that already exists",
        "The benevolence trap: a tool sold as care disarms criticism in advance, so questioning it feels like refusing help, and a harm you cannot name is one you cannot resist",
        "Design as worldbuilding, because the developers projected their assumptions into a database" ],
      answer: 2,
      why: "The benevolence trap is what makes this dimension dangerous: a tool sold as the solution is harder to question than one that is openly harmful, so the harm is not only done but hard to name.",
      whyWrong: {
        0: "The oversight gap is Week 6's idea about tools authorized by court rulings rather than legislation; the difficulty here comes from the framing of care, not the legal basis.",
        1: "Amplify, not create describes engineered inequity's relationship to existing hierarchies; it does not explain why criticism of this app is being disarmed.",
        3: "Design as worldbuilding concerns assumptions projected into databases and defaults; the mechanism in this scenario is the language of help itself." } }, // grounded in: WEEKPAGE.BFS218[9] concept "The benevolence trap"
    { kind: "scenario", diff: 3,
      q: "After criticism, a company announces a fix for its harmful system. Benjamin's working question for Week 9 asks you to test that announcement. What is the test?",
      options: [
        "Ask what the fix actually changes and for whom: a real repair changes who pays, while a comfortable story makes harm look solved with the cost still carried by the same people",
        "Ask whether the fix was expensive, since costly fixes always work",
        "Ask whether the company apologized sincerely enough",
        "Accept the fix, because an announced solution ends the analysis" ],
      answer: 0,
      why: "Will the fix fix it? is Benjamin's working question for this dimension: for any proposed fix, ask what it actually changes and for whom, to separate a real repair from a comfortable story about one.",
      whyWrong: {
        1: "Price is not the test; a costly change can still leave who carries the cost untouched.",
        2: "Sincerity keeps the focus on intentions, and the course has already moved analysis from intentions to outcomes.",
        3: "Treating an announcement as the end of analysis is the benevolence trap at work: the story of a solution can be what lets the harm survive." } }, // grounded in: WEEKPAGE.BFS218[9] concept "Will the fix fix it?"
    { kind: "match", mgroup: "w9m2", mlabel: "Match each Week 9 idea to its meaning.", diff: 2,
      q: "Will the fix fix it?", answer: 2,
      options: [
        "Technology promoted as a fix, an upgrade, or an act of help that still carries existing harms",
        "The difficulty this dimension creates: a tool sold as the solution is harder to question than one that is openly harmful",
        "Benjamin's working test: ask what a proposed solution actually changes and for whom",
        "The section where Benjamin shows how the disposability of machines framed as helpers travels with the denigration of racialized people" ],
      why: "Will the fix fix it? is Benjamin's working test for any proposed solution: ask what it actually changes and for whom." }, // grounded in: WEEKPAGE.BFS218[9] term "Will the fix fix it?"
    { kind: "match", mgroup: "w9m2", diff: 2,
      q: "Raising Robots", answer: 3,
      options: [
        "Technology promoted as a fix, an upgrade, or an act of help that still carries existing harms",
        "The difficulty this dimension creates: a tool sold as the solution is harder to question than one that is openly harmful",
        "Benjamin's working test: ask what a proposed solution actually changes and for whom",
        "The section where Benjamin shows how the disposability of machines framed as helpers travels with the denigration of racialized people" ],
      why: "Raising Robots is the section where Benjamin examines machines framed as helpers, including police throwbots, and shows how the disposability of robots travels with the denigration of racialized people." }, // grounded in: WEEKPAGE.BFS218[9] term "Raising Robots"
    { kind: "match", mgroup: "w9m2", diff: 2,
      q: "The benevolence trap (what makes it dangerous)", answer: 1,
      options: [
        "Technology promoted as a fix, an upgrade, or an act of help that still carries existing harms",
        "The difficulty this dimension creates: a tool sold as the solution is harder to question than one that is openly harmful",
        "Benjamin's working test: ask what a proposed solution actually changes and for whom",
        "The section where Benjamin shows how the disposability of machines framed as helpers travels with the denigration of racialized people" ],
      why: "The benevolence trap is what makes this dimension dangerous: a tool sold as the solution is harder to question than one that is openly harmful, so the harm is hard to name." }, // grounded in: WEEKPAGE.BFS218[9] term "The benevolence trap"
    { kind: "match", mgroup: "w9m2", diff: 2,
      q: "Technological benevolence, the fourth dimension", answer: 0,
      options: [
        "Technology promoted as a fix, an upgrade, or an act of help that still carries existing harms",
        "The difficulty this dimension creates: a tool sold as the solution is harder to question than one that is openly harmful",
        "Benjamin's working test: ask what a proposed solution actually changes and for whom",
        "The section where Benjamin shows how the disposability of machines framed as helpers travels with the denigration of racialized people" ],
      why: "Technological benevolence is Benjamin's fourth dimension of the New Jim Code: technology promoted as good for us, a fix, an upgrade, an act of help, that still carries existing harms." }, // grounded in: WEEKPAGE.BFS218[9] term "Technological benevolence"
    { type: "short", diff: 3,
      q: "In two or three sentences, explain why Benjamin treats the promise of help itself as part of how harm survives, not just a marketing detail.",
      model: "In technological benevolence, the benevolent framing is not a side effect; it is part of how the harm survives, because help is hard to argue with. A tool sold as the solution disarms criticism in advance, so questioning it can feel like opposing progress or refusing care, and a harm you cannot name is one you cannot resist. That is why the week's discipline is to look past the framing and ask what the tool actually changes and for whom." } // grounded in: WEEKPAGE.BFS218[9] concepts "Help can be how harm survives" and "The benevolence trap"
  ],

  /* ---------- WEEK 10 : Algorithmic Gatekeeping ---------- */
  "10": [
    { kind: "scenario", diff: 3,
      q: "A college plans to adopt a model that predicts which students will struggle, and to send extra support to those flagged as at risk. Leadership notes the model's overall accuracy is strong. Based on Bird, Castleman, and Song, what should the college examine before trusting the plan?",
      options: [
        "Nothing further, because strong overall accuracy guarantees fair allocation",
        "The decision rule itself: in their simulations from one community college system, some at-risk Black students received fewer resources than lower-risk white students, and the disparity shifted with the outcome, threshold, and model",
        "Only the cost of the software licence",
        "Whether students like the idea of prediction, since preference is the only issue the study raises" ],
      answer: 1,
      why: "The study's lesson is that an institution must audit the decision rule, not only the model's overall accuracy: at some risk thresholds, Black students near the cut-off were less likely than otherwise similar white students to be classified as at risk and receive support.",
      whyWrong: {
        0: "Overall accuracy can conceal unequal allocation at the cut-off; that concealment is precisely what the simulations exposed.",
        2: "The study concerns the equity of allocation, not procurement cost; a cheap tool can still distribute support inequitably.",
        3: "The study measured allocation disparities across models, outcomes, and thresholds; it is an audit question, not a preference survey." } }, // grounded in: record bird2023 (abstract, coreIdea, evidenceLimit)
    { kind: "scenario", diff: 3,
      q: "A vendor tells a hiring committee that after retraining the model on better data, the fairness problem is fully solved. Using Devlin's frame of inequality within and without the algorithm, what is missing from that assurance?",
      options: [
        "Nothing, because bias lives only inside training data",
        "The assurance fails only because retraining always makes models worse",
        "The vendor should have deleted the model instead, since Devlin argues all AI must end",
        "The without side: who builds and deploys the system and who is subject to it, because fixing the data does not fix who holds the power" ],
      answer: 3,
      why: "Devlin argues AI inequality sits both within the algorithm, in data and design, and without it, in who builds and deploys these systems; a data fix addresses only the first half.",
      whyWrong: {
        0: "Confining bias to training data is the exact view Devlin's within-and-without frame is built to correct.",
        1: "Nothing in the chapter claims retraining degrades models; the gap is about power, not model quality.",
        2: "Devlin's chapter analyses power around AI; it does not argue that every model must be deleted." } }, // grounded in: record devlin2023 (coreIdea)
    { kind: "match", mgroup: "w10m2", mlabel: "Match each Week 10 idea to its source or meaning.", diff: 2,
      q: "Bias in predicting success", answer: 1,
      options: [
        "Automated systems deciding who is granted access in hiring, lending, and education, operating at scale and at speed",
        "The finding that simulated resource allocation could give some at-risk Black students fewer resources than lower-risk white students, varying by model, outcome, and threshold",
        "Devlin's distinction between inequality in a system's data and design and inequality in who builds these systems and who is subject to them",
        "Noble's argument that search and ranking systems presented as neutral can reproduce racism and sexism, especially against Black women" ],
      why: "Bird, Castleman, and Song found that simulated allocation could give some at-risk Black students fewer resources than lower-risk white students, with results changing by model, outcome, and threshold." }, // grounded in: WEEKPAGE.BFS218[10] term "Bias in predicting success" (record bird2023)
    { kind: "match", mgroup: "w10m2", diff: 2,
      q: "Algorithms of oppression", answer: 3,
      options: [
        "Automated systems deciding who is granted access in hiring, lending, and education, operating at scale and at speed",
        "The finding that simulated resource allocation could give some at-risk Black students fewer resources than lower-risk white students, varying by model, outcome, and threshold",
        "Devlin's distinction between inequality in a system's data and design and inequality in who builds these systems and who is subject to them",
        "Noble's argument that search and ranking systems presented as neutral can reproduce racism and sexism, especially against Black women" ],
      why: "Noble argues that search and ranking systems presented as neutral can reproduce racism and sexism, especially against Black women; a ranking is a gate too." }, // grounded in: WEEKPAGE.BFS218[10] term "Algorithms of oppression" (record noble2018)
    { kind: "match", mgroup: "w10m2", diff: 2,
      q: "Algorithmic gatekeeping (the week's core idea)", answer: 0,
      options: [
        "Automated systems deciding who is granted access in hiring, lending, and education, operating at scale and at speed",
        "The finding that simulated resource allocation could give some at-risk Black students fewer resources than lower-risk white students, varying by model, outcome, and threshold",
        "Devlin's distinction between inequality in a system's data and design and inequality in who builds these systems and who is subject to them",
        "Noble's argument that search and ranking systems presented as neutral can reproduce racism and sexism, especially against Black women" ],
      why: "Algorithmic gatekeeping is the use of automated systems to decide who is granted access, such as who is hired, approved for credit, or admitted, at scale and at speed." }, // grounded in: WEEKPAGE.BFS218[10] term "Algorithmic gatekeeping" (record devlin2023)
    { kind: "match", mgroup: "w10m2", diff: 2,
      q: "Inequality within and without the algorithm", answer: 2,
      options: [
        "Automated systems deciding who is granted access in hiring, lending, and education, operating at scale and at speed",
        "The finding that simulated resource allocation could give some at-risk Black students fewer resources than lower-risk white students, varying by model, outcome, and threshold",
        "Devlin's distinction between inequality in a system's data and design and inequality in who builds these systems and who is subject to them",
        "Noble's argument that search and ranking systems presented as neutral can reproduce racism and sexism, especially against Black women" ],
      why: "Devlin distinguishes inequality inside the system, in its data and design, from inequality outside it, in who builds these systems and who is subject to them." }, // grounded in: WEEKPAGE.BFS218[10] term "Inequality within and without the algorithm"
    { type: "short", diff: 3,
      q: "In two or three sentences, explain the claim that a ranking is a gate too, using Noble's account of search.",
      model: "Noble shows that search and ranking systems, presented as neutral utilities, can reproduce racism and sexism, often against Black women. A ranking acts as a gate because what is pushed to the top is let through into attention and what is buried is kept out, so the system decides access even though it never says no to anyone. The harm is easy to miss precisely because the system looks like an objective tool rather than a gatekeeper." } // grounded in: WEEKPAGE.BFS218[10] concept "A ranking is a gate too" (record noble2018)
  ],

  /* ---------- WEEK 11 : Resistance and Abolitionist Tools ---------- */
  "11": [
    { kind: "scenario", diff: 2,
      q: "A design team builds a community app with sincere good intentions, but the people it was meant to serve report that it harms them. The team responds: our intentions were good, so the design is sound. What does design justice say?",
      options: [
        "Judge the design by its impact on the community, not by the designer's intentions, and centre the voices of those directly affected, who are experts in their own lived experience",
        "Good intentions settle the question, so the criticism can be filed away",
        "The community should be consulted only after the next version ships",
        "The team should defend the design, because designers understand harm better than users do" ],
      answer: 0,
      why: "Design justice prioritizes the design's impact on the community over the designer's intentions, centres the voices of those directly impacted, and treats everyone as an expert in their own lived experience.",
      whyWrong: {
        1: "Impact over intentions is the design justice rule this response violates: meaning well does not settle what the design actually does.",
        2: "Centring affected voices means they lead the work, not that they review it after decisions are already made.",
        3: "Design justice reverses this hierarchy: the people affected are treated as experts in their own lived experience." } }, // grounded in: record costanza2020 (coreIdea) and WEEKPAGE.BFS218[11] term "Impact over intentions"
    { kind: "scenario", diff: 3,
      q: "A facial recognition firm answers criticism by commissioning a fairness audit and diversifying its training data, while its clients and uses stay exactly the same. Using this week's test, how would Benjamin's abolitionist tools frame ask you to assess this response?",
      options: [
        "As a real repair, because any change to the data counts as structural change",
        "As irrelevant, because audits are forbidden by the abolitionist frame",
        "As likely a reform rather than a real repair: it eases the criticism while leaving power in place, so ask whether the structure should be preserved at all and what alternative could be built",
        "As proof that the original harm never existed" ],
      answer: 2,
      why: "The week's working test asks whether a response is a reform or a real repair: a reform eases harm but leaves power in place, while abolitionist tools ask whether a system should end and what alternative should be built.",
      whyWrong: {
        0: "The test exposes exactly this move: fixes that sound generous, like more diverse data or a fairness audit, can leave who decides and who pays unchanged.",
        1: "The frame does not forbid audits; it asks whether an audit changes the structure or preserves it.",
        3: "A cosmetic response says nothing about whether the harm existed; the question is what the response actually changes and for whom." } }, // grounded in: WEEKPAGE.BFS218[11] concepts "Reform versus real repair" and "Abolitionist tools"
    { kind: "match", mgroup: "w11m2", mlabel: "Match each Week 11 idea to its meaning.", diff: 2,
      q: "Abolitionist tools", answer: 1,
      options: [
        "An approach that rethinks design to centre people normally marginalized by it, treating them as experts in their own lived experience",
        "Forms of resistance that work to end harmful systems and also to envision and build alternatives",
        "The rule that a design is judged by its real effect on the community, not by whether the designer meant well",
        "Tanksley's abolitionist way of teaching that centres the voices, experiences, and technological innovations of Black youth as designers" ],
      why: "Benjamin describes abolitionist tools as forms of resistance concerned not only with ending harmful systems but also with envisioning and building alternatives." }, // grounded in: WEEKPAGE.BFS218[11] term "Abolitionist tools" (record benjamin2019)
    { kind: "match", mgroup: "w11m2", diff: 2,
      q: "Impact over intentions", answer: 2,
      options: [
        "An approach that rethinks design to centre people normally marginalized by it, treating them as experts in their own lived experience",
        "Forms of resistance that work to end harmful systems and also to envision and build alternatives",
        "The rule that a design is judged by its real effect on the community, not by whether the designer meant well",
        "Tanksley's abolitionist way of teaching that centres the voices, experiences, and technological innovations of Black youth as designers" ],
      why: "Impact over intentions is the design justice rule that a design is judged by its real effect on the community, not by whether the designer meant well." }, // grounded in: WEEKPAGE.BFS218[11] term "Impact over intentions" (record costanza2020)
    { kind: "match", mgroup: "w11m2", diff: 2,
      q: "Critical race pedagogy in computer science", answer: 3,
      options: [
        "An approach that rethinks design to centre people normally marginalized by it, treating them as experts in their own lived experience",
        "Forms of resistance that work to end harmful systems and also to envision and build alternatives",
        "The rule that a design is judged by its real effect on the community, not by whether the designer meant well",
        "Tanksley's abolitionist way of teaching that centres the voices, experiences, and technological innovations of Black youth as designers" ],
      why: "Tanksley models an abolitionist, critical race pedagogy in computer science that centres the voices, experiences, and technological innovations of Black youth, treating them as designers rather than only as those harmed." }, // grounded in: record tanksley2023 (coreIdea)
    { kind: "match", mgroup: "w11m2", diff: 2,
      q: "Design justice (Costanza-Chock)", answer: 0,
      options: [
        "An approach that rethinks design to centre people normally marginalized by it, treating them as experts in their own lived experience",
        "Forms of resistance that work to end harmful systems and also to envision and build alternatives",
        "The rule that a design is judged by its real effect on the community, not by whether the designer meant well",
        "Tanksley's abolitionist way of teaching that centres the voices, experiences, and technological innovations of Black youth as designers" ],
      why: "Design justice rethinks how things get designed so that it centres the people normally marginalized by design, who lead the work and count as experts in their own lived experience." }, // grounded in: WEEKPAGE.BFS218[11] term "Design justice" (record costanza2020)
    { type: "short", diff: 3,
      q: "In two or three sentences, explain the difference between a reform and a real repair, and why the distinction matters for responses to the New Jim Code.",
      model: "A reform eases harm but leaves power in place, so after the change the same people still decide and the same people still carry the cost. A real repair changes who holds power and who pays. The distinction matters because responses to the New Jim Code often arrive as generous-sounding fixes, like more diverse data or a fairness audit, and the week's test asks whether such a fix changes the structure or preserves it while making it harder to question." } // grounded in: WEEKPAGE.BFS218[11] concept "Reform versus real repair"
  ],

  /* ---------- WEEK 12 : Tech Accountability and Policy Futures ---------- */
  "12": [
    { kind: "scenario", diff: 3,
      q: "An advocacy group wins changes to one harmful app, but a year later a different company ships the same design. What does Week 12's idea of accountability as a stack say about why the win did not last?",
      options: [
        "The group simply chose the wrong app to challenge",
        "Single-system fixes always last, so something else must explain the repeat",
        "Accountability is impossible, so the group should stop trying",
        "A fix aimed at one system does not last if the rules above it still permit the harm, so lasting change requires working the higher levels: institutions, national law, and international human rights" ],
      answer: 3,
      why: "Accountability operates at several levels, from the single system up through institutions, national law, and international human rights; a fix at the bottom does not last if the rules above still permit the harm, because the next company can ship the same design.",
      whyWrong: {
        0: "Target choice is not the diagnosis the stack offers: any single-app win is vulnerable while the levels above remain unchanged.",
        1: "The scenario itself refutes this; the week's point is precisely that single-system patches do not hold on their own.",
        2: "The stack is not a counsel of despair; it redirects effort to the levels where lasting change is made." } }, // grounded in: WEEKPAGE.BFS218[12] concept "Accountability is a stack, not a patch"
    { kind: "scenario", diff: 3,
      q: "In a presentation, a student says: Parliament's committee found that AIDA was illegal, and Attard-Frost's brief is that official ruling. What needs correcting?",
      options: [
        "Nothing, the description is accurate",
        "The brief is the author's own policy analysis submitted to a House committee, arguing that the proposed AIDA had five categories of gaps; it is not a court or committee finding, and AIDA did not become law",
        "The brief was written by the committee itself, and the student only got the year wrong",
        "AIDA became law in 2023, so the brief is now a binding legal standard" ],
      answer: 1,
      why: "Attard-Frost's 2023 brief to the Standing Committee on Industry and Technology argued that the then-proposed AIDA contained five categories of gaps; it is the author's analysis, not a court or committee finding, and AIDA was a proposal within Bill C-27 that did not become law.",
      whyWrong: {
        0: "The description mistakes an author's submission for an official ruling and a proposal for a statute; both need correcting.",
        2: "The brief was submitted to the committee by Attard-Frost, not produced by the committee, so authorship is the error, not the year.",
        3: "AIDA did not become law; the corpus records that parliamentary work on the proposal ceased without passage." } }, // grounded in: record attard2023 (abstract, coreIdea, evidenceLimit)
    { kind: "match", mgroup: "w12m2", mlabel: "Match each Week 12 idea to its meaning.", diff: 2,
      q: "Techno-racism as a human rights issue", answer: 2,
      options: [
        "The laws, rules, standards, institutions, and oversight processes that shape how AI is built and used",
        "A place where a policy proposal may leave a problem insufficiently addressed, as Attard-Frost argued about AIDA",
        "Naming racial discrimination in digital technologies as a rights violation, which creates obligations on states and strengthens affected communities' claims",
        "Designing accountability into a system from the beginning, with affected communities at the table, rather than regulating only after harm" ],
      why: "Naming techno-racism as a rights violation rather than a technical glitch creates obligations on states and gives affected communities a stronger basis to demand change, as the UN Special Rapporteur's 2020 analysis did." }, // grounded in: WEEKPAGE.BFS218[12] concept "Techno-racism as a human rights issue" (United Nations Human Rights Council, 2020)
    { kind: "match", mgroup: "w12m2", diff: 2,
      q: "The field of AI governance", answer: 0,
      options: [
        "The laws, rules, standards, institutions, and oversight processes that shape how AI is built and used",
        "A place where a policy proposal may leave a problem insufficiently addressed, as Attard-Frost argued about AIDA",
        "Naming racial discrimination in digital technologies as a rights violation, which creates obligations on states and strengthens affected communities' claims",
        "Designing accountability into a system from the beginning, with affected communities at the table, rather than regulating only after harm" ],
      why: "AI governance is the set of laws, rules, standards, institutions, and oversight processes that shape how AI is built and used; the course studies AIDA as a Canadian proposal that did not become law." }, // grounded in: WEEKPAGE.BFS218[12] term "AI governance"
    { kind: "match", mgroup: "w12m2", diff: 2,
      q: "Building justice in from the start", answer: 3,
      options: [
        "The laws, rules, standards, institutions, and oversight processes that shape how AI is built and used",
        "A place where a policy proposal may leave a problem insufficiently addressed, as Attard-Frost argued about AIDA",
        "Naming racial discrimination in digital technologies as a rights violation, which creates obligations on states and strengthens affected communities' claims",
        "Designing accountability into a system from the beginning, with affected communities at the table, rather than regulating only after harm" ],
      why: "Building justice in means accountability is designed into a system from the beginning, with the communities most affected at the table, rather than added after harm has already happened." }, // grounded in: WEEKPAGE.BFS218[12] term "Building justice in from the start"
    { kind: "match", mgroup: "w12m2", diff: 2,
      q: "Argued policy gap", answer: 1,
      options: [
        "The laws, rules, standards, institutions, and oversight processes that shape how AI is built and used",
        "A place where a policy proposal may leave a problem insufficiently addressed, as Attard-Frost argued about AIDA",
        "Naming racial discrimination in digital technologies as a rights violation, which creates obligations on states and strengthens affected communities' claims",
        "Designing accountability into a system from the beginning, with affected communities at the table, rather than regulating only after harm" ],
      why: "An argued policy gap is a place where a proposal may leave a problem insufficiently addressed; Attard-Frost argued AIDA had five such categories, and the course evaluates that argument alongside the bill's official status." }, // grounded in: WEEKPAGE.BFS218[12] term "Argued policy gap" (record attard2023)
    { type: "short", diff: 3,
      q: "In two or three sentences, explain what changes when techno-racism is named as a human rights issue rather than a technical glitch.",
      model: "In a 2020 report, the UN Special Rapporteur on contemporary forms of racism analysed racial discrimination in emerging digital technologies as a human rights matter. Naming techno-racism as a rights violation changes what it asks of governments: it creates obligations on states rather than leaving the problem to product teams, and it gives affected communities a stronger basis to demand change. The frame moves accountability up the stack, from patching a single system to governing technology at the level of law and rights." } // grounded in: WEEKPAGE.BFS218[12] concept "Techno-racism as a human rights issue"
  ]
};

/* ============================================================
   BFS218 Knowledge Check additions: Weeks 3, 4, 9 (candidate).
   Ten plain MC items per week for the three New Jim Code
   dimension weeks with no same-week practice.
   Item shape follows data/bfs218-mc.js ({q, options, answer,
   why, skill, diff}) plus distractor-diagnostic whyWrong maps
   following data/bfs218-kc.js conventions.
   Grounding: app.js WEEKPAGE BFS218 weeks 3, 4, 9 (concepts,
   terms, purpose, overview, checks, activity) and
   data/corpus-data.js benjamin2019 (coreIdea, abstract).
   Each item names its grounding in a trailing comment.
   ============================================================ */
window.BFS218_KC_W349_ADDITIONS = {
  "3": [
    {
      q: "What does engineered inequity describe?",
      options: [
        "A shortage of computers and internet access in low-income communities",
        "Bias that appears only when a bad actor misuses a well-built system",
        "Technology that, by its design, amplifies existing social hierarchies of race, class, and gender while presenting itself as neutral or efficient",
        "A professional rule that bans biased design in engineering programs"
      ],
      answer: 2,
      why: "Engineered inequity is Benjamin's first dimension of the New Jim Code: technology that, by its design, amplifies existing hierarchies of race, class, and gender while presenting itself as neutral or efficient.",
      whyWrong: {
        0: "Unequal access is a different problem. Engineered inequity is about what a system's design does, not about who can reach the system.",
        1: "The harm does not wait for misuse. It is built into the design, so the system produces it while working exactly as built.",
        3: "There is no such rule in this week's material. Engineered inequity names a pattern of harm, not a regulation against it."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[3] term "Engineered inequity" and concept "Engineered inequity"
    {
      q: "In the phrase amplify, not create, what does amplify mean?",
      options: [
        "The system takes an inequality that already exists and makes it wider, faster, or harder to escape",
        "The system invents a brand-new bias that society never had before",
        "The system makes every user's experience louder and more intense",
        "The system removes inequality by averaging it across all users"
      ],
      answer: 0,
      why: "Engineered inequity does not conjure inequality out of nothing. It takes an existing inequity and makes it wider, faster, or harder to escape, which is why the key word is amplify.",
      whyWrong: {
        1: "That would be create, the looser idea this week asks you to set aside. The inequality is already in society before the system touches it.",
        2: "Amplify here is about widening a social gap, not about volume or intensity of experience for everyone equally.",
        3: "Amplification widens a gap rather than smoothing it out. Averaging away inequality is the opposite of what this concept describes."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[3] concept "Amplify, not create" and overview
    {
      q: "Engineered inequity is the first dimension of the New Jim Code. According to this week, which three dimensions follow it in the course?",
      options: [
        "Intersectionality, the digital divide, and data sovereignty",
        "Default discrimination, coded exposure, and technological benevolence",
        "Surveillance, predictive policing, and border technology",
        "Hardware bias, software bias, and data bias"
      ],
      answer: 1,
      why: "This week sets up the three dimensions that follow: default discrimination, coded exposure, and technological benevolence.",
      whyWrong: {
        0: "These are other course ideas, not the remaining dimensions of the New Jim Code named this week.",
        2: "These are settings where harm can appear, not the names of Benjamin's remaining three dimensions.",
        3: "The dimensions are patterns of harm, not layers of a computer system."
      },
      skill: "context",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[3] purpose ("sets up the three dimensions that follow")
    {
      q: "Benjamin asks, are robots racist? On her account, what does it take for a machine to do racial harm?",
      options: [
        "A programmer who secretly writes a racist rule into the code",
        "A machine that develops feelings of hatred on its own",
        "A user who deliberately feeds the system harmful commands",
        "Only a design built inside a society already structured by racism, with no hatred and no racist programmer required"
      ],
      answer: 3,
      why: "Benjamin's answer is that robots can be racist, not because a machine feels hatred, but because it is designed inside a society already structured by racism and carries that structure forward. A system can do racial harm with no racist programmer behind it.",
      whyWrong: {
        0: "No secret rule is needed. The question deliberately moves us from intent to design, so harm does not depend on a hidden racist choice.",
        1: "A machine has no feelings, and Benjamin does not need it to. The harm comes from the design, not from an emotion.",
        2: "The harm does not wait for a hostile user. A system built inside a racist structure can carry that structure forward on its own."
      },
      skill: "argument",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[3] concept "Are robots racist?"
    {
      q: "A team keeps a set of biased inputs in its tool but adds a label calling the tool objective. According to this week's activity, what does that label do?",
      options: [
        "It hides the amplification rather than removing it, so the harm continues while looking fair",
        "It removes the bias, because naming a tool objective forces it to behave that way",
        "It has no effect of any kind on how people receive the tool",
        "It makes the tool illegal to deploy"
      ],
      answer: 0,
      why: "In the activity, the alibi of neutrality hides the amplification rather than removing it, so the harm continues while looking fair.",
      whyWrong: {
        1: "A label changes nothing about the design. Calling a tool objective does not alter what its inputs do.",
        2: "The label matters a great deal: it is the cover that lets the amplification pass as fairness.",
        3: "Nothing in this week's material says such a label is illegal. The problem is that it works as a disguise."
      },
      skill: "argument",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[3] activity "Trace the design choice", step 2 outcome ("The alibi of neutrality hides the amplification")
    {
      q: "Why is the fix for engineered inequity a different design choice rather than better intentions?",
      options: [
        "Because designers are not capable of good intentions",
        "Because intentions can only be fixed by law",
        "Because the framework directs attention to design outcomes whether or not discriminatory intent can be shown, so a response has to examine the design",
        "Because a design can never be changed once it ships"
      ],
      answer: 2,
      why: "The framework directs attention to design outcomes whether or not discriminatory intent can be shown. A response therefore has to examine the design, not only the designer's intentions, which is why the fix is a different design choice.",
      whyWrong: {
        0: "Designers can mean well. The point is that good intentions do not undo what the design does.",
        1: "This week is not about legislating intentions. It is about changing the design choices that do the amplifying.",
        3: "Designs can change. The activity shows teams redesigning rather than shipping, which is exactly the fix this week describes."
      },
      skill: "argument",
      diff: 3
    }, // Grounding: app.js WEEKPAGE BFS218[3] concept "Amplify, not create" and checks ("a different design choice, not just better intentions")
    {
      q: "Which statement matches how this course describes the New Jim Code?",
      options: [
        "A law passed to replace older segregation statutes",
        "A programming standard that bans racist code",
        "A test that every new technology must pass before release",
        "Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair"
      ],
      answer: 3,
      why: "The New Jim Code is Benjamin's name for new technologies that carry old racism forward while appearing neutral or even fair, and engineered inequity is the first of its four dimensions.",
      whyWrong: {
        0: "It is not a law. It is a name for a pattern in technology that echoes an older system of exclusion.",
        1: "It is not a technical standard. It names how supposedly neutral systems reproduce inequity.",
        2: "It is not a certification test. It is an analytical framework for seeing harm that looks like progress."
      },
      skill: "concepts",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[3] term "The New Jim Code"; corpus-data.js benjamin2019 coreIdea
    {
      q: "A classmate says a biased ranking tool must have been built by someone who wanted to harm people. Using this week's ideas, what is the most accurate reply?",
      options: [
        "You are right, because harm always traces back to one hateful person",
        "The harm comes from how the system is designed, not from a feeling, a slur, or a single mistake, so no racist designer is needed",
        "The tool cannot be biased, because software has no opinions",
        "The tool is biased only if its makers confess to bad intent"
      ],
      answer: 1,
      why: "This week's central move is that the harm comes from how the system is designed, not from a feeling, a slur, or a single mistake. A system can do racial harm with no racist programmer behind it.",
      whyWrong: {
        0: "Hunting for one hateful person misses the structural point. The design can carry the harm with no villain at all.",
        2: "Having no opinions does not protect a system. A design built inside an unequal society can widen that inequality anyway.",
        3: "Waiting for a confession would leave most designed harm unnamed. The test is what the design does, not what anyone admits."
      },
      skill: "argument",
      diff: 3
    }, // Grounding: app.js WEEKPAGE BFS218[3] concepts "Engineered inequity" and "Are robots racist?"
    {
      q: "Why does this week insist on the word amplify instead of create?",
      options: [
        "Because the inequality is already in society, and the design widens it, speeds it up, and makes it harder to escape",
        "Because create is too strong a word to use about technology",
        "Because amplify sounds more scientific in an essay",
        "Because technology has never created anything new"
      ],
      answer: 0,
      why: "The key idea is amplify, not create: the inequality is already in society, and the design widens it, speeds it up, and makes it harder to escape. Keeping that word precise keeps the analysis pointed at the design doing the widening.",
      whyWrong: {
        1: "The issue is accuracy, not strength of language. Create misdescribes where the inequality comes from.",
        2: "This is not a style preference. The word choice marks a real analytical difference about the origin of the harm.",
        3: "Technology creates plenty. The claim is narrower: this inequality was already there before the system amplified it."
      },
      skill: "argument",
      diff: 3
    }, // Grounding: app.js WEEKPAGE BFS218[3] overview and term "Amplify, not create"
    {
      q: "After this week, when you examine a new system for your Personal Cartography, what habit should you apply?",
      options: [
        "Ask whether the people who built it seem kind",
        "Assume any efficient system is a fair one",
        "Look for design choices rather than bad intentions",
        "Only record systems that openly announce their bias"
      ],
      answer: 2,
      why: "The purpose of this week is to give you a precise definition of engineered inequity and the habit of looking for design choices rather than bad intentions.",
      whyWrong: {
        0: "Kind builders can still ship a design that amplifies a gap. Intentions are not the test.",
        1: "Efficiency describes speed, not fairness. A system can be efficient at delivering an unequal outcome.",
        3: "Engineered inequity usually presents itself as neutral or efficient, so waiting for an open announcement means missing it."
      },
      skill: "significance",
      diff: 2
    } // Grounding: app.js WEEKPAGE BFS218[3] purpose and outcomes; activity step 3 ("Efficiency and a clean overall number become the cover")
  ],
  "4": [
    {
      q: "What does default discrimination describe?",
      options: [
        "Harm that arrives through the defaults of a system, the settings, data, and assumptions that treat one group's world as the norm",
        "Discrimination that only happens when a designer actively builds it in",
        "A penalty applied to users who never change their settings",
        "A software error that disappears after the first update"
      ],
      answer: 0,
      why: "Default discrimination is Benjamin's second dimension of the New Jim Code: harm that arrives through the defaults of a system, the settings, data, and assumptions that treat one group's world as the norm.",
      whyWrong: {
        1: "Active design is engineered inequity, last week's dimension. Default discrimination is the quieter harm that needs no racist designer at all.",
        2: "The word default refers to the system's built-in settings and assumptions, not to a punishment for users.",
        3: "This harm is not a passing error. It sits in the defaults and persists until someone changes the default itself."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[4] term "Default discrimination" and concept "Default discrimination"
    {
      q: "What does Benjamin's question, is the glitch systemic, ask you to test?",
      options: [
        "Whether the system's error rate is low enough to ignore",
        "Whether a failure called a glitch is really an accident or the predictable result of how the system was built",
        "Whether the glitch can be patched within one business day",
        "Whether users reported the glitch through the correct channel"
      ],
      answer: 1,
      why: "Benjamin asks whether a failure called a glitch is really an accident or the predictable result of how the system was built. When it is predictable, the failure is systemic, not incidental.",
      whyWrong: {
        0: "The question is not about the size of the error rate. It is about whether the failure follows from the design.",
        2: "Patch speed misses the point. A designed harm patched quickly is still a designed harm.",
        3: "How a failure is reported says nothing about whether the failure was built into the system."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[4] term "Is the glitch systemic?" and concept "Is the glitch systemic?"
    {
      q: "Why does Google Maps read Malcolm X Boulevard aloud as Malcolm Ten, according to this week?",
      options: [
        "A prankster edited the street name in the database",
        "The street was officially renamed and the map is correct",
        "The voice feature cannot pronounce the letter X at all",
        "It reads the X as a Roman numeral because that is the default"
      ],
      answer: 3,
      why: "When Google Maps reads Malcolm X Boulevard aloud as Malcolm Ten, it reads the X as a Roman numeral because that is the default, a small sign of whose knowledge is set as normal and whose is treated as the exception.",
      whyWrong: {
        0: "No vandalism is involved. The system fails while working exactly as designed, which is what makes it a default problem.",
        1: "The street name did not change. The default changed how the name is spoken.",
        2: "The system can say the letter. The default simply treats X in this position as the numeral ten."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[4] concept "Design as worldbuilding" (Malcolm X Boulevard example)
    {
      q: "Why does Benjamin describe database design as an exercise in worldbuilding?",
      options: [
        "Because databases are mostly used in video games that build fictional worlds",
        "Because programmers project their assumptions, interests, and view of the world into the system",
        "Because every database must model the entire physical world",
        "Because databases are too complex for any one person to understand"
      ],
      answer: 1,
      why: "Benjamin describes database design as an exercise in worldbuilding because programmers project their assumptions, interests, and view of the world into the system, and that world too often reproduces the technology of race.",
      whyWrong: {
        0: "The phrase is not about games. It is about how a designer's worldview becomes the system's version of normal.",
        2: "The point is not scale. Even a small database encodes assumptions about whose world counts as the norm.",
        3: "Complexity is not the issue. The issue is whose view of the world the design quietly builds in."
      },
      skill: "concepts",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[4] concept "Design as worldbuilding" and term "Design as worldbuilding"
    {
      q: "How does default discrimination differ from engineered inequity?",
      options: [
        "Default discrimination is imaginary, while engineered inequity is real",
        "They are two names for exactly the same thing",
        "Engineered inequity is active, a design that amplifies a gap on purpose, while default discrimination is quieter, the harm that arrives when no one is looking",
        "Default discrimination only affects hardware, while engineered inequity only affects software"
      ],
      answer: 2,
      why: "Engineered inequity is active, a design that amplifies a gap on purpose, but default discrimination is quieter, the harm that arrives when no one is looking.",
      whyWrong: {
        0: "Both are real dimensions of the New Jim Code. The difference is how the harm arrives, not whether it exists.",
        1: "They are distinct dimensions. One is an active design choice; the other rides in on unexamined defaults.",
        3: "Neither dimension is about hardware versus software. Both are about design, data, and assumptions."
      },
      skill: "argument",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[4] concept "Default discrimination" (contrast with engineered inequity)
    {
      q: "What does default discrimination require in order to happen?",
      options: [
        "A racist designer who deliberately writes harm into the system",
        "Only that the existing inequity is left in the defaults and that no one designs against it",
        "A user who chooses the wrong settings on purpose",
        "A complete absence of testing before release"
      ],
      answer: 1,
      why: "Default discrimination does not require a racist designer. It requires only that the existing inequity is left in the defaults and that no one designs against it.",
      whyWrong: {
        0: "That is the point of the dimension: no racist designer is needed. The inequity is already sitting in the defaults.",
        2: "The harm arrives through the system's own defaults, not through a user's deliberate misconfiguration.",
        3: "Testing alone does not settle it. A tested system can still carry an inequity no one thought to design against."
      },
      skill: "argument",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[4] concept "Default discrimination" ("It requires only that the existing inequity is left in the defaults")
    {
      q: "When a designed harm is called a glitch, what is that label doing?",
      options: [
        "It makes the harm easier to see and fix",
        "It triggers an automatic investigation into the design",
        "It proves the failure really was an accident",
        "It makes a designed harm sound like bad luck and closes the case before anyone asks who carries the cost"
      ],
      answer: 3,
      why: "When the failure is actually systemic, the word glitch is doing work: it makes a designed harm sound like bad luck and closes the case before anyone asks who carries the cost.",
      whyWrong: {
        0: "The label does the opposite. It shrinks a structural failure into a minor, temporary irregularity.",
        1: "Calling something a glitch tends to end the inquiry, not start one. That is exactly why the word matters.",
        2: "A label proves nothing. Benjamin's test asks whether the failure follows predictably from the design."
      },
      skill: "argument",
      diff: 3
    }, // Grounding: app.js WEEKPAGE BFS218[4] concept "Is the glitch systemic?" ("the word glitch is doing work")
    {
      q: "What does the term automating anti-Blackness describe?",
      options: [
        "Software that scans code for racist language and deletes it",
        "The way everyday tools such as credit scores, hiring algorithms, and risk assessments sift and sort people at scale, carrying old inequities forward in their defaults without ever using an explicit slur",
        "A policy that requires companies to automate their hiring",
        "Online harassment carried out by automated accounts"
      ],
      answer: 1,
      why: "Automating anti-Blackness names the way everyday tools such as credit scores, hiring algorithms, and risk assessments sift and sort people at scale, carrying old inequities forward in their defaults without ever using an explicit slur.",
      whyWrong: {
        0: "The term names a harm, not a cleanup tool. No slur needs to appear for the sorting to do its damage.",
        2: "It is not a policy about automation. It is a description of what certain automated defaults already do.",
        3: "The term points at ordinary institutional tools like scores and screenings, not at harassment campaigns."
      },
      skill: "concepts",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[4] term "Automating anti-Blackness"
    {
      q: "A team responds to repeated failures that hit the same group by promising to patch each glitch faster. What does this week say the real fix is?",
      options: [
        "Changing the default itself, not patching the glitch faster",
        "Hiring more support staff to log the glitches",
        "Renaming the glitches so they sound less alarming",
        "Waiting for users to adapt to the system over time"
      ],
      answer: 0,
      why: "This week's point is that the real fix is changing the default itself, not patching the glitch faster. Faster patches leave the harmful default in place.",
      whyWrong: {
        1: "Better logging documents the harm without touching the default that produces it.",
        2: "Renaming the failure is the glitch label doing its work: it softens a designed harm without changing it.",
        3: "Expecting people to adapt puts the cost on the group the default already disadvantages."
      },
      skill: "argument",
      diff: 3
    }, // Grounding: app.js WEEKPAGE BFS218[4] checks ("the real fix is changing the default itself, not patching the glitch faster")
    {
      q: "In the activity, a name field treats a narrow set of names as the default normal. What happens to people whose names fall outside that default?",
      options: [
        "The system automatically expands to include their names",
        "Nothing happens, because name fields cannot cause harm",
        "Their names are rejected, truncated, or misread, so they are misrecorded and must adapt to fit the database",
        "They receive a formal apology from the software vendor"
      ],
      answer: 2,
      why: "In the activity, names outside the assumed norm are rejected, truncated, or misread, so people are misrecorded by the system. People whose names fall outside the worldview encoded into the default must adapt or be misread.",
      whyWrong: {
        0: "Defaults do not fix themselves. Until someone designs against the narrow default, the exclusion stands.",
        1: "A name field is a small piece of worldbuilding. Being misrecorded by a system is a real harm, not a neutral event.",
        3: "No apology appears in the activity, and an apology would not change the default doing the harm."
      },
      skill: "argument",
      diff: 3
    } // Grounding: app.js WEEKPAGE BFS218[4] activity "Defaults are not neutral", toggle 4 (name field) and guiding ("who has to adapt themselves to fit it")
  ],
  "9": [
    {
      q: "What does technological benevolence describe?",
      options: [
        "Charity programs that donate computers to schools",
        "Technology promoted as good for us, a fix, an upgrade, an act of help, that still carries the old harms",
        "Software that has been proven to help every user equally",
        "A design method that removes harm by adding helpful features"
      ],
      answer: 1,
      why: "Technological benevolence is Benjamin's fourth dimension: technology promoted as good for us, a fix, an upgrade, an act of care, that still carries the old harms.",
      whyWrong: {
        0: "The dimension is not about donations. It is about harm travelling inside the language of help.",
        2: "No such proof is part of the idea. The point is that the promise of help can coexist with real harm.",
        3: "Helpful features do not remove harm. The benevolent framing can be exactly what keeps the harm alive."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "Help can be how harm survives" and term "Technological benevolence"
    {
      q: "What is the benevolence trap?",
      options: [
        "A pricing scheme that locks users into helpful subscriptions",
        "A test that catches harmful tools before they launch",
        "A tool sold as the solution disarms criticism in advance, so questioning it can feel like opposing progress or refusing help",
        "The tendency of helpful tools to break down over time"
      ],
      answer: 2,
      why: "The benevolence trap is what makes this dimension dangerous: a tool sold as the solution disarms criticism in advance, so to question it can feel like opposing progress or refusing help.",
      whyWrong: {
        0: "The trap is rhetorical, not financial. It is about how the framing of help silences questions.",
        1: "It is the opposite of a safeguard. The trap is what lets a harmful tool escape scrutiny.",
        3: "Durability is not the issue. The trap works even when the tool runs perfectly."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "The benevolence trap" and term "The benevolence trap"
    {
      q: "What does Benjamin's test, will the fix fix it, ask you to do?",
      options: [
        "Check whether the fix arrived on schedule and on budget",
        "Ask what the fix actually changes and for whom, to tell a real repair from a comfortable story about one",
        "Count how many users adopted the fix in its first month",
        "Confirm that the fix was approved by the right committee"
      ],
      answer: 1,
      why: "For any proposed fix, the test is to ask what it actually changes and for whom, separating a real repair from a comfortable story about one.",
      whyWrong: {
        0: "Schedule and budget say nothing about whether the harm changed or who still carries it.",
        2: "Adoption is not repair. A widely adopted fix can still leave the same people paying the same cost.",
        3: "Approval is not the test. The test is whether who pays has actually changed."
      },
      skill: "concepts",
      diff: 1
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "Will the fix fix it?" and term "Will the fix fix it?"
    {
      q: "What does Benjamin argue in Raising Robots?",
      options: [
        "Robots should be given legal rights as workers",
        "Robots will eventually replace all dangerous jobs, which ends the debate about risk",
        "Robots are too expensive for most institutions to deploy",
        "Robots and automation are imagined as helpers and even servants, and the disposability of robots travels with the denigration of racialized people"
      ],
      answer: 3,
      why: "In Raising Robots, Benjamin shows how robots and automation are imagined as helpers and even servants, and how the disposability of robots travels with the denigration of racialized people.",
      whyWrong: {
        0: "Robot rights are not her argument here. Her focus is what the helper and servant framing reveals about race and disposability.",
        1: "The chapter section questions the safety framing rather than endorsing it. The right question becomes safety for whom.",
        2: "Cost is not the argument. The argument is about the language of helpers, servants, and disposability."
      },
      skill: "concepts",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "Raising Robots connects disposability to race" and term "Raising Robots"
    {
      q: "In Benjamin's police throwbots example, the machine is framed as safety. What question does this week say becomes the right one to ask?",
      options: [
        "Safety for whom",
        "How much does each throwbot cost",
        "How fast can the throwbot move",
        "Which company manufactured the throwbot"
      ],
      answer: 0,
      why: "The throwbots are sent in first so officers can own the real estate with their eyes before paying with their bodies. Because the machine is framed as safety, the right question becomes safety for whom.",
      whyWrong: {
        1: "Price does not touch the framing problem. The question is who the promised safety actually serves.",
        2: "Speed is a technical detail. The week's question is about who benefits and who carries the risk.",
        3: "The manufacturer's name does not answer whose safety the machine protects."
      },
      skill: "concepts",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "Raising Robots connects disposability to race" (police throwbots, "safety for whom")
    {
      q: "Why is the benevolent framing of a harmful tool not just a side effect?",
      options: [
        "Because the framing is required by advertising law",
        "Because the framing makes the tool cheaper to build",
        "Because the framing guarantees that the tool will be popular",
        "Because the framing is part of how the harm survives, since help is hard to argue with"
      ],
      answer: 3,
      why: "The benevolent framing is not a side effect; it is part of how the harm survives, because help is hard to argue with. A tool sold as the solution is harder to question than one that is openly harmful, and that difficulty is the point.",
      whyWrong: {
        0: "No law requires this framing. It survives because it works as a shield against criticism.",
        1: "Cost has nothing to do with it. The framing's job is to make the harm hard to name.",
        2: "Popularity is not the mechanism. The mechanism is that questioning help feels like refusing care."
      },
      skill: "argument",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "Help can be how harm survives"
    {
      q: "Why does the benevolence trap matter beyond the harm itself?",
      options: [
        "Because trapped tools eventually stop working",
        "Because the trap doubles the financial cost of the harm",
        "Because the trap makes the harm hard to name, and a harm you cannot name, you cannot organize against",
        "Because the trap only affects the people who built the tool"
      ],
      answer: 2,
      why: "The trap is not only the harm itself but the difficulty of naming it once it wears the language of care. A harm you cannot name, you cannot organize against.",
      whyWrong: {
        0: "The tool can keep working smoothly. The trap is about silenced criticism, not technical failure.",
        1: "The week's claim is not about money. It is about losing the ability to name and resist the harm.",
        3: "The trap lands on the people harmed and on anyone who might speak up, not on the builders."
      },
      skill: "argument",
      diff: 3
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "The benevolence trap" ("A harm you cannot name, you cannot organize against")
    {
      q: "A city says a new app has fixed unfair service, but the same people still carry the cost when things go wrong. Under the will-the-fix-fix-it test, what is this?",
      options: [
        "A comfortable story, because a real repair changes who pays",
        "A real repair, because the city announced the problem as solved",
        "Proof that the original harm never existed",
        "A neutral outcome that the test cannot evaluate"
      ],
      answer: 0,
      why: "A comfortable story makes harm look solved while who carries the cost has not changed; a real repair changes who pays. If the same people still pay, the fix did not fix it.",
      whyWrong: {
        1: "An announcement is exactly the kind of comfortable story the test exists to check. Solved is a claim, not a result.",
        2: "The unchanged cost shows the harm is still present, not that it never existed.",
        3: "This is precisely what the test evaluates: what changed, and for whom."
      },
      skill: "argument",
      diff: 3
    }, // Grounding: app.js WEEKPAGE BFS218[9] concept "Will the fix fix it?" ("a real repair changes who pays")
    {
      q: "Why does this week turn the course toward response?",
      options: [
        "Because the course has run out of harms to study",
        "Because responses are easier to grade than critiques",
        "Because every technological fix turns out to be a real repair",
        "Because once you can see harm hiding inside help, you can test the solutions you are offered instead of trusting them"
      ],
      answer: 3,
      why: "Technological benevolence completes the anatomy of the New Jim Code, and it turns the whole course toward response: once you can see harm hiding inside help, you can test the solutions you are offered instead of trusting them.",
      whyWrong: {
        0: "The turn is not about exhausting the subject. It is about what seeing this dimension makes possible.",
        1: "Grading has nothing to do with it. The shift is analytical: from spotting harm to testing proposed fixes.",
        2: "The opposite is the worry. Some fixes are comfortable stories, which is why they need testing."
      },
      skill: "significance",
      diff: 2
    }, // Grounding: app.js WEEKPAGE BFS218[9] purpose ("It turns the whole course toward response")
    {
      q: "In the benevolence test activity, founders say their automated risk score removes human bias and is faster, so you should trust it. Why does the activity call that the comfortable story?",
      options: [
        "Because automated scores are always slower than human judgment",
        "Because a faster, friendlier tool can still carry engineered inequity underneath, so an automated score deserves more scrutiny, not less",
        "Because human bias is impossible to remove under any conditions",
        "Because trusting any technology is forbidden by the course"
      ],
      answer: 1,
      why: "The activity names this the comfortable story: a faster, friendlier tool can still carry engineered inequity underneath, and benevolence rarely arrives alone, so an automated score deserves more scrutiny, not less.",
      whyWrong: {
        0: "Speed is not the objection. The tool may well be faster; the question is what its score actually changes and for whom.",
        2: "The activity does not claim bias can never be reduced. It warns against treating the promise of removal as the proof.",
        3: "The course does not forbid trust. It asks you to test a fix before trusting it, which is the whole point of the week."
      },
      skill: "argument",
      diff: 3
    } // Grounding: app.js WEEKPAGE BFS218[9] activity "The benevolence test", step 2 outcome ("benevolence rarely arrives alone")
  ]
};

// Numeracy strand Knowledge Check additions ("read the numbers")
// Authored 2026-07-25. Every numeric claim below is grounded in the named
// on-disk corpus file at the cited line; no statistic is invented.
// Item shape matches each course's existing KC bank ({q, options, answer,
// why, diff}) plus skill:'numeracy' and whyWrong (array aligned with
// options, null at the correct index).
window.NUMERACY_ADDITIONS = {
  BFS218: {
    // Corpus: BFS218/Asynchronous/_app/data/corpus-data.js
    "5": [
      {
        // Grounding: corpus-data.js line 360 (buolamwini2018 abstract): "error rates up to 34.7 percent, while the maximum error for lighter-skinned men was 0.8 percent"; three commercial systems tested.
        "q": "Gender Shades reports error rates of up to 34.7 percent for darker-skinned women, while the maximum error for lighter-skinned men was 0.8 percent. What does the phrase up to tell you about the 34.7 percent figure?",
        "options": [
          "It is the average error rate across every face in the benchmark",
          "It is the highest error rate observed for that group across the three systems tested, not the rate every system produced",
          "It means the true error rate is unknown, so you can set the figure aside",
          "It shows that every commercial system misclassified darker-skinned women 34.7 percent of the time"
        ],
        "answer": 1,
        "why": "Reading qualifiers is part of reading the numbers. The audit tested three commercial systems, and 34.7 percent is the worst observed error for darker-skinned women, just as 0.8 percent is the worst observed for lighter-skinned men. The qualifier limits the claim without weakening the disparity it measures.",
        "whyWrong": [
          "The 34.7 percent figure describes one group at the high end across systems, not an average over the whole benchmark.",
          null,
          "A maximum is still a measured number from a real audit. A qualifier bounds a claim; it does not erase it.",
          "Up to marks a ceiling across the systems tested; the study reports disparities that varied from system to system."
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 363 (buolamwini2018 sample): "1,270 unique faces ... balanced across the study's gender and skin-type categories"; line 360: aggregate or single-axis results can conceal the disparity.
        "q": "Buolamwini and Gebru built their own benchmark of 1,270 faces balanced across gender and skin type before testing the systems. Why does that balance matter when you read any overall accuracy number?",
        "options": [
          "A balanced benchmark guarantees every system will perform equally well on every group",
          "Balance matters only for training data, never for test data",
          "If one group dominates a test set, overall accuracy mostly reflects performance on that group and can hide high error rates for smaller groups",
          "A benchmark of 1,270 faces is too small to reveal anything about accuracy"
        ],
        "answer": 2,
        "why": "An aggregate accuracy score is a weighted average of group scores. Balancing the benchmark stops the largest group from swamping the number, which is exactly how the study exposed a gap that aggregate and single-axis results conceal.",
        "whyWrong": [
          "Balance changes what the test can reveal, not how the systems perform. The systems still failed some groups far more than others.",
          "The study shows the opposite: the composition of the test set decides whose errors an accuracy number can even register.",
          null,
          "The audit measured large, consistent disparities on this benchmark. Size alone does not decide whether a test is informative; design does."
        ],
        "skill": "numeracy",
        "diff": 3
      },
      {
        // Grounding: corpus-data.js line 389 (koenecke2020 abstract): "average word error rate was 0.35 for Black speakers and 0.19 for white speakers. The disparity remained in a subset of 206 identical short phrases"; authors could not inspect proprietary training data.
        "q": "Koenecke and colleagues found average word error rates of 0.35 for Black speakers and 0.19 for white speakers across five commercial systems, and the disparity remained in a subset of 206 identical short phrases. What does the identical-phrases result add?",
        "options": [
          "It proves the training data caused the gap",
          "It shows the gap disappears once the content of speech is controlled",
          "It shows 206 phrases is enough to settle the question for every dialect and system",
          "It weakens the explanation that speakers simply said different words, because the gap persisted when the words were the same"
        ],
        "answer": 3,
        "why": "Matched comparisons are a design tool. Holding the words constant rules out vocabulary differences as the whole story and points toward how the systems process the speech itself. That is how you test a rival explanation with numbers instead of arguing about it.",
        "whyWrong": [
          "The error analysis pointed to poorer acoustic-model performance, and the authors could not inspect the proprietary training data, so cause stays unproven.",
          "The abstract says the opposite: the disparity remained on the identical phrases.",
          "The study itself limits its findings to the systems, corpora, and groups tested; a matched subset strengthens one comparison, not every generalization.",
          null
        ],
        "skill": "numeracy",
        "diff": 3
      }
    ],
    "6": [
      {
        // Grounding: corpus-data.js lines 487-491 (robertson2020): "the factual record was incomplete and ... widespread use did not appear established at the time of writing"; no deployment prevalence number appears in the corpus, so this item teaches the method concept.
        "q": "Robertson, Khoo, and Song analysed Canadian examples and possible uses of algorithmic policing while stating that the factual record was incomplete and widespread use did not appear established. A headline citing the report says algorithmic policing is now widespread in Canada. What is wrong with the headline?",
        "options": [
          "The report documents examples and possible uses and explicitly declines to establish prevalence, so the headline asserts a fact the source withholds",
          "The report is too old to cite for any claim",
          "Nothing, because documented examples imply widespread use",
          "Human-rights reports always measure prevalence, so the headline must be accurate"
        ],
        "answer": 0,
        "why": "Reading the numbers includes noticing when a source refuses to give one. The authors said their factual record was incomplete; a claim about how widespread a practice is needs a measurement of prevalence, and this report tells you it does not have one.",
        "whyWrong": [
          null,
          "Age is not the problem. The report can still support what it actually claims: examples, possible uses, and human-rights risks.",
          "Examples show existence, not extent. Counting some cases is not the same as measuring how common a practice is.",
          "This report is a legal and policy analysis, and it says directly that widespread use was not established."
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 423 (opc2021 sample): "hundreds of searches of a database compiled from images scraped without consent"; line 424: findings do not establish that every Canadian police service used the same tool; line 120 (relationship text): "Keep prevalence, possible use, documented use, and a legal finding separate."
        "q": "The Privacy Commissioner's investigation examined the RCMP's use of Clearview AI, including hundreds of searches of a database compiled from images scraped without consent. What can that hundreds of searches figure support, and what can it not?",
        "options": [
          "It proves every Canadian police service ran a similar number of searches",
          "It shows the scale of one documented case; it cannot tell you how often facial recognition is used across Canadian policing",
          "It is a survey-based estimate of national police usage",
          "It is too vague to tell you anything about the RCMP case"
        ],
        "answer": 1,
        "why": "A count from a single investigated case measures that case. The course pairing puts it plainly: keep prevalence, possible use, documented use, and a legal finding separate. One well-documented case can anchor a legal conclusion without becoming a national usage rate.",
        "whyWrong": [
          "The report's findings concern the RCMP and Clearview AI; it does not establish that other services did the same.",
          null,
          "The figure comes from a federal privacy investigation of one force, not from a survey designed to estimate national usage.",
          "It is precise enough to matter: it establishes real, repeated use within the documented case."
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 555 (nagra2016 sample): "50 self-identified Muslim participants aged 18 to 31 in Toronto or Vancouver ... 24 men and 26 women, recruited through networks, snowball sampling, and student organizations"; line 556: does not estimate national prevalence.
        "q": "Nagra and Maurutto interviewed 50 young Canadian Muslims, 24 men and 26 women aged 18 to 31 in Toronto or Vancouver, recruited partly through snowball sampling. What kind of claim can this design support?",
        "options": [
          "A national percentage of young Muslims who experience extra security screening",
          "A causal estimate of how much surveillance changes behaviour",
          "A rich account of what these participants experienced and how they responded, without estimating how common those experiences are nationally",
          "None, because 50 people is too few for real research"
        ],
        "answer": 2,
        "why": "Sample size and recruitment set a claim's reach. Interviews with a snowball-recruited group in two cities document experience in depth, which is what the design is for. Estimating prevalence would need a sample built to represent the national population.",
        "whyWrong": [
          "Percentages generalize only from samples designed to represent a population; snowball recruitment in two cities is not that design.",
          "The study is qualitative and observational; it documents reported experiences, not measured causal effects.",
          null,
          "Fifty in-depth interviews is a substantial qualitative sample. The number is only a problem if you demand statistics the design never promised."
        ],
        "skill": "numeracy",
        "diff": 3
      }
    ],
    "10": [
      {
        // Grounding: corpus-data.js line 682 (bird2023 sample): "5,168,903 student-course observations for the course-completion model"; line 679: "the available administrative data predicted outcomes less accurately for Black students".
        "q": "Bird, Castleman, and Song's course-completion model was built on 5,168,903 student-course observations, yet the predictions were still less accurate for Black students. What does this show about sample size?",
        "options": [
          "A sample this large removes bias automatically",
          "The sample must actually have been much smaller than reported",
          "Accuracy differences across groups cannot be measured at this scale",
          "A large sample makes estimates more stable, but it cannot fix data that predict outcomes less accurately for one group"
        ],
        "answer": 3,
        "why": "More data shrinks random error, not systematic error. If the available administrative data carry less predictive signal for one group, millions of observations will reproduce that gap precisely rather than remove it. Big numbers earn trust in stability, not in fairness.",
        "whyWrong": [
          "The study is a direct counterexample: an enormous sample and a persistent racial accuracy gap at the same time.",
          "The corpus reports the sample exactly; the lesson is about what size can and cannot buy, not about the count.",
          "The researchers did measure group-level accuracy differences at this scale; that measurement is the finding.",
          null
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 679 (bird2023 abstract): "At some risk thresholds, Black students near the cut-off would be less likely than otherwise similar white students to be classified as at risk and receive support. The size of the disparity changed with the outcome and threshold"; line 930 (term "Bias in Predicting Success").
        "q": "In the simulations, the size of the racial disparity changed with the outcome being predicted and the risk threshold chosen. Why does that mean an equity audit must examine the decision rule, not only the model's overall accuracy?",
        "options": [
          "Because the harm appears at the cut-off: at some thresholds, Black students near it would be less likely than otherwise similar white students to be flagged for support, and an overall accuracy number never shows that",
          "Because overall accuracy is impossible to compute for large models",
          "Because thresholds only matter when a model is inaccurate for everyone",
          "Because changing the threshold changes the model's training data"
        ],
        "answer": 0,
        "why": "A model becomes a decision when someone picks a threshold, and the study shows the disparity moves as the outcome and threshold move. Reading the numbers here means asking what happens to the people near the line, not settling for one headline accuracy figure.",
        "whyWrong": [
          null,
          "Overall accuracy is routinely computed; the problem is what it hides, not whether it exists.",
          "The disparity arose partly because the data predicted outcomes less accurately for one group, not for everyone, and it shifted as the threshold moved.",
          "The threshold changes who gets classified as at risk and helped; it does not alter the data the model was trained on."
        ],
        "skill": "numeracy",
        "diff": 3
      },
      {
        // Grounding: corpus-data.js line 681 (bird2023 evidenceType): "Predictive-modelling audit and simulated resource-allocation study"; line 683 (evidenceLimit): "the study does not show the effect of an implemented support program".
        "q": "Bird, Castleman, and Song simulated what would happen if institutions used the predictions to target student support. What claim does that evidence type support?",
        "options": [
          "That the support programs colleges ran using these models failed",
          "How support would be distributed under a given model and threshold, not what an implemented support program would do for student outcomes",
          "That prediction models should never be used in education",
          "The exact number of students a real program would help"
        ],
        "answer": 1,
        "why": "A simulation projects allocation: who would be flagged and who would be missed under a rule. It measures the distribution of help, not the effect of help. Claims about improved outcomes need a study of an implemented program, which this is not.",
        "whyWrong": [
          "No implemented program was evaluated; the allocations are simulated, so no program's success or failure is measured.",
          null,
          "The study argues for auditing the decision rule; it recommends scrutiny, and a ban is a policy stance the evidence does not itself establish.",
          "Exact counts for a real program would require running the program; a simulation gives conditional projections, not outcomes."
        ],
        "skill": "numeracy",
        "diff": 3
      }
    ]
  },
  SOC122: {
    // Corpus: SOC122/_app/data/corpus-data.js
    // Week 5 carries no study statistics in the corpus, so all three items
    // teach the method concepts (sampling, design, measurement) as directed.
    "5": [
      {
        // Grounding: corpus-data.js line 1082 (term "Quantitative Method"): "it can show how widely something occurs and how variables relate at scale"; line 391 (soc-research abstract): testable hypothesis and chosen research design.
        "q": "OpenStax describes quantitative research as finding patterns across many cases, showing how widely something occurs and how variables relate at scale. A survey finds that two social variables rise and fall together. What extra step would a causal claim need?",
        "options": [
          "A larger survey, because more cases turn a pattern into a cause",
          "Nothing, because variables that move together must be causing each other",
          "A design built to test cause, because a pattern across many cases shows the variables are related, not which one moves the other or whether something else moves both",
          "A switch to qualitative interviews, which always settle causal questions"
        ],
        "answer": 2,
        "why": "Relation at scale is a real finding, but it is silent about direction and about third factors. The chapter's point is that the research design, not the size of the pattern, determines what kind of claim you can defend.",
        "whyWrong": [
          "Scaling up a survey gives you a more precise association; it does not tell you what causes what.",
          "Moving together is consistent with either variable driving the other, or with something else driving both.",
          null,
          "Interviews add depth and meaning; they are a different tool, not a shortcut to causal proof."
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 1082 (term "Quantitative Method"): "a number records what was counted and is silent about what was left out, which is why researchers pair it with careful interpretation".
        "q": "The Week 5 glossary says a number records what was counted and is silent about what was left out. When a statistic about social life reaches you, what first question does this point you toward?",
        "options": [
          "Whether the number is large enough to be impressive",
          "What was measured and who was included, because the choices behind the figure decide what it can honestly say",
          "Whether the number confirms what you already believed",
          "Whether the source used a computer to calculate it"
        ],
        "answer": 1,
        "why": "Every statistic is built from decisions: what counts, who is in the sample, what gets ignored. Reading the number means reading those decisions first, which is why the glossary pairs measurement with careful interpretation.",
        "whyWrong": [
          "Size tells you nothing until you know what was counted; a big number built on a narrow count can mislead.",
          null,
          "Checking a number against your prior beliefs tests you, not the number.",
          "How the arithmetic was done matters far less than what was defined, counted, and left out."
        ],
        "skill": "numeracy",
        "diff": 1
      },
      {
        // Grounding: corpus-data.js line 1088 (term "Qualitative Method"): "It usually works with fewer cases than quantitative research, trading breadth for the close, contextual understanding that numbers alone cannot provide"; line 1082 (strength of breadth).
        "q": "A classmate dismisses an interview study because it involved far fewer people than a big survey. Based on the Week 5 material, what is wrong with judging the study by sample size alone?",
        "options": [
          "Nothing, because larger samples always make a study better",
          "Interview studies secretly use large samples too",
          "Sample size only matters in psychology, not sociology",
          "Qualitative research deliberately trades breadth for depth, so a small number of cases is a design choice for understanding meaning, not a failed attempt at a survey"
        ],
        "answer": 3,
        "why": "Each method buys something different. Quantitative breadth shows how widely something occurs; qualitative depth shows how people make sense of their lives in their own terms. Judging one method by the other's yardstick misreads what the design is for.",
        "whyWrong": [
          "Bigger is better only for the questions surveys answer; depth questions need time with fewer people.",
          "The glossary is explicit that qualitative work usually involves fewer cases; that is its trade, not its flaw.",
          "The breadth-versus-depth trade applies across the social sciences, including this course's three disciplines.",
          null
        ],
        "skill": "numeracy",
        "diff": 2
      }
    ]
  },
  PSY355: {
    // Corpus: PSY355/_app/data/corpus-data.js
    "3": [
      {
        // Grounding: corpus-data.js line 473 (yeager2019 abstract): "randomized national study of 12,490 ninth-grade students in 65 regular United States public high schools"; line 475 (evidenceType): "Individually randomized national field experiment".
        "q": "Yeager and colleagues studied 12,490 ninth-grade students in 65 United States public high schools. What feature of the study, more than its size, lets it support a causal claim about the intervention?",
        "options": [
          "Random assignment, because comparing randomized groups isolates the intervention; a huge sample without randomization would still show only associations",
          "The number of schools, because 65 is a round enough figure",
          "The fact that it was published in a major journal",
          "The size itself, because any study over ten thousand students proves causation"
        ],
        "answer": 0,
        "why": "Size buys precision; randomization buys causal logic. Because students were randomly assigned, the groups differ only by chance plus the intervention, so a difference in outcomes can be attributed to the intervention. That is the design doing the work, not the headcount.",
        "whyWrong": [
          null,
          "The number of schools helps the results travel across contexts; it does not create causal leverage by itself.",
          "Where a study appears says nothing about whether its design can separate cause from association.",
          "An observational study of a million students would still leave direction and third factors unresolved."
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 473 (yeager2019 abstract): "a small improvement in core-course GPA among lower-achieving students and increased advanced-mathematics enrolment overall. The grade effect varied with school peer norms"; line 477 (evidenceLimit): effects were small and context-dependent.
        "q": "A headline says growth mindset boosts student achievement. The national experiment actually found a small improvement in core-course GPA among lower-achieving students, increased advanced-mathematics enrolment, and a grade effect that varied with school peer norms. What did the headline drop?",
        "options": [
          "Nothing important, because the headline captures the main result",
          "Only the year the study was published",
          "The size, the subgroup, and the context: the effect was small, concentrated among lower-achieving students, and depended on peer norms",
          "The names of the researchers who ran the study"
        ],
        "answer": 2,
        "why": "Reading the numbers means keeping three questions attached to every effect: how big, for whom, and under what conditions. The study answers all three carefully, and the headline discards all three, which is how a bounded finding becomes an inflated promise.",
        "whyWrong": [
          "A boost for everyone and a small effect for a subgroup under certain peer norms are very different claims.",
          "The missing pieces are the qualifiers that define the finding, not publication details.",
          null,
          "Author names matter for credit and follow-up, but they are not what separates the finding from the headline."
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 501 (claro2016 abstract): observational analysis of Chile's national tenth-grade data, association across income levels; line 505 (evidenceLimit): "the observational design does not show that mindset caused achievement"; contrast with line 475 (yeager2019 randomized).
        "q": "Claro, Paunesku, and Dweck analysed Chile's national tenth-grade data and found growth mindset associated with achievement across income levels. Why can Yeager's study support a causal claim while this one cannot?",
        "options": [
          "Because Yeager's sample was American and Claro's was Chilean",
          "Because Yeager's study randomly assigned an intervention while Claro's was observational; national coverage makes an association well measured, not causal",
          "Because Claro's dataset was too small to trust",
          "Because associations become causal once a dataset covers a whole country"
        ],
        "answer": 1,
        "why": "The two studies differ in design, not just place. Observational data, however complete, record mindset and achievement as they happen to occur together. Only the experiment manipulates one variable and watches what follows, which is what a causal verb requires.",
        "whyWrong": [
          "Nationality has nothing to do with causal logic; design does.",
          null,
          "A national dataset is very large; the limit is that nothing was manipulated, so direction and third factors stay open.",
          "Coverage improves precision and generalizability of the association; it cannot convert correlation into causation."
        ],
        "skill": "numeracy",
        "diff": 3
      }
    ],
    "8": [
      {
        // Grounding: corpus-data.js line 757 (stephenson2018 abstract): "cross-sectional study examined questionnaire responses from 184 university students"; line 760 (sample): "measured at one time point"; line 761 (evidenceLimit): cannot establish causal direction.
        "q": "Stephenson and colleagues measured 184 university students at one time point and found self-compassion associated with lower irrationality and better mental-health indicators. Why can the study not tell you which factor influences which?",
        "options": [
          "Because 184 students is far too few to compute an association",
          "Because questionnaires can never measure anything real",
          "Because the students were not paid to participate",
          "Because everything was measured once: with no time order and no intervention, the data cannot separate self-compassion lowering distress from distress lowering self-compassion, or a third factor moving both"
        ],
        "answer": 3,
        "why": "Cross-sectional means one snapshot. A snapshot can show that two things sit together, but cause needs sequence or manipulation, and this design has neither. The sample size is not the limit; the single time point is.",
        "whyWrong": [
          "The study did compute associations from this sample; size affects precision, not the direction problem.",
          "Questionnaires measure self-report with known limits, but the causal gap here comes from the design, not the instrument.",
          "Payment has nothing to do with whether a design can order cause and effect.",
          null
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 757 (stephenson2018 abstract): "the correlational design cannot establish that irrational beliefs cause distress or that self-compassion changes it"; line 761 (evidenceLimit): no intervention effect.
        "q": "Citing the same 184-student study, a wellness program claims that teaching self-compassion will reduce students' anxiety. What is the gap between the evidence and the claim?",
        "options": [
          "The study reports associations in questionnaire data; it delivered no self-compassion training, so it cannot estimate what changing self-compassion would do",
          "The study was about professors, not students",
          "There is no gap, because an association is enough to justify any program",
          "The study proved self-compassion does not affect anxiety"
        ],
        "answer": 0,
        "why": "An association describes people as they already are. A program claim is a prediction about what happens when you intervene, and that prediction needs intervention evidence. The corpus states the design cannot establish that self-compassion changes distress.",
        "whyWrong": [
          null,
          "The participants were 184 university students; the gap is about design, not population.",
          "Associations can motivate a program worth testing, but they cannot certify the effect the program advertises.",
          "Absence of causal evidence is not evidence of no effect; the study simply cannot answer the intervention question either way."
        ],
        "skill": "numeracy",
        "diff": 3
      },
      {
        // Grounding: corpus-data.js lines 730-734 (neff2003): "Neff's conceptual article defines self-compassion through self-kindness, common humanity, and mindfulness"; sample: "No intervention sample"; evidenceLimit: does not test whether a compassionate sentence changes outcomes.
        "q": "Neff's 2003 article defines self-compassion through self-kindness, common humanity, and mindfulness, and it has no intervention sample. What does that tell you about the numbers you could expect from it?",
        "options": [
          "It reports precise effect sizes for self-compassion exercises",
          "It can define the construct and propose research questions, but it cannot supply effect sizes or outcome rates because it tested nothing",
          "It secretly contains a large clinical trial",
          "Its lack of data makes the concept of self-compassion meaningless"
        ],
        "answer": 1,
        "why": "Evidence types set what numbers can exist. A conceptual article builds the idea that later studies measure. That is why the course treats exercises based on Neff's model as applications rather than tested interventions: the founding paper offers a definition, not a result.",
        "whyWrong": [
          "There is no sample and no intervention, so there is nothing to compute an effect size from.",
          null,
          "The corpus records no trial; the article defines self-compassion and proposes relationships for future research.",
          "Concepts are where measurement starts. A construct paper without data is early, not empty."
        ],
        "skill": "numeracy",
        "diff": 2
      }
    ],
    "9": [
      {
        // Grounding: corpus-data.js line 785 (nas2025 abstract): "questionnaire data from 305 academics in Türkiye ... A structural-equation model was consistent with indirect statistical paths"; line 789 (evidenceLimit): "cannot establish mediation over time or causal effects".
        "q": "Nas and colleagues' structural-equation model was consistent with indirect paths linking perseverance to life satisfaction through self-compassion and psychological flexibility, using data from 305 academics measured once. What does consistent with mean here?",
        "options": [
          "The model was proven correct beyond doubt",
          "The researchers were unsure whether they collected any data",
          "The data fit the proposed statistical model, but one-time-point measurement means the paths remain associations that cannot establish mediation over time or causal effects",
          "The paths were observed unfolding across several years"
        ],
        "answer": 2,
        "why": "Consistent with is a precise, modest phrase: the pattern in the data does not contradict the proposed paths. It is weaker than demonstrates and far weaker than causes, and noticing that difference is exactly what reading a statistics-heavy abstract requires.",
        "whyWrong": [
          "Fit is compatibility, not proof; the corpus states the paths remain associations.",
          "The data are real: 305 academics completed the questionnaires. The caution is about inference, not existence.",
          null,
          "All variables were measured at one time, so no unfolding over time was observed."
        ],
        "skill": "numeracy",
        "diff": 3
      },
      {
        // Grounding: corpus-data.js line 788 (nas2025 sample): "305 academics in Türkiye measured at one time point"; line 786 (coreIdea): "In this sample of academics".
        "q": "The sample in Nas and colleagues' study was 305 academics in Türkiye. Before applying the findings to a different group, such as college students, what should you check first?",
        "options": [
          "Whether 305 is divisible by the number of variables",
          "Whether academics are more intelligent than students",
          "Whether the study used a computer for the statistics",
          "Whether the relationships hold beyond this occupational and national group, because a finding describes the sample studied and travelling to other groups is a separate claim needing its own evidence"
        ],
        "answer": 3,
        "why": "Every statistic carries its sample with it. The corpus phrases the core idea carefully as in this sample of academics, and that wording is the boundary: work life, career stage, and setting all differ for students, so transfer is a hypothesis, not a given.",
        "whyWrong": [
          "Divisibility is numerology, not methodology; the meaningful question is who the 305 people were.",
          "Group comparisons of ability are irrelevant; the issue is whether relationships measured in one population appear in another.",
          "The software does not change whose lives the data describe.",
          null
        ],
        "skill": "numeracy",
        "diff": 2
      },
      {
        // Grounding: corpus-data.js line 785 (nas2025 abstract): "Perseverance, self-compassion, psychological flexibility, and life satisfaction were positively associated"; line 786 (coreIdea): "positively related ... not proof of causation".
        "q": "A summary of the study says perseverance leads to life satisfaction among academics. The study reports that the two were positively associated. Why is the verb swap a problem?",
        "options": [
          "Leads to asserts cause and direction, while the cross-sectional data support only that the variables moved together, so the summary claims more than the study measured",
          "Associated is a spelling error for leads to",
          "The two phrases mean exactly the same thing in research writing",
          "The problem is style, since shorter verbs are always less accurate"
        ],
        "answer": 0,
        "why": "Verbs are where causal claims hide. Associated, related, and linked describe co-occurrence; leads to, boosts, and causes describe influence. Swapping one family for the other quietly upgrades the evidence, and catching that upgrade is a core numeracy habit.",
        "whyWrong": [
          null,
          "Both phrases are real research language; they simply make different claims.",
          "Research writing keeps them distinct on purpose: one reports a pattern, the other a mechanism.",
          "Length is irrelevant; precision about what the design can support is what matters."
        ],
        "skill": "numeracy",
        "diff": 2
      }
    ]
  }
};

/* Merge the verified additions into the live Knowledge Check bank (2026-07-25).
   Loads after bfs218-kc.js; every item was independently answer-key verified. */
(function () {
  var KB = window.BFS218_KC = window.BFS218_KC || {};
  var add = function (src) {
    if (!src) return;
    Object.keys(src).forEach(function (w) { KB[w] = (KB[w] || []).concat(src[w]); });
  };
  add(window.BFS218_KC_SETC_ADDITIONS);
  add(window.BFS218_KC_W349_ADDITIONS);
  add(window.NUMERACY_ADDITIONS && window.NUMERACY_ADDITIONS.BFS218);
})();
