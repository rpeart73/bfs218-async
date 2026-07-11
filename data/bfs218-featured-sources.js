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
      title: 'How not to create a racist, sexist robot', authors: 'CBC Radio, The Current', publisher: 'CBC Radio', year: 2017, week: 2, primaryLabel: 'Open the audio and article',
      themes: ['bias','design','representation'], origin: 'Canada', len: 'Short listen and article', diff: 1,
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
      themes: ['bias','policing','feedback loops'], origin: 'United Kingdom', len: 'Long-form article', diff: 2,
      abstract: 'Buranyi surveys early evidence that machine-learning systems can absorb social inequality from data and intensify it. The article includes predictive-policing feedback loops and automated risk decisions, making it a useful historical companion to engineered inequity.',
      coreIdea: 'When unequal records become training data, automation can make an old pattern look objective and feed its own outputs back into the next decision.',
      url: 'https://www.theguardian.com/inequality/2017/aug/08/rise-of-the-racist-robots-how-ai-is-learning-all-our-worst-impulses', fulltext: true,
      related: ['benjamin2019','robertson2020']
    },
    {
      id: 'cbcbias2021', assigned: 'Optional language-bias case for Week 4', eye: 'western', type: 'News article and video', access: 'open',
      title: 'AI has a racism problem, but fixing it is complicated, say experts', authors: 'Jorge Barrera and Albert Leung', publisher: 'CBC News', year: 2021, week: 4,
      themes: ['bias','language','defaults'], origin: 'Canada', len: 'About 900 words and a 2:27 video', diff: 1,
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
      themes: ['representation','bias','embodiment'], origin: 'United States', len: 'Short article', diff: 1,
      abstract: 'CNN reports on research asking why human-shaped robots are so often imagined as white and how racialized assumptions can extend into robot design. The case broadens coded exposure from recognition accuracy to whose body is treated as the technological default.',
      coreIdea: 'Representation is a design choice: even a robot\'s imagined body can reveal who designers treat as the unmarked default.',
      url: 'https://www.cnn.com/2019/08/01/tech/robot-racism-scn-trnd', fulltext: true,
      related: ['buolamwini2018','crenshaw1991']
    },
    {
      id: 'cbcjustice2025', assigned: 'Optional audio case for Week 5', eye: 'western', type: 'Radio interview', access: 'open',
      title: 'Why MIT researcher is calling for algorithmic justice against AI biases', authors: 'CBC Radio, Ideas, with Joy Buolamwini', publisher: 'CBC Radio', year: 2025, week: 5, primaryLabel: 'Open the audio and article',
      themes: ['facial recognition','intersectionality','algorithmic justice'], origin: 'Canada', len: 'Radio interview and article', diff: 1,
      abstract: 'CBC Ideas speaks with Joy Buolamwini about racial and gender bias in AI and the case for algorithmic justice. It gives students a current audio route into the Gender Shades evidence and the wider questions of rights, accountability, and public freedom.',
      coreIdea: 'Measuring unequal error is the beginning of accountability; algorithmic justice asks what rights, safeguards, and power must change after the pattern is documented.',
      url: 'https://www.cbc.ca/radio/ideas/unmasking-ai-bias-algorithmic-justice-1.7531391', fulltext: true,
      related: ['buolamwini2018','attard2023'],
      audio: { kind: 'Podcast', platform: 'source', source: 'CBC Radio, Ideas', scholar: 'Joy Buolamwini', title: 'Why MIT researcher is calling for algorithmic justice against AI biases', url: 'https://www.cbc.ca/radio/ideas/unmasking-ai-bias-algorithmic-justice-1.7531391', embed: false,
        synopsis: 'Joy Buolamwini connects documented racial and gender bias in AI to a public call for algorithmic justice.',
        watchFor: ['How the coded gaze was made measurable', 'Why race and gender must be examined together', 'What algorithmic justice asks institutions to change'],
        readNext: 'Return to Gender Shades. Identify one measured disparity, then distinguish the evidence in the study from the remedy proposed in the interview.' }
    },
    {
      id: 'rcigpt4o2024', assigned: 'Optional current-model case for Week 9', eye: 'western', type: 'Investigative news article', access: 'open',
      title: 'How the new version of ChatGPT generates hate and disinformation on command', authors: 'Radio-Canada International', publisher: 'Radio-Canada International', year: 2024, week: 9,
      themes: ['generative AI','hate','safeguards'], origin: 'Canada', len: 'Investigative article', diff: 2,
      abstract: 'A Radio-Canada investigation reported that the then-new GPT-4o model could be pushed to produce offensive content, hate, and disinformation. The page is explicitly dated and model-specific: students use it as a snapshot of safeguards at one point in time, not as a permanent claim about every later system.',
      coreIdea: 'A system marketed as helpful can still expose people to predictable harm when its safeguards bend under pressure; the exact behaviour must be tied to the model and date tested.',
      url: 'https://ici.radio-canada.ca/rci/en/news/2077045/how-the-new-version-of-chatgpt-generates-hate-and-disinformation-on-command', fulltext: true,
      related: ['benjamin2019','costanza2020']
    },
    {
      id: 'pbsbias2024', assigned: 'Optional course overview video for Week 2', eye: 'western', type: 'Documentary episode', access: 'open',
      title: 'Techno Racism: The Bias Built In', authors: 'Mutually Inclusive, WGVU Public Media', publisher: 'PBS', year: 2024, week: 2, primaryLabel: 'Open the captioned video',
      themes: ['techno-racism','historical data','facial recognition','accountability'], origin: 'United States', len: '26 minutes, 46 seconds', diff: 1,
      abstract: 'This captioned public-television episode introduces techno-racism through historical data, photography, facial recognition, policing, housing, and technology work. Its interviews and cases give students a course-wide map that they can test against the assigned scholarship rather than treating the episode as proof on its own.',
      coreIdea: 'Historical data carries earlier discrimination into technical systems, so accountability requires attention to data, design, deployment, governance, and who has a voice in each decision.',
      url: 'https://www.pbs.org/video/techno-racism-the-bias-built-in-mutually-inclusive-18aiyz/', transcriptUrl: 'https://www.pbs.org/video/techno-racism-the-bias-built-in-mutually-inclusive-18aiyz/', fulltext: true,
      related: ['benjamin2019','buolamwini2018','robertson2020'],
      video: { kind: 'Video', platform: 'source', source: 'PBS and WGVU Public Media', scholar: 'Mutually Inclusive', title: 'Techno Racism: The Bias Built In', url: 'https://www.pbs.org/video/techno-racism-the-bias-built-in-mutually-inclusive-18aiyz/', embed: false,
        synopsis: 'A captioned overview of how historical racism can be encoded into data and technical systems, with cases spanning photography, facial recognition, policing, housing, and technology work.',
        watchFor: ['How the episode connects historical records to present predictions', 'Where it moves from technical accuracy to rights and power', 'Which proposed remedies change representation and which change institutional rules'],
        readNext: 'Compare the episode with Benjamin for the New Jim Code, Buolamwini and Gebru for measured evidence, and Robertson and colleagues for the Canadian human-rights frame.' }
    },
    {
      id: 'wadhawan2022', assigned: 'Optional Canadian legal reading for Week 6', eye: 'western', type: 'Law journal article', access: 'open',
      title: 'Let the Machines Do the Dirty Work: Social Media, Machine Learning Technology and the Iteration of Racialized Surveillance', authors: 'Subhah Wadhawan', publisher: 'Canadian Journal of Law and Technology', year: 2022, week: 6,
      themes: ['racialized surveillance','content moderation','Islamophobia','algorithmic opacity'], origin: 'Canada', len: '22 pages', diff: 3,
      abstract: 'Wadhawan argues that opaque machine-learning systems used by digital platforms can reproduce racialized surveillance by disproportionately censoring speech related to Islam, including content without a meaningful link to violence. The article uses critical race theory and Simone Browne\'s concept of racialized surveillance, then proposes stronger algorithmic hygiene.',
      coreIdea: 'Content moderation can become racialized surveillance when opaque machine-learning systems treat Islamic speech as a proxy for danger and suppress it without a meaningful connection to violence.',
      url: 'https://digitalcommons.schulichlaw.dal.ca/cjlt/vol20/iss1/1/', pdfUrl: 'https://digitalcommons.schulichlaw.dal.ca/cgi/viewcontent.cgi?article=1296&context=cjlt', fulltext: true,
      sourceLabel: 'Publisher page', related: ['nagra2016','noble2018','robertson2020']
    },
    {
      id: 'harvey2023', assigned: 'Optional legal explainer for Week 12', eye: 'western', type: 'Law school explainer', access: 'open',
      title: 'Are We in Good Hands: The Fight Against Techno-Racism', authors: 'Naamu Harvey', publisher: 'Syracuse Journal of Science and Technology Law', year: 2023, week: 12,
      themes: ['techno-racism','facial recognition','lending','accountability'], origin: 'United States', len: 'Short legal explainer', diff: 1,
      abstract: 'Harvey introduces techno-racism through facial recognition, mortgage algorithms, and social-media visibility, then points to workforce representation, anti-racist practice, and proposed algorithmic accountability law. Students use it as a concise legal explainer whose remedies must be tested against the course\'s deeper design and governance readings.',
      coreIdea: 'Techno-racism appears in ordinary systems even without explicit discriminatory intent, and a credible response must combine technical review, institutional accountability, anti-racist practice, and legal oversight.',
      url: 'https://jost.syr.edu/are-we-in-good-hands-the-fight-against-techno-racism/', fulltext: true,
      related: ['attard2023','costanza2020','benjamin2019']
    }
  ];
  var seen = {};
  D.records.forEach(function (r) { seen[r.id] = true; });
  sources.forEach(function (r) { if (!seen[r.id]) D.records.push(r); });
  window.BFS218_FEATURED_SOURCES = sources;
  window.BFS218_FEATURED_SOURCES_BY_WEEK = {
    2: ['cbcrobot2017','pbsbias2024'],
    3: ['guardianrobots2017'],
    4: ['cbcbias2021'],
    5: ['cnnrobot2019','cbcjustice2025'],
    6: ['wadhawan2022'],
    9: ['rcigpt4o2024'],
    12: ['harvey2023']
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
  MC.pbsbias2024 = [
    { q: 'What is the strongest way to use the PBS episode in this course?', options: ['As proof that every technical system produces the same harm', 'As a course-wide map of cases and claims to test against the assigned scholarship', 'As a replacement for all Week 2 readings', 'As evidence that positive outcomes are impossible'], answer: 1, why: 'The episode is a public overview. It helps identify patterns and questions, while the assigned scholarship supplies the concepts and evidence needed to test them.', skill: 'sources', diff: 1 },
    { q: 'What does the episode mean when it says historical data does not forget?', options: ['Data has personal memory', 'Records produced under unequal systems can carry earlier discrimination into later predictions and decisions', 'Old data is always unusable', 'Every data point is intentionally racist'], answer: 1, why: 'The point is structural: data can preserve the results of earlier discrimination even when a later system is presented as new or neutral.', skill: 'mechanisms', diff: 1 }
  ];
  MC.wadhawan2022 = [
    { q: 'What form of racialized surveillance is central to Wadhawan\'s argument?', options: ['Only physical border searches', 'Opaque content-moderation systems disproportionately suppressing speech related to Islam', 'All social-media rules affecting every user equally', 'Human review replacing machine learning'], answer: 1, why: 'The article focuses on machine-learning content moderation that can treat Islamic speech as a proxy for danger, even without a meaningful link to violence.', skill: 'argument', diff: 2 },
    { q: 'Why does algorithmic opacity matter in this reading?', options: ['It makes platforms easier to audit', 'It can hide how categories, data, and rules produce unequal censorship', 'It guarantees neutral decisions', 'It removes institutional responsibility'], answer: 1, why: 'Opacity makes it harder to see, challenge, and remedy the rules through which racialized surveillance is reproduced.', skill: 'mechanisms', diff: 2 }
  ];
  MC.harvey2023 = [
    { q: 'How should this short legal explainer be used with the Week 12 readings?', options: ['As a complete proof of every claim it mentions', 'As an accessible map of examples and remedies to test against deeper policy and design-justice sources', 'As a replacement for the Canadian policy brief', 'As evidence that hiring alone solves techno-racism'], answer: 1, why: 'The explainer is useful for orientation, but its examples and remedies need to be checked against more detailed evidence and governance analysis.', skill: 'sources', diff: 1 },
    { q: 'Which course question most strengthens Harvey\'s proposed remedies?', options: ['Which single developer should be blamed?', 'Do the remedies change only representation, or also the rules, incentives, oversight, and power that shape the system?', 'Can technical review remove the need for law?', 'Should intent determine whether harm matters?'], answer: 1, why: 'The course asks whether a remedy changes the structure that produces harm, not only whether it adds a well-intentioned intervention.', skill: 'evaluation', diff: 2 }
  ];

  /* Every featured source is available against the complete reading corpus.
     Priority pairs receive a hand-written bridge. All remaining pairs receive
     a source-aware bridge that keeps claims, formats, dates, and evidence roles
     distinct. This prevents the comparison tool from treating journalism,
     interviews, reports, and scholarly research as interchangeable evidence. */
  D.syntheses = D.syntheses || {};
  var curated = {
    'benjamin2019|cbcrobot2017': 'CBC\'s 2017 Current segment and Ruha Benjamin\'s Race After Technology begin from the same warning: racism can be reproduced through technical systems without a designer openly announcing racist intent. The segment introduces that problem through public discussion about robots and the assumptions of the people who build them. Benjamin supplies the stronger theoretical account, the New Jim Code, which explains how systems can deepen inequity while being promoted as neutral or progressive. Read together, the radio segment is an accessible historical case and Benjamin is the analytical lens. The useful difference is scale: one asks how bias enters a designed object; the other asks how design, institutions, and racial power make the pattern durable.',
    'cbcrobot2017|noble2018': 'The CBC segment asks how racism and sexism can enter robots through their makers and learning environments. Safiya Umoja Noble shows the same problem operating through search and ranking, where commercial systems reproduce racism and sexism while appearing neutral. The segment makes the design problem audible and concrete; Noble explains why it cannot be reduced to one careless developer. Search results are shaped by business models, classification, and institutional power. Together they move the question from whether a machine is personally biased to where human assumptions and incentives are built into the system.',
    'benjamin2019|guardianrobots2017': 'Stephen Buranyi\'s 2017 Guardian feature collects public examples of machine learning absorbing inequality, including predictive-policing feedback loops. Ruha Benjamin gives those examples a name and a structure through the New Jim Code. The feature shows the pattern in operation; Benjamin explains why the pattern is repeatedly sold as objective progress. Read together, the article is useful historical reporting, not a substitute for Benjamin\'s theory. The comparison question is whether each example is merely a biased output or evidence of a wider arrangement that automates existing racial power.',
    'guardianrobots2017|robertson2020': 'The Guardian feature surveys early international concern about biased machine learning and describes predictive policing as a feedback loop. Robertson, Khoo, and Song later examine algorithmic policing in Canada through a human-rights lens and document how surveillance and predictive systems threaten Charter rights and weigh hardest on racialized communities. The 2017 article helps trace the public warning; the 2020 report provides a more focused Canadian legal and institutional analysis. Compare what changed from a broad warning about biased data to a rights-based account of who is governed, watched, and exposed.',
    'cbcbias2021|noble2018': 'CBC News examines language systems whose safeguards cannot reliably distinguish context from racist or biased language. Safiya Umoja Noble examines search and ranking systems that reproduce racism and sexism through commercial classification. Both challenge the claim that an automated information system is neutral, but they locate failure differently. CBC focuses on context and moderation in language; Noble focuses on ranking, representation, and institutional power. Read together, they show why a technical filter may reduce one visible output while leaving the deeper rules about whose language and knowledge count untouched.',
    'cbcbias2021|koenecke2020': 'CBC News reports on automated language tools that fail to interpret racist language and context reliably. Koenecke and colleagues measure racial disparities in automated speech recognition, finding much higher word-error rates for Black speakers. The news source offers a public case about language safeguards; the scholarly study provides a reproducible benchmark of unequal performance. Together they show two distinct language failures, understanding harmful context and accurately hearing speakers. Keep the evidence roles separate: the CBC case raises the question, while Koenecke and colleagues supply measured comparative evidence.',
    'buolamwini2018|cnnrobot2019': 'The CNN article asks why human-shaped robots are so often imagined as white and reports research on racialized responses to robot bodies. Buolamwini and Gebru audit commercial facial-analysis systems and measure much higher error rates for darker-skinned women. Both expose whiteness as a technological default, but one studies representation and embodiment while the other measures recognition performance. Read together, they show that coded exposure begins before an error rate is calculated: design first decides whose body represents the human, then classification systems decide whose body can be read accurately.',
    'cnnrobot2019|crenshaw1991': 'The CNN article raises a representation question about why humanoid robots are commonly designed as white. Kimberle Crenshaw\'s intersectionality framework asks students to look beyond a single axis and identify who becomes invisible when race, gender, and other structures are separated. Crenshaw does not write about robots, and the news article does not conduct an intersectional analysis. The value of the pairing is methodological: use Crenshaw to ask which identities the robot study makes visible, which it groups together, and whether a design critique focused only on race could still miss people at intersecting positions.',
    'buolamwini2018|cbcjustice2025': 'Gender Shades supplies the empirical foundation for this pairing: Buolamwini and Gebru use an intersectional benchmark to document large accuracy gaps in commercial gender classification. The 2025 CBC Ideas interview lets Joy Buolamwini reflect on what should follow from evidence like that, including rights, safeguards, public accountability, and algorithmic justice. The study measures the disparity; the interview discusses its public meaning and the need for action. Students should not use the interview in place of the study. Instead, compare how a scholarly audit establishes a claim with how a public interview carries that claim into a justice argument.',
    'attard2023|cbcjustice2025': 'Joy Buolamwini\'s CBC Ideas interview argues that documented AI bias requires algorithmic justice, not only better accuracy. Attard-Frost tests Canada\'s proposed Artificial Intelligence and Data Act and identifies gaps in specificity, transparency, and public engagement. The interview makes the justice demand public and accessible; the policy brief asks whether a proposed Canadian law can meet that demand. Read together, they connect evidence of unequal treatment to the concrete rules, oversight, and participation needed for accountability.',
    'benjamin2019|rcigpt4o2024': 'Radio-Canada International reports that GPT-4o could be prompted to produce hate and disinformation during tests conducted in 2024. Ruha Benjamin\'s New Jim Code explains why a harmful technical output should be read within the longer history of systems presented as innovative while reproducing inequity. The investigation is a dated, model-specific case; Benjamin provides a durable structural lens. Read together, they prevent two errors: treating one test as proof about every AI system, or treating the test as an isolated glitch with no relation to the social conditions the model learned from.',
    'costanza2020|rcigpt4o2024': 'The Radio-Canada investigation tests a generative-AI system against its public promise and reports that safeguards could be pushed into producing hate and disinformation. Costanza-Chock\'s design justice framework asks who was centred in design, who bears the consequences, and whether impact matters more than good intentions. The investigation identifies a failure under specific 2024 test conditions; design justice turns that result into questions about process and responsibility. The pairing does not prove that every run will be harmful. It asks whether predictable risk was designed, tested, disclosed, and governed with affected communities in view.',
    'benjamin2019|pbsbias2024': 'The PBS episode gives students a public, case-rich overview of techno-racism across photography, facial recognition, policing, housing, data, and technology work. Ruha Benjamin supplies the deeper concept that connects those cases, the New Jim Code. The episode shows many places where historical inequality can enter a system; Benjamin explains why those patterns recur while innovation is described as neutral or progressive. Use the episode to locate mechanisms and affected people, then use Benjamin to decide whether each case is an isolated error or part of a wider racial order.',
    'buolamwini2018|pbsbias2024': 'The PBS episode recounts facial-recognition failures and includes Joy Buolamwini\'s public explanation of the coded gaze. Gender Shades is the scholarly audit behind that public account. The episode supplies history, interviews, and consequences; Buolamwini and Gebru supply the benchmark, comparison groups, and measured error disparities. Read together, they demonstrate why media and research must not be collapsed. The episode helps students see why the issue matters, while the paper shows how the central performance claim was established.',
    'pbsbias2024|robertson2020': 'The PBS episode surveys how biased data and automated decisions affect policing, housing, work, and civil rights in the United States. Robertson, Khoo, and Song focus on algorithmic policing in Canada and analyse it through human-rights and Charter concerns. Both connect technical systems to institutional power, but their jurisdictions and evidence differ. Compare which harms travel across borders, which legal protections are country-specific, and how a public documentary and a Canadian rights report support claims differently.',
    'nagra2016|wadhawan2022': 'Baljit Nagra documents how young Canadian Muslims experience security and surveillance as a racialized burden that shapes identity and everyday life. Subhah Wadhawan examines a digital mechanism that can reproduce the same post-9/11 construction, machine-learning content moderation that treats Islamic speech as a proxy for danger. Nagra centres lived experience; Wadhawan analyses platform rules, opacity, and law. Together they connect the person who must live under suspicion with the technical and institutional process that can extend suspicion into online speech.',
    'noble2018|wadhawan2022': 'Safiya Umoja Noble shows how search and ranking systems reproduce racism and sexism through commercial classification while appearing neutral. Subhah Wadhawan studies opaque content-moderation systems that can disproportionately censor speech related to Islam. Both examine platforms that organize visibility, but in opposite directions: ranking can amplify degrading representation, while moderation can suppress legitimate expression. The comparison reveals that algorithmic power includes both making harmful content easier to find and making racialized communities harder to hear.',
    'robertson2020|wadhawan2022': 'Robertson, Khoo, and Song analyse Canadian algorithmic policing as a threat to rights that weighs hardest on racialized communities. Subhah Wadhawan examines racialized surveillance by digital platforms, especially the disproportionate censorship of Islamic speech through opaque machine learning. One focuses on police and public authority; the other on private digital intermediaries. Read together, they show surveillance moving across institutional boundaries and raise a shared governance question: who can inspect, contest, and remedy an automated decision when the system is hidden?',
    'attard2023|harvey2023': 'Naamu Harvey offers a concise legal explainer on techno-racism, using facial recognition, lending, and social media to argue for technical review, representation, anti-racist practice, and legal oversight. Attard-Frost conducts a narrower Canadian policy audit and identifies concrete gaps in the proposed Artificial Intelligence and Data Act. Harvey maps the problem and a broad menu of responses; Attard-Frost tests whether one proposed law has enough specificity, transparency, and public engagement. Together they help students move from saying regulation is needed to evaluating whether a particular regulatory design is adequate.',
    'costanza2020|harvey2023': 'Harvey proposes several responses to techno-racism, including a more diverse technology workforce, critical anti-racist practice, algorithm review, and law. Costanza-Chock\'s design justice framework supplies a demanding test for those proposals: do affected communities lead, does impact outweigh intention, and does the remedy redistribute decision-making power? The explainer offers practical entry points; design justice asks whether those entry points change the structure or merely improve who participates in it.',
    'benjamin2019|harvey2023': 'Harvey introduces techno-racism through everyday cases and argues that technology is shaped by existing inequality even without discriminatory intent. Benjamin\'s New Jim Code provides the deeper theory for that claim, showing how innovation can reproduce racial order while being promoted as objective progress. The explainer is a clear public doorway; Benjamin is the stronger conceptual foundation. Compare Harvey\'s proposed remedies with Benjamin\'s abolitionist question: which responses repair an unjust system, and which responses require replacing its underlying rules?'
  };
  Object.keys(curated).forEach(function (key) { D.syntheses[key] = curated[key]; });

  function isFeatured(r) { return !!r && sources.some(function (s) { return s.id === r.id; }); }
  function shortClaim(r) { return String(r.coreIdea || r.abstract || '').replace(/\s+/g, ' ').replace(/[.;:]?\s*$/, '.'); }
  function evidenceRole(r) {
    if (isFeatured(r)) return 'a public-facing ' + String(r.type || 'source').toLowerCase() + ' tied to ' + r.year;
    if (/report/i.test(r.type || '')) return 'a research or policy report';
    if (/book|chapter/i.test(r.type || '')) return 'a scholarly book or chapter';
    return 'a scholarly ' + String(r.type || 'reading').toLowerCase();
  }
  function completeBridge(a, b) {
    var featured = isFeatured(a) ? a : b;
    var other = featured === a ? b : a;
    return 'This pairing places ' + featured.title + ', ' + evidenceRole(featured) + ', beside ' + other.title + ', ' + evidenceRole(other) + '. The first source asks students to work with this claim: ' + shortClaim(featured) + ' The second asks them to work with this claim: ' + shortClaim(other) + ' They may connect, extend, or challenge one another, but they do not provide the same kind of evidence. Use the public source to identify a concrete case, public explanation, or moment in the debate. Use the course reading to test the case against a scholarly concept, method, or body of evidence. Then ask what each source can support, what it cannot support, whose perspective is present, and what further evidence would be needed before drawing a broader conclusion.';
  }
  D.records.forEach(function (a) {
    D.records.forEach(function (b) {
      if (a.id >= b.id || (!isFeatured(a) && !isFeatured(b))) return;
      var key = [a.id, b.id].sort().join('|');
      if (!D.syntheses[key]) D.syntheses[key] = completeBridge(a, b);
    });
  });
})();
