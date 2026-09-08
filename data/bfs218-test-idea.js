/* Optional Week 2 exploration. Native disclosures only: no answers, scoring or storage. */
(function () {
  'use strict';
  var html = `
<section id="wk-test-idea" class="node bfs-test-idea" aria-labelledby="test-idea-title">
  <h2 id="test-idea-title" class="wk-sec">Test the idea</h2>
  <p class="wk-desc">Counterarguments and other explanations. Optional, ungraded, and nothing to submit.</p>
  <div class="ti-content">
    <div class="ti-question">
      <span class="ti-label">One question, several ways in</span>
      <h3>Could using the same automated hiring rule make decisions fairer?</h3>
      <p><strong>Imagine this:</strong> an employer plans to replace informal application reviews with software. Every applicant would be checked against the same published criteria. The employer hopes this will reduce favouritism.</p>
      <p class="ti-boundary">This is a fictional example, not a report about a real employer. We have not been given any results.</p>
    </div>
    <p class="ti-invitation">Open any card. You can keep all three open and compare them. You do not need to pick a side.</p>
    <div class="ti-map" role="group" aria-label="Three ways to examine the hiring proposal">
      <details class="ti-card">
        <summary><span class="ti-label">A case for it</span><span class="ti-card-title">What makes this convincing?</span></summary>
        <div class="ti-card-body">
          <p>A clear, job-related rule could leave less room for a recruiter's personal preferences. Published criteria could also make the process easier to question.</p>
          <p>That is a possible benefit, not proof that this particular system works.</p>
          <p><strong>Look again:</strong> what would the rule need to measure for this argument to be convincing? Could a person apply the same clear criteria without software?</p>
        </div>
      </details>
      <details class="ti-card">
        <summary><span class="ti-label">A challenge</span><span class="ti-card-title">What could the rule miss?</span></summary>
        <div class="ti-card-body">
          <p>Imagine that one criterion rewards an uninterrupted history of paid work. An applicant has a gap because they provided unpaid care, but can demonstrate the skills the job needs.</p>
          <p>Is the rule measuring ability to do the job, or something else? Could earlier discrimination shape who meets a seemingly neutral rule?</p>
          <p><strong>Challenge the challenge:</strong> what evidence would show whether this concern applies here? A possible problem is not proof that it happened.</p>
        </div>
      </details>
      <details class="ti-card">
        <summary><span class="ti-label">Evidence to examine</span><span class="ti-card-title">What would help you decide?</span></summary>
        <div class="ti-card-body">
          <p>Consider what you would want to know before supporting, changing or rejecting the proposal:</p>
          <ul>
            <li>What counts as a relevant job skill, and who chose the criteria?</li>
            <li>Who advances or is screened out compared with the current process?</li>
            <li>Do those results overlook differences within broad groups?</li>
            <li>Can applicants correct an error or question a decision?</li>
          </ul>
          <p><strong>Keep the question open:</strong> what findings would strengthen the employer's case? What findings would weaken it?</p>
          <p>You are considering evidence, not collecting anyone's private information or calculating statistics.</p>
        </div>
      </details>
    </div>
    <div class="ti-return">
      <span class="ti-label">Where do you stand for now?</span>
      <p>You might support the proposal with conditions, question it, suggest another approach, or remain unsure. What might change your mind?</p>
      <p>You can question a course explanation. Use reasons and evidence, and treat people with respect. Different positions do not automatically have equal support.</p>
    </div>
    <p class="ti-connection"><strong>Back to Week 2:</strong> use the distinction between intentions and outcomes to examine both the employer's promise and the criticism. Keep the New Jim Code in view as a question to investigate, not a label to apply without evidence.</p>
    <p class="ti-source"><strong>Optional background, not an assigned reading:</strong> <a href="https://arxiv.org/pdf/1906.09208" target="_blank" rel="noopener noreferrer">Raghavan, Barocas, Kleinberg and Levy, <cite>Mitigating Bias in Algorithmic Hiring: Evaluating Claims and Practices</cite> (2019 preprint, full PDF)</a>. The introduction on pages 1 to 2 examines promises, practices and limits. It does not report the fictional example above.</p>
  </div>
</section>`;
  window.BFS218_TEST_IDEA = Object.freeze({
    render: function (week) { return Number(week) === 2 ? html : ''; }
  });
}());
