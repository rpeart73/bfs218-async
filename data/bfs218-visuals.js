window.BFS218_VISUALS = {
  weeks: {
    1: {
      kind: 'map',
      title: 'Ordinary tools can carry hidden sorting rules.',
      scene: 'Everyday devices sit around one student. The red path shows that harm can travel through normal tools, not only through openly hostile people.',
      steps: [
        ['Start with the tool', 'Look at the object first: search bar, camera, app, payment screen, or ID check.'],
        ['Find the hidden rule', 'Ask what the tool treats as normal, trusted, risky, or invisible.'],
        ['Name who feels it', 'The course begins when you can say who is sorted, watched, helped, or misread.']
      ],
      activity: {
        title: 'Use the model before you match examples.',
        steps: ['Pick one everyday object in the model.', 'Ask what hidden rule might sit inside it.', 'Then match the examples in the activity to the course idea they show.'],
        modelKind: 'startermap',
        modelTitle: 'Activity model: start your noticing map.',
        modelScene: 'Everyday tools point back to one learner and then into a first map entry. Use this model to notice a real tool before you match it to a course idea.',
        modelSteps: [
          ['Choose one tool', 'Start with a search bar, camera, app, payment screen, or ID check.'],
          ['Ask what it assumes', 'Look for what the tool treats as normal, trusted, risky, or invisible.'],
          ['Make the first map entry', 'Turn the example into a sentence you can revisit later.']
        ]
      }
    },
    2: {
      kind: 'outcomelens',
      title: 'The same rule can produce unequal outcomes.',
      scene: 'Two groups enter the same neutral-looking rule gate. One lane stays wide and open. The other lane narrows, hits a red barrier, and stacks extra burden at the intersection. That is why CRT asks what the system does, who pays, and who is hit hardest.',
      modelNote: 'Start with the identical rule, then compare the two outcome lanes. The red lane shows why unequal results matter even when the rule looks neutral.',
      learningJob: 'This visual teaches the Week 2 move: judge a system by its results, not only by whether anyone meant to discriminate.',
      task: {
        title: 'What to do with this visual',
        lead: 'Use this as a three-step reading tool, not as decoration. Your job is to practise the CRT move from rule, to outcome, to burden.',
        answer: 'You should leave able to say: the same rule can still be unfair when the outcomes show unequal burden.',
        steps: [
          'Press Observe and ask: what rule looks the same for both groups?',
          'Press Follow the path and compare the open lane with the blocked lane.',
          'Press Find the risk and write one sentence about who carries the extra burden.'
        ]
      },
      notePrompt: 'Finish this sentence: The rule looks neutral, but the outcome shows... Then name who carries the extra burden.',
      display: {
        observe: {
          focus: 'Same rule, different outcomes.',
          action: 'Compare the two case cards after they pass through the same rule gate.',
          learning: 'CRT asks what the system does in practice, not only what the rule claims to be.'
        },
        path: {
          focus: 'The outcome is the evidence.',
          action: 'Follow the open lane and the blocked lane from left to right.',
          learning: 'A neutral-looking process can still reproduce an old pattern when its results are unequal.'
        },
        risk: {
          focus: 'The burden is not evenly shared.',
          action: 'Inspect the stacked red and orange markers where the blocked path builds pressure.',
          learning: 'Intersectionality asks who is hit hardest when systems overlap.'
        }
      },
      steps: [
        ['Start with the same rule', 'Both groups enter the same surface rule, so intent alone cannot explain the result.'],
        ['Compare the lanes', 'One lane stays open while the other narrows and blocks. The outcome is the evidence.'],
        ['Find the burden stack', 'Intersectionality asks which subgroup carries the heaviest load at the overlap.']
      ],
      activity: {
        title: 'Use the model to name the mechanism.',
        steps: ['Read the case outcome.', 'Ask which course idea explains how the harm happens.', 'Choose the mechanism, then use the feedback as evidence.'],
        modelKind: 'mechanismatch',
        modelTitle: 'Activity model: case outcome to mechanism.',
        modelScene: 'A case file travels through an outcomes lens before it reaches the concept bins. Use this model to see that the activity is asking for the mechanism that explains the result, not a guess about intent.',
        modelNote: 'Read what happened first, pass it through the outcomes lens, then choose the course idea that explains why the harm repeats.',
        modelLearningJob: 'This activity model helps you explain why a harm repeats, using a course concept instead of a personal guess.',
        modelControls: {
          predict: 'Read outcome',
          try: 'Test mechanism',
          explain: 'Choose match'
        },
        modelDisplay: {
          predict: {
            focus: 'Start with what happened.',
            action: 'Read the case file before you answer below.',
            learning: 'A strong answer begins with the outcome, not with a guess about someone\'s intention.'
          },
          try: {
            focus: 'Run the mechanism test.',
            action: 'Choose this model step to test what rule, record, default, or overlap is doing the work.',
            learning: 'The right concept should explain how the harm is produced, not just sound related.'
          },
          explain: {
            focus: 'Match the mechanism.',
            action: 'Choose this model step, then use the answer buttons below to pick the course idea.',
            learning: 'By the end, you should be able to say: this happened because the system worked this way.'
          }
        },
        modelSteps: [
          ['Read the outcome', 'Stay with what happened in the example before judging intent.'],
          ['Ask why it repeats', 'Look for the system rule, old record, default, or overlap doing the work.'],
          ['Name the mechanism', 'Use the feedback to test whether your choice explains the harm.']
        ],
        modelLabels: [
          { t: '1. Case outcome', sub: 'Start with what happened.' },
          { t: '2. Outcomes lens', sub: 'Ask why the result repeats.' },
          { t: '3. Mechanism match', sub: 'Choose the idea that explains it.' }
        ]
      }
    },
    3: {
      kind: 'pipeline',
      title: 'Unequal outcomes can be built into a process.',
      scene: 'A pipeline moves from old records to a new decision. Red blocks show where past inequity can be carried forward by data, rules, and scores.',
      steps: [
        ['Trace the input', 'Ask what old records, labels, or assumptions feed the tool.'],
        ['Follow the rule', 'Look at the score, threshold, or model that turns input into a decision.'],
        ['Check the result', 'Ask whether the new tool repeats an old pattern with a cleaner name.']
      ],
      activity: {
        title: 'Use the model to trace the chain.',
        steps: ['Start at the input.', 'Follow the rule or score.', 'Name where inequity enters the chain.'],
        modelKind: 'decisionpath',
        modelTitle: 'Activity model: follow one built-in decision.',
        modelScene: 'A decision point branches into different outcomes. Use this model to slow down and ask where a neutral-looking process starts to reproduce an old pattern.',
        modelSteps: [
          ['Locate the input', 'What information enters the system first?'],
          ['Follow the rule', 'What score, label, or threshold changes the path?'],
          ['Check the outcome', 'Who receives help, suspicion, exposure, or exclusion?']
        ]
      }
    },
    4: {
      kind: 'switches',
      title: 'Defaults make choices before people notice.',
      scene: 'A control board shows default settings already flipped in one direction. The red output shows that a default can shape life before anyone makes an individual choice.',
      steps: [
        ['Find the default', 'Look for the setting that is already chosen before a user acts.'],
        ['Ask who fits it', 'A default usually fits someone more easily than someone else.'],
        ['Change the setting', 'A fairer system makes the default visible and challengeable.']
      ],
      activity: {
        title: 'Use the model by flipping defaults.',
        steps: ['Turn each default on or off.', 'Read who bears the cost.', 'Explain why a default is never neutral.'],
        modelKind: 'defaultboard',
        modelTitle: 'Activity model: test the default board.',
        modelScene: 'A control board shows choices already set before the user arrives. Use this model to remember that defaults make decisions quietly.',
        modelSteps: [
          ['Find the setting', 'A rule is already chosen.'],
          ['Switch it', 'Turn one default on or off.'],
          ['Name the cost', 'Ask who has to adapt to the default.']
        ]
      }
    },
    5: {
      kind: 'audit',
      title: 'The average hides the group carrying the error.',
      scene: 'A benchmark table is split into four trays. Red pins cluster in one tray to show why Gender Shades had to cut the results intersectionally.',
      steps: [
        ['Run the test', 'The system is not trusted because it looks technical. It has to be tested.'],
        ['Slice the result', 'Overall accuracy is not enough. Cut by gender, skin type, and then both together.'],
        ['Name the pattern', 'The coded gaze appears when the errors cluster on darker-skinned women.']
      ],
      activity: {
        title: 'Use the model as an audit lab.',
        steps: ['Run the benchmark.', 'Rotate the model and inspect the trays.', 'Use the slice buttons to see what the average hides.']
      }
    },
    6: {
      kind: 'gate',
      title: 'Surveillance turns movement into a decision point.',
      scene: 'A border and policing gate scans people as they move through. Red beams show how watching, flagging, and storing data can make some people carry more risk.',
      steps: [
        ['See the checkpoint', 'The system watches a person before anything has happened.'],
        ['Follow the flag', 'A scan becomes a label, and the label can travel into another database.'],
        ['Ask who decides', 'Accountability means asking who approved the tool and who can challenge the flag.']
      ],
      activity: {
        title: 'Use the model to read a surveillance decision.',
        steps: ['Choose the decision point.', 'Ask what data is being joined.', 'Name who can appeal or correct the flag.'],
        modelKind: 'surveillanceflow',
        modelTitle: 'Activity model: follow the surveillance flag.',
        modelScene: 'A person moves through a checkpoint, a scan becomes a data label, and the label travels to another decision point. Use this model to ask where accountability should enter.',
        modelSteps: [
          ['Find the checkpoint', 'Where does watching begin?'],
          ['Follow the data trail', 'What label or database does the scan feed?'],
          ['Look for appeal', 'Who can challenge the flag before it harms someone?']
        ]
      }
    },
    7: {
      kind: 'review',
      title: 'Study Week is a pause, not a new unit.',
      scene: 'The first half of the course is shown as linked blocks. The pause lets students review the chain before the course turns toward response.',
      steps: [
        ['Look back', 'Review the weeks you have already opened.'],
        ['Find the pattern', 'Ask which idea keeps returning across different technologies.'],
        ['Rest and reset', 'There is no new content this week. Use it to catch up or pause.']
      ],
      activity: {
        title: 'Use the model as a review map.',
        steps: ['Choose one earlier week.', 'Reread your note from that week.', 'Add one sentence about what you see more clearly now.'],
        modelKind: 'toolkit',
        modelTitle: 'Activity model: assemble your review kit.',
        modelScene: 'A small workbench holds the pieces of the first half of the course. Use this model to choose the part you need to strengthen before the course turns toward response.',
        modelSteps: [
          ['Choose a week', 'Pick one earlier idea that still feels unfinished.'],
          ['Find the return point', 'Read your note or the anchor source again.'],
          ['Name one clearer idea', 'Write what you understand better now.']
        ]
      }
    },
    8: {
      kind: 'vault',
      title: 'Data is also a story about people.',
      scene: 'A data vault, story cards, and a key show that data is not just information. It is power over how a person or community is represented.',
      steps: [
        ['Ask who owns it', 'Data about people is not neutral just because it is stored digitally.'],
        ['Ask who tells the story', 'A dataset can speak about people without letting them speak for themselves.'],
        ['Return control', 'Data sovereignty asks who has authority over collection, use, and meaning.']
      ],
      activity: {
        title: 'Use the model to inspect a data story.',
        steps: ['Identify the data being used.', 'Ask whose story it tells.', 'Ask who should control or correct it.'],
        modelKind: 'datastory',
        modelTitle: 'Activity model: open the data story.',
        modelScene: 'A data vault, story cards, and a key separate information from authority. Use this model to ask who controls the record and who gets to correct it.',
        modelSteps: [
          ['Name the record', 'What data is being stored or shared?'],
          ['Read the story', 'What claim does the data make about people?'],
          ['Return the key', 'Who should govern collection, use, and correction?']
        ]
      }
    },
    9: {
      kind: 'benevolence',
      title: 'A helpful tool can still create harm.',
      scene: 'A polished help kiosk feeds a hidden funnel. The model shows that a tool sold as support can still sort, expose, or control people.',
      steps: [
        ['Read the promise', 'Start with what the tool says it is helping with.'],
        ['Look behind it', 'Ask what data it collects, what it predicts, and who benefits.'],
        ['Judge the effect', 'A good intention does not cancel a harmful outcome.']
      ],
      activity: {
        title: 'Predict who the AI detector accuses.',
        steps: ['Read the three writers.', 'Commit to a prediction.', 'Compare it with the documented result.'],
        modelKind: 'detector',
        modelTitle: 'Activity model: three essays meet one detector.',
        modelScene: 'Three student essays move through an AI-writing detector that advertises near-perfect accuracy. The verdict board shows who actually gets flagged.',
        modelSteps: [
          ['Read the writers', 'Three essays: one AI-assisted, two fully human.'],
          ['Watch the scan', 'The detector scores how predictable the wording is.'],
          ['Read the verdicts', 'Who gets flagged, and who walks through untouched?']
        ]
      }
    },
    10: {
      kind: 'sorting',
      title: 'Prediction can decide who receives support.',
      scene: 'Student records move through sorting gates. The red lane shows how a model can leave some students with less support while appearing efficient.',
      steps: [
        ['Watch the sort', 'The model turns a person into a category or risk label.'],
        ['Check the threshold', 'A cutoff decides who receives help and who does not.'],
        ['Ask what is missing', 'A prediction can miss context, need, and the student voice.']
      ],
      activity: {
        title: 'Use the model to inspect a gatekeeping tool.',
        steps: ['Identify the score or threshold.', 'Ask who is filtered out.', 'Name what human review would need to see.'],
        modelKind: 'thresholdaudit',
        modelTitle: 'Activity model: test the threshold.',
        modelScene: 'Student records approach a cutoff line that sends people toward support or away from it. Use this model to see how one threshold can redistribute help.',
        modelSteps: [
          ['Find the score', 'What number, category, or label sorts students?'],
          ['Test the cutoff', 'Who falls just outside support?'],
          ['Add human review', 'What context would a fairer process need to see?']
        ]
      }
    },
    11: {
      kind: 'repair',
      title: 'Repair means shifting power, not just patching a tool.',
      scene: 'A damaged system is surrounded by design tools and community seats. The model separates a quick patch from real redesign.',
      steps: [
        ['Find the broken part', 'Start with the harm the system already caused.'],
        ['Ask who leads', 'Design justice asks that affected people help lead the repair.'],
        ['Build differently', 'A repair changes who has power, not only what the interface looks like.']
      ],
      activity: {
        title: 'Use the model as a repair bench.',
        steps: ['Pick the harm to repair.', 'Choose who must be at the table.', 'Explain whether your fix changes power or only patches damage.'],
        modelKind: 'repairtable',
        modelTitle: 'Activity model: build at the repair table.',
        modelScene: 'A damaged system sits on a work table with tools and seats around it. Use this model to ask whether your response changes power or only patches damage.',
        modelSteps: [
          ['Name the harm', 'What damage has the system already caused?'],
          ['Bring people to the table', 'Who must lead the repair?'],
          ['Choose the tool', 'Does the response shift authority or only adjust the interface?']
        ]
      }
    },
    12: {
      kind: 'policy',
      title: 'Accountability has levels.',
      scene: 'A stack of system, institution, law, and human-rights layers shows that one fix is weak if the rules above it still permit harm.',
      steps: [
        ['Start at the system', 'A product or tool can be fixed, audited, or stopped.'],
        ['Move up the stack', 'Institutions, laws, and rights frameworks decide what must happen next.'],
        ['Find the gap', 'A weak law leaves someone exposed even when the problem is known.']
      ],
      activity: {
        title: 'Use the model as a policy stack.',
        steps: ['Choose a policy lever.', 'Ask which level it works on.', 'Name the trade-off and the gap it still leaves.'],
        modelKind: 'policydeck',
        modelTitle: 'Activity model: compare policy levers.',
        modelScene: 'A layered policy deck separates product fixes, institutional rules, law, and rights. Use this model to see what each lever can do and what it cannot do alone.',
        modelSteps: [
          ['Pick a lever', 'Choose one response from the list.'],
          ['Find its level', 'Is it system, institution, law, or rights?'],
          ['Name the gap', 'What risk remains even after this lever is used?']
        ]
      }
    },
    13: {
      kind: 'return',
      title: 'Your map shows how your seeing changed.',
      scene: 'A spiral path returns to the first map but at a higher level. The model shows rereading as growth, not repetition.',
      steps: [
        ['Start at Week 1', 'Read an early map entry beside a later one.'],
        ['Find the new language', 'Notice what you can name now that you could not name then.'],
        ['Prepare the video', 'Your final work should grow from your own map, not from a lecture summary.']
      ],
      activity: {
        title: 'Use the model to reread your cartography.',
        steps: ['Open an early entry.', 'Open a later entry.', 'Mark what changed in your own seeing.'],
        modelKind: 'capstonemap',
        modelTitle: 'Activity model: prepare your final map.',
        modelScene: 'Early entries, later entries, and a final path sit together. Use this model to turn your own course evidence into the final response.',
        modelSteps: [
          ['Return to evidence', 'Open one early and one later entry.'],
          ['Name the change', 'What can you now see that you could not name before?'],
          ['Shape the final answer', 'Use the change to plan the final video or map.']
        ]
      }
    },
    14: {
      kind: 'compass',
      title: 'The final answer points forward.',
      scene: 'A compass holds the course question, the map, the response tools, and the student commitment. The final week turns the lens toward future practice.',
      steps: [
        ['Answer the question', 'Can a machine be racist? Use your own map as evidence.'],
        ['Name the response', 'Do not end with harm only. Name a real repair, policy, or design-justice move.'],
        ['Carry a commitment', 'Say what you will do differently when a future system looks neutral.']
      ],
      activity: {
        title: 'Use the model to close the course.',
        steps: ['Name the harm.', 'Name the response.', 'Name the commitment you will carry into your field.'],
        modelKind: 'futurecompass',
        modelTitle: 'Activity model: point the answer forward.',
        modelScene: 'A compass connects evidence, response, and commitment. Use this model to make sure the final answer does not stop at harm.',
        modelSteps: [
          ['Use your evidence', 'Ground the answer in your own map.'],
          ['Name a response', 'Choose a repair, policy, or design-justice move.'],
          ['Carry it forward', 'Say what you will notice or do differently in future work.']
        ]
      }
    }
  },
  viewLabels: {
    observe: 'Observe',
    path: 'Follow the path',
    risk: 'Find the risk',
    predict: 'Predict',
    try: 'Try it',
    explain: 'Explain'
  }
};
