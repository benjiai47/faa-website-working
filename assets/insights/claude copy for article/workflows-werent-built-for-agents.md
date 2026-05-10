# Your Workflows Weren't Built for Agents

**By Ben DeMichael, Founder & Managing Partner, Foundation AI Advisory**

On a recent engagement at a manufacturer, a quality inspector pulled the master engineering drawing for a part already in production. The critical dimension — the one that determined whether the product met customer spec — was partially obscured by a coffee stain. The drawing had been like that for years. Operators had been working around it. They knew what the dimension was supposed to be. The document was unusable. The workflow ran on human memory and tribal knowledge.

Now imagine handing that workflow to an agent.

This is the moment most agent deployments are heading toward, and most executives don't see it coming. The pilot looks clean on the slide. The workflow is documented. The data is "available." The agent is configured. Then it runs against the actual operation, and the actual operation looks nothing like the document.

## The Core Claim

Documented workflows and actual workflows are two different things.

Agents follow what's written. Humans follow what works. The delta between the two is where most agent deployments fall flat.

Every workflow inside an established operation has a documented version — the version captured in SOPs, ERP screens, process maps, and onboarding decks — and an actual version, which is the workflow as it runs today. The two diverge over time. Humans absorb the divergence. They translate ambiguity, fill missing fields from memory, route around broken handoffs, and apply judgment at the seams where the system breaks down.

Hand that workflow to an agent and the absorption layer disappears. The agent executes the documented version with perfect fidelity. The dysfunction the humans were quietly carrying now runs at machine speed, in production, against customers.

## Quote-to-Order Looks Simple. It Isn't.

Documented flow: customer ask → sales engineer enters specs → engineering reviews → quote generated.

Actual flow: customer ask → sales engineer mentally translates an ambiguous request into producible specs, often walking out to the floor or pinging production informally to confirm what the plant can actually run, before anything enters the system. The engineer is doing three jobs at once — interpreting the customer, validating manufacturability, and applying tribal knowledge about which configurations carry hidden cost.

Drop an agent into the documented flow and it generates a quote for something the plant can't produce on the lead time committed. Or it quotes at a margin that looked clean on paper and erodes the moment the work hits the floor. The translation layer was never written down. It lived in the engineer's head. The agent doesn't have that head.

Operational consequence: rework, expedited freight, customer escalations, margin compression that nobody can trace back to the quote. The numbers move in the wrong direction and the root cause is invisible.

## Production Scheduling Is Mostly Override

Documented flow: the MRP system generates the schedule from demand, capacity, and lead times.

Actual flow: the scheduler overrides MRP daily. Machine 4 runs hot on Wednesdays. The new operator hasn't been cleared on the heavier tooling. Supplier B confirmed the date but is actually two weeks behind, which the buyer knows but never updated in the system. A long-tenured customer always gets bumped to the front of the line. Production runs on the scheduler's instincts, refined over years.

Hand that scheduling decision to an agent and it re-optimizes against the documented constraints. The output is theoretically efficient and operationally broken. The plant misses ship dates. Customers escalate. The scheduler ends up overriding the agent the same way they override the MRP, and the agent's value evaporates.

Operational consequence: cycle time stretches, on-time delivery drops, the planning team loses trust in the system, and the investment that was supposed to remove human dependence increases it.

## The Change Order Nobody Wrote Down

Documented flow: change identified → project manager submits change order → general contractor approves in writing → work proceeds → invoice follows.

Actual flow: foreman identifies the change on-site → calls the GC → gets verbal approval → does the work → paperwork catches up two weeks later, sometimes never. Entire categories of work run this way because written approval is slower than the work needs to move. Cash flow depends on the verbal-first model.

Put an agent in the middle of that workflow and it does one of two things. Either it blocks the work waiting for written approval the foreman is never going to get on the timeline required, in which case the project stalls and the relationship with the GC starts to fray. Or it approves the wrong scope because the verbal context never reached it, and the contractor performs work that won't be paid for.

Operational consequence: cash flow slows, rework climbs, trust with the GC erodes, and margin compresses on the exact projects the firm was trying to scale.

## Why This Happens

Workflows in mature operations were not designed. They evolved. Each generation of operators inherited a system that mostly worked, found the places it didn't, and built quiet workarounds. The workarounds became the workflow. The documented version became a fossil — accurate when written, slowly diverging ever since.

The hidden human layer isn't in the SOPs. It's in the heads of the people who have been there long enough to remember why the system behaves the way it does. They translate. They reconcile. They make judgment calls at the seams where the system breaks down. Most of the time, they don't even notice they're doing it. It's just work.

Agents reveal that layer the same way a coffee stain reveals what the document actually says — by exposing exactly which part of the workflow was depending on something the document never captured. The agent doesn't perform worse than the human. It performs the documented workflow exactly. The gap between documented and actual is the gap between the pilot deck and the production result.

## What Right Looks Like

The sequence matters. Reverse it and the investment doesn't return.

First, Data Curation & Governance. Inputs to the workflow need to be clean enough, structured enough, and governed enough that the agent isn't making decisions on stale, conflicting, or missing data. Perfect data is not the bar. Usable data is. If the master engineering drawing is the system of record and the master drawing is illegible, no agent downstream will save the workflow.

Second, [LINK: Workflow Optimization → FAA Workflow Optimization page]. Reconcile the documented workflow against the actual one. Surface the workarounds. Separate the workarounds that are dysfunction to remove from the ones that are real intelligence to preserve and codify. Define ownership at every handoff. Define controls at every decision point. The workflow that comes out the other side is the one an agent can actually run.

Third, AI Design & Implementation. Deploy the agent where the workflow is now stable, the data is now reliable, and the outcome is measurable. Human-in-the-loop on decisions, exceptions, financial impact, customer commitments, and anything that touches compliance. Automation without accountability is a liability, not a capability.

Done in this order, the work moves margin, throughput, cycle time, cash flow, risk exposure, and visibility — the outcomes that matter. Done in the wrong order, the investment scales the dysfunction.

## The Right Question

The executive question is not "can we deploy an agent in this workflow?" The agent will deploy. The vendor will configure it. The pilot will run.

The right question is whether the operation knows what the workflow actually is. Not the documented version. The actual one. The one with the coffee stain. The one the scheduler overrides every morning. The one the foreman runs by phone. Until that workflow is understood, reconciled, and made fit for an agent, the deployment is a bet on the document — and the document is rarely current.

This is why we start every engagement with a [LINK: Business Systems Assessment → FAA Business Systems Assessment page]. Not to find the workflows ready for AI. To find the ones that aren't yet, and the work that has to come first.

Agents don't fix operations. They reveal them.

---

# Byline

Ben DeMichael, Founder & Managing Partner, Foundation AI Advisory

---

# SEO Meta Description

Most agent deployments fall flat because workflows weren't built for them. The gap between documented and actual work is where AI exposes operational debt.

---

# Alternate Title Options

1. Agents Reveal Operations. They Don't Fix Them.
2. The Workflow Behind the Workflow: Why Agent Deployments Fall Flat
3. Your Agent Will Run the Document. The Document Is Wrong.

---

# Two-Sentence Summary (Insights Index Card)

Documented workflows and actual workflows are two different things. Hand an agent the documented version and it executes the dysfunction at machine speed — which is why most deployments fall flat before they produce a measurable outcome.
