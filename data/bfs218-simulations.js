/* BFS218 Systems Simulation Labs v1.
   These are transparent instructional models, not population forecasts.
   The student changes institutional conditions, runs one case or a batch,
   and compares patterns. No student identity is collected or transmitted. */
window.BFS218_SIMULATIONS = {
  1: {
    title: 'Run an ordinary-tool field test',
    caseLabel: 'Fictional case',
    cases: [
      ['Fits the tool\'s expected format', -0.08],
      ['Name, face, or record falls outside the expected format', 0.12],
      ['Record contains missing or conflicting details', 0.18]
    ],
    systemLabel: 'Tool design',
    systems: [['Visible rule only', -0.05], ['Automated sorting', 0.08], ['Automated sorting plus data sharing', 0.17]],
    safeguardLabel: 'Safeguard',
    safeguards: [['No review or appeal', 0], ['Human review before action', -0.12], ['Independent audit, notice, and appeal', -0.22]]
  },
  2: {
    title: 'Test an inherited flag',
    caseLabel: 'Record condition',
    cases: [['No inherited flag', -0.1], ['Old disputed flag', 0.17], ['Old flag with missing context', 0.22]],
    systemLabel: 'How the rule reads history',
    systems: [['History is treated as fact', 0.16], ['History is weighted but reviewable', 0.05], ['History is separated from current evidence', -0.1]],
    safeguardLabel: 'Correction path',
    safeguards: [['No correction route', 0], ['Correction in one database', -0.08], ['Correction travels to every linked system', -0.2]]
  },
  3: {
    title: 'Rebuild the decision pipeline',
    caseLabel: 'Input condition',
    cases: [['Current evidence is complete', -0.06], ['Important context is missing', 0.12], ['Proxy variable carries an old pattern', 0.2]],
    systemLabel: 'Pipeline rule',
    systems: [['Old score reused under a new name', 0.2], ['Score retrained with an audit', 0.03], ['Rule rebuilt with affected people', -0.12]],
    safeguardLabel: 'Accountability',
    safeguards: [['Vendor checks itself', 0], ['Independent outcome audit', -0.12], ['Audit, appeal, and power to stop use', -0.23]]
  },
  4: {
    title: 'Change the default',
    caseLabel: 'Fictional user',
    cases: [['Fits the preset format', -0.1], ['Needs a different language or name format', 0.12], ['Uses an access need the preset ignores', 0.17]],
    systemLabel: 'Default design',
    systems: [['Hidden and difficult to change', 0.18], ['Visible and changeable', 0.03], ['No single path is treated as normal', -0.12]],
    safeguardLabel: 'Support',
    safeguards: [['User must solve it alone', 0], ['Plain-language help', -0.08], ['Accessible alternatives plus staff authority', -0.2]]
  },
  6: {
    title: 'Follow a surveillance flag',
    caseLabel: 'Fictional traveller',
    cases: [['Records match cleanly', -0.08], ['Name is recorded differently across systems', 0.13], ['A prior incorrect flag remains', 0.22]],
    systemLabel: 'Data-sharing design',
    systems: [['Flag stays at one checkpoint', -0.04], ['Flag copies to linked systems', 0.13], ['Flag copies before verification', 0.21]],
    safeguardLabel: 'Appeal design',
    safeguards: [['No notice or appeal', 0], ['Local human correction', -0.09], ['Notice, appeal, and correction propagation', -0.23]]
  },
  7: {
    title: 'Test a review strategy',
    caseLabel: 'Knowledge condition',
    cases: [['Idea feels uncertain', -0.04], ['Idea feels familiar', 0.08], ['Earlier answer was confident and wrong', 0.18]],
    systemLabel: 'Review method',
    systems: [['Reread only', 0.08], ['Retrieve, check, and correct', -0.09], ['Retrieve later and explain the correction', -0.16]],
    safeguardLabel: 'Learning support',
    safeguards: [['No feedback', 0], ['Immediate explanatory feedback', -0.1], ['Feedback plus another later attempt', -0.18]]
  },
  8: {
    title: 'Change who governs the data',
    caseLabel: 'Data relationship',
    cases: [['Community created the record', -0.06], ['Institution collected data about the community', 0.12], ['Data is being reused for a new purpose', 0.2]],
    systemLabel: 'Governance model',
    systems: [['Institution decides and informs later', 0.18], ['Institution consults before use', 0.05], ['Community holds authority to consent, correct, and stop use', -0.17]],
    safeguardLabel: 'Control in practice',
    safeguards: [['One-time consent', 0], ['Ongoing review', -0.1], ['Purpose limits, return, correction, and withdrawal', -0.21]]
  },
  9: {
    title: 'Test a helpful promise',
    caseLabel: 'Fictional user',
    cases: [['Matches the tool\'s training norm', -0.07], ['Writes or speaks outside the training norm', 0.15], ['Has limited power to challenge an accusation', 0.2]],
    systemLabel: 'What the tool measures',
    systems: [['Opaque proxy sold as certainty', 0.2], ['Proxy score shown with limits', 0.08], ['Tool cannot make the final decision', -0.1]],
    safeguardLabel: 'Response to a flag',
    safeguards: [['User must prove innocence', 0], ['Human checks source evidence', -0.12], ['No adverse action without independent evidence', -0.24]]
  },
  10: {
    title: 'Run the threshold laboratory',
    caseLabel: 'Fictional student record',
    cases: [['Stable record with full context', -0.08], ['Caregiving or health disruption is missing from the score', 0.15], ['Long commute lowers attendance without lowering need', 0.18]],
    systemLabel: 'Cutoff rule',
    systems: [['Fixed maker default', 0.15], ['Lower cutoff only', 0.07], ['Flexible threshold with context review', -0.11]],
    safeguardLabel: 'Human review',
    safeguards: [['No review below the line', 0], ['Review close scores', -0.11], ['Review, student voice, and appeal', -0.23]]
  },
  11: {
    title: 'Compare patch and repair',
    caseLabel: 'Harm already documented',
    cases: [['Small isolated error', -0.06], ['Repeated group pattern', 0.14], ['Pattern plus no appeal', 0.2]],
    systemLabel: 'Response design',
    systems: [['Interface patch only', 0.16], ['Retrain and monitor', 0.06], ['Affected people share authority over redesign', -0.15]],
    safeguardLabel: 'Power after the fix',
    safeguards: [['Vendor keeps final control', 0], ['Independent oversight', -0.1], ['Community authority, appeal, and stop power', -0.22]]
  },
  12: {
    title: 'Stack accountability levers',
    caseLabel: 'Institutional condition',
    cases: [['Known problem with clear evidence', -0.04], ['Known problem but disputed responsibility', 0.12], ['People remain exposed while institutions delay', 0.2]],
    systemLabel: 'Primary lever',
    systems: [['Product fix only', 0.15], ['Institutional rule plus audit', 0.01], ['Law and rights protection with enforcement', -0.14]],
    safeguardLabel: 'Enforcement',
    safeguards: [['Voluntary compliance', 0], ['Independent monitoring', -0.1], ['Remedy, appeal, penalties, and public reporting', -0.22]]
  }
};
