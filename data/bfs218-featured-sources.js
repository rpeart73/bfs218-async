/* BFS218 featured public sources.
   These records link to official publisher pages; nothing is copied or rehosted.
   They are optional case sources that connect weekly concepts to public reporting. */
(function () {
  'use strict';
  var D = window.BFS218;
  if (!D || !Array.isArray(D.records)) return;
  var sources = [
    {
      id: 'cbcrobot2017', assigned: 'Optional historical case for Week 2', eye: 'western', type: 'Radio segment', access: 'open',
      title: 'How not to create a racist, sexist robot', authors: 'CBC Radio, The Current', publisher: 'CBC Radio', year: 2017, week: 2,
      themes: ['bias','design','representation'], origin: 'Canada', len: 'Short listen and article',
      abstract: 'This 2017 Current segment asks how the people and assumptions inside technology shape what robots learn and reproduce. It works as an early historical checkpoint: the warning that technical systems can carry racism and sexism predates the current generative-AI cycle.',
      coreIdea: 'A machine does not need personal intent to reproduce the assumptions and exclusions built into its design and learning environment.',
      url: 'https://www.cbc.ca/radio/thecurrent/the-current-for-may-4-2017-1.4097748/how-not-to-create-a-racist-sexist-robot-1.4097853',
      transcriptUrl: 'https://www.cbc.ca/radio/thecurrent/the-current-for-may-4-2017-1.4097748/may-4-2017-full-episode-transcript-1.4099897', fulltext: true,
      related: ['benjamin2019','noble2018'],
      audio: { kind: 'Podcast', platform: 'source', source: 'CBC Radio, The Current', scholar: 'CBC Radio, The Current', title: 'How not to create a racist, sexist robot', url: 'https://www.cbc.ca/radio/thecurrent/the-current-for-may-4-2017-1.4097748/how-not-to-create-a-racist-sexist-robot-1.4097853', embed: false,
        synopsis: 'A 2017 discussion of how human assumptions can enter the design and learning of robots. Use it to test the Week 2 claim that technical systems are social systems.',
        watchFor: ['Where the bias enters the design process', 'Why intent is not the only question', 'What responsibility belongs to designers and institutions'],
        readNext: 'Read Benjamin and Noble. Compare the segment\'s language of bias with the course language of structure, power, and the New Jim Code.' }
    },
    {
      id: 'guardianrobots2017', assigned: 'Optional historical case for Week 3', eye: 'western', type: 'News feature', access: 'open',
      title: 'Rise of the racist robots: how AI is learning all our worst impulses', authors: 'Stephen Buranyi', publisher: 'The Guardian', year: 2017, week: 3,
      themes: ['bias','policing','feedback loops'], origin: 'United Kingdom', len: 'Long-form article',
      abstract: 'Buranyi surveys early evidence that machine-learning systems can absorb social inequality from data and intensify it. The article includes predictive-policing feedback loops and automated risk decisions, making it a useful historical companion to engineered inequity.',
      coreIdea: 'When unequal records become training data, automation can make an old pattern look objective and feed its own outputs back into the next decision.',
      url: 'https://www.theguardian.com/inequality/2017/aug/08/rise-of-the-racist-robots-how-ai-is-learning-all-our-worst-impulses', fulltext: true,
      related: ['benjamin2019','robertson2020']
    },
    {
      id: 'cbcbias2021', assigned: 'Optional language-bias case for Week 4', eye: 'western', type: 'News article and video', access: 'open',
      title: 'AI has a racism problem, but fixing it is complicated, say experts', authors: 'Jorge Barrera and Albert Leung', publisher: 'CBC News', year: 2021, week: 4,
      themes: ['bias','language','defaults'], origin: 'Canada', len: 'About 900 words and a 2:27 video',
      abstract: 'CBC News examines failures in automated language systems, including safeguards that could not reliably distinguish legitimate language from racist or biased terms. The case helps students ask what a language system treats as normal and what happens when the default lacks context.',
      coreIdea: 'A language system can reproduce racist output when its data, context rules, and safeguards are too narrow, even when the product is presented as neutral automation.',
      url: 'https://www.cbc.ca/news/science/artificial-intelligence-racism-bias-1.6027150', fulltext: true,
      related: ['noble2018','koenecke2020'],
      video: { kind: 'Video', platform: 'source', source: 'CBC News', scholar: 'Jorge Barrera and Albert Leung', title: 'AI\'s inability to recognize racist language', url: 'https://www.cbc.ca/player/play/video/1.6028159', embed: false,
        synopsis: 'A short CBC News companion video on the difficulty automated language tools have distinguishing context from racist language.',
        watchFor: ['What the system fails to understand about context', 'Why a filter is not the same as accountability', 'Who carries the cost of a language error'],
        readNext: 'Read the accompanying CBC article, then compare the case with Noble on ranking and Koenecke and colleagues on speech-recognition disparities.' }
    },
    {
      id: 'cnnrobot2019', assigned: 'Optional representation case for Week 5', eye: 'western', type: 'News article', access: 'open',
      title: 'Robot racism? Yes, says a study showing humans\' biases extend to robots', authors: 'Caroline Klein and David Allan', publisher: 'CNN Business', year: 2019, week: 5,
      themes: ['representation','bias','embodiment'], origin: 'United States', len: 'Short article',
      abstract: 'CNN reports on research asking why human-shaped robots are so often imagined as white and how racialized assumptions can extend into robot design. The case broadens coded exposure from recognition accuracy to whose body is treated as the technological default.',
      coreIdea: 'Representation is a design choice: even a robot\'s imagined body can reveal who designers treat as the unmarked default.',
      url: 'https://www.cnn.com/2019/08/01/tech/robot-racism-scn-trnd', fulltext: true,
      related: ['buolamwini2018','crenshaw1991']
    },
    {
      id: 'cbcjustice2025', assigned: 'Optional audio case for Week 5', eye: 'western', type: 'Radio interview', access: 'open',
      title: 'Why MIT researcher is calling for algorithmic justice against AI biases', authors: 'CBC Radio, Ideas, with Joy Buolamwini', publisher: 'CBC Radio', year: 2025, week: 5,
      themes: ['facial recognition','intersectionality','algorithmic justice'], origin: 'Canada', len: 'Radio interview and article',
      abstract: 'CBC Ideas speaks with Joy Buolamwini about racial and gender bias in AI and the case for algorithmic justice. It gives students a current audio route into the Gender Shades evidence and the wider questions of rights, accountability, and public freedom.',
      coreIdea: 'Measuring unequal error is the beginning of accountability; algorithmic justice asks what rights, safeguards, and power must change after the pattern is documented.',
      url: 'https://www.cbc.ca/radio/ideas/unmasking-ai-bias-algorithmic-justice-1.7531391', fulltext: true,
      related: ['buolamwini2018','unhrc2020'],
      audio: { kind: 'Podcast', platform: 'source', source: 'CBC Radio, Ideas', scholar: 'Joy Buolamwini', title: 'Why MIT researcher is calling for algorithmic justice against AI biases', url: 'https://www.cbc.ca/radio/ideas/unmasking-ai-bias-algorithmic-justice-1.7531391', embed: false,
        synopsis: 'Joy Buolamwini connects documented racial and gender bias in AI to a public call for algorithmic justice.',
        watchFor: ['How the coded gaze was made measurable', 'Why race and gender must be examined together', 'What algorithmic justice asks institutions to change'],
        readNext: 'Return to Gender Shades. Identify one measured disparity, then distinguish the evidence in the study from the remedy proposed in the interview.' }
    },
    {
      id: 'rcigpt4o2024', assigned: 'Optional current-model case for Week 9', eye: 'western', type: 'Investigative news article', access: 'open',
      title: 'How the new version of ChatGPT generates hate and disinformation on command', authors: 'Radio-Canada International', publisher: 'Radio-Canada International', year: 2024, week: 9,
      themes: ['generative AI','hate','safeguards'], origin: 'Canada', len: 'Investigative article',
      abstract: 'A Radio-Canada investigation reported that the then-new GPT-4o model could be pushed to produce offensive content, hate, and disinformation. The page is explicitly dated and model-specific: students use it as a snapshot of safeguards at one point in time, not as a permanent claim about every later system.',
      coreIdea: 'A system marketed as helpful can still expose people to predictable harm when its safeguards bend under pressure; the exact behaviour must be tied to the model and date tested.',
      url: 'https://ici.radio-canada.ca/rci/en/news/2077045/how-the-new-version-of-chatgpt-generates-hate-and-disinformation-on-command', fulltext: true,
      related: ['benjamin2019','costanza2020']
    }
  ];
  var seen = {};
  D.records.forEach(function (r) { seen[r.id] = true; });
  sources.forEach(function (r) { if (!seen[r.id]) D.records.push(r); });
  window.BFS218_FEATURED_SOURCES = sources;
  window.BFS218_FEATURED_SOURCES_BY_WEEK = {
    2: ['cbcrobot2017'],
    3: ['guardianrobots2017'],
    4: ['cbcbias2021'],
    5: ['cnnrobot2019','cbcjustice2025'],
    9: ['rcigpt4o2024']
  };
  var MC = window.BFS218_MC = window.BFS218_MC || {};
  MC.cbcrobot2017 = [
    { q: 'Why is this 2017 segment useful in Week 2?', options: ['It proves every robot behaves the same way', 'It shows that concerns about racism and sexism in technical design existed before the current generative-AI cycle', 'It replaces the Benjamin reading', 'It argues that only a machine\'s appearance matters'], answer: 1, why: 'The date matters: the segment is a historical checkpoint showing that concerns about bias in technical design are not new.', skill: 'context', diff: 1 },
    { q: 'Which course question best fits the segment?', options: ['Does the machine have feelings?', 'How expensive was the robot?', 'Where did human assumptions enter the design and learning environment?', 'Can the robot move faster?'], answer: 2, why: 'The course studies where assumptions enter a system, not whether the machine has personal intent.', skill: 'mechanisms', diff: 1 }
  ];
  MC.guardianrobots2017 = [
    { q: 'What does the article\'s predictive-policing example show?', options: ['More data always removes bias', 'Past enforcement data can send police back to the same places and create a feedback loop', 'Algorithms do not affect institutions', 'Only incorrect code creates inequality'], answer: 1, why: 'The feedback loop turns earlier policing patterns into new predictions, then treats the resulting arrests as fresh evidence.', skill: 'mechanisms', diff: 1 },
    { q: 'Why should students read this as a historical source?', options: ['Its examples prove nothing has changed since 2017', 'It documents an earlier stage of the public debate and should be compared with newer evidence', 'Older sources are always more reliable', 'It predicts every future AI system'], answer: 1, why: 'A dated source helps trace continuity and change; it should not be treated as a timeless description of every current system.', skill: 'context', diff: 2 }
  ];
  MC.cbcbias2021 = [
    { q: 'What limitation does the CBC source identify in automated language tools?', options: ['They always refuse to translate', 'They can struggle to distinguish legitimate context from biased or racist language', 'They work only with spoken language', 'They cannot store text'], answer: 1, why: 'The article and companion video focus on failures to understand language context and screen racist terms reliably.', skill: 'evidence', diff: 1 },
    { q: 'Which Week 4 idea does this case sharpen?', options: ['A default or safeguard can look neutral while lacking the context needed to protect people', 'Every language error is intentional', 'A filter completely solves institutional accountability', 'Only users create harmful output'], answer: 0, why: 'The case shows how a narrow default or safeguard can fail systematically even without a person choosing each harmful result.', skill: 'concepts', diff: 1 }
  ];
  MC.cnnrobot2019 = [
    { q: 'What design question does the CNN article raise?', options: ['Why are human-shaped robots so often imagined as white?', 'Why do all robots need faces?', 'Why do robots dislike colour?', 'Why should robots replace people?'], answer: 0, why: 'The article reports research about racialized assumptions in how human-shaped robots are represented.', skill: 'evidence', diff: 1 },
    { q: 'How does this connect to coded exposure?', options: ['It shows representation is unrelated to design', 'It asks whose body is treated as the unmarked technological default', 'It proves recognition accuracy is the only issue', 'It says all robots cause identical harm'], answer: 1, why: 'Coded exposure includes who is represented, recognized, watched, or left outside the imagined default.', skill: 'concepts', diff: 2 }
  ];
  MC.cbcjustice2025 = [
    { q: 'What does algorithmic justice add after a disparity is measured?', options: ['A claim that measurement is enough', 'Questions about rights, safeguards, accountability, and power', 'A promise that every error can be removed', 'A reason to ignore intersectionality'], answer: 1, why: 'The interview moves from documenting bias toward what institutions and public rules should change.', skill: 'concepts', diff: 1 },
    { q: 'Why does Week 5 pair this interview with Gender Shades?', options: ['The interview replaces the research evidence', 'The study supplies measured evidence while the interview helps students consider public response and accountability', 'They make identical claims in identical formats', 'The interview is older than the study'], answer: 1, why: 'The two sources do different jobs: one documents a disparity and the other extends the discussion toward justice and accountability.', skill: 'sources', diff: 2 }
  ];
  MC.rcigpt4o2024 = [
    { q: 'Why must this investigation be described as model-specific and dated?', options: ['AI systems and safeguards can change, so the finding should stay tied to the version and time tested', 'Every later model will behave exactly the same way', 'Dates do not matter in technology reporting', 'The investigation studied no specific system'], answer: 0, why: 'The article reports on GPT-4o at a particular time. Responsible analysis does not turn that result into a timeless claim about every later model.', skill: 'context', diff: 1 },
    { q: 'Which Week 9 question best fits this case?', options: ['Does a helpful public promise remove the need to test safeguards?', 'What predictable harm remains possible when a system marketed as helpful is pushed past its safeguards?', 'Can one article prove all AI is harmful?', 'Should students assume every run is negative?'], answer: 1, why: 'Technological benevolence asks students to compare the helpful promise with the power and harm the system can still produce.', skill: 'concepts', diff: 2 }
  ];
})();
