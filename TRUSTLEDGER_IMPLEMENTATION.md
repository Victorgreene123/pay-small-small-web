# TrustLedger Implementation Plan

## Overview

TrustLedger pivots Pay Small Small into an AI-powered group payment platform with fraud detection. This document outlines the complete implementation strategy for the frontend, backend, AI, and Squad integration.

---

## Part 1: Frontend (Landing Page & UI)

### Completed ✅

- Premium landing page with 5 main sections:
  - **Hero:** AI-Verified tagline, CTAs, metrics
  - **How It Works:** 3-step process flow
  - **Features:** Asymmetric bento grid highlighting AI, fraud detection, verification, transparency
  - **Trust Explainer:** Interactive trust factors accordion + visualization
  - **CTA:** Final call-to-action with benefits checklist
  - **Footer:** Multi-column navigation

### Frontend Tech Stack

- **Framework:** Next.js 16.2.4 (App Router)
- **Components:** React 19 with `'use client'` where needed
- **Styling:** Tailwind CSS v4 (no v3 syntax)
- **Icons:** Lucide React
- **No external animation lib needed** – CSS transitions suffice for MVP

### File Structure

```
app/
  page.tsx                           # Main landing page entry
  layout.tsx                         # Global layout (existing)
components/
  landing/
    Landing.tsx                      # Main landing wrapper + footer
    Hero.tsx                         # Hero section
    HowItWorks.tsx                   # 3-step flow
    Features.tsx                     # Bento feature grid
    TrustExplainer.tsx               # Trust factors accordion
    CTA.tsx                          # Final CTA section
  [existing dashboard components]    # (preserve as-is)
```

### Design Decisions

- **Color Palette:** Navy (#0D1B2A), Green (#22C55E), Light (#F4F8FF), Slate neutrals
- **Typography:** Bold, strong hierarchy (H1: 5xl–7xl, body: base with +line-height)
- **Layout:** Asymmetric grids (not 3-equal-columns), max-width 7xl containers
- **Spacing:** Generous vertical padding (py-20 to py-32), section gaps 6–12
- **No Glassmorphism:** Avoided in MVP; simple clean design with soft shadows

### Testing Checklist

- [ ] Responsive at sm (640px), md (768px), lg (1024px) breakpoints
- [ ] Hero section visible without layout shift
- [ ] Features grid collapses to single column on mobile
- [ ] All links route correctly
- [ ] Images/icons load without 404s
- [ ] No console errors

---

## Part 2: Backend Architecture

### Key Endpoints to Build

| Endpoint                    | Method | Purpose                                             |
| --------------------------- | ------ | --------------------------------------------------- |
| `POST /campaigns`           | POST   | Create new campaign (runs initial trust score)      |
| `GET /campaigns/:id`        | GET    | View campaign details + trust score                 |
| `POST /campaigns/:id/join`  | POST   | Participant fills form, initiates payment via Squad |
| `GET /campaigns/:id/status` | GET    | Poll campaign status (contributions, remaining)     |
| `POST /trust-score/:id`     | POST   | (Internal) Compute/recompute trust score            |
| `POST /transfers`           | POST   | Disburse funds via Squad Transfer API               |
| `POST /webhook/squad`       | POST   | Squad payment webhook callback                      |

### Database Schema (Prisma)

```prisma
model Campaign {
  id              String        @id @default(cuid())
  title           String
  totalAmount     Int           // in kobo
  slots           Int
  creatorId       String
  createdAt       DateTime      @default(now())

  // NEW: Trust & verification
  trustScore      Float         @default(0.0)    // 0–100
  riskFlag        Boolean       @default(false)
  formData        Json?         // KYC/verification form responses

  participants    Participant[]
  transactions    Transaction[]
}

model Participant {
  id              String        @id @default(cuid())
  campaignId      String
  userId          String?
  email           String?
  amountPaid      Int           @default(0)

  // NEW: Participant-level trust
  status          String        // PENDING, PAID, FLAGGED
  trustScore      Float         @default(0.0)
  createdAt       DateTime      @default(now())
}

model Transaction {
  id                    String    @id @default(cuid())
  campaignId            String
  participantId         String
  squadTransactionRef   String    @unique
  amount                Int
  status                String    // PENDING, SUCCESS, FAILED
  createdAt             DateTime  @default(now())
}
```

---

## Part 3: AI Trust-Scoring Engine

### Architecture: Hybrid Rule-Based + ML/LLM

#### Features (Input Signals)

For **Campaign**:

- Account age (days since signup)
- Number of past campaigns
- Payment completion rate (% successful)
- BVN/KYC verification status
- Time to first payment (after campaign creation)
- Contribution size variance (std deviation)
- Duplicate account detection

For **Participant**:

- Account age
- Number of prior contributions
- Data consistency (typos, inconsistencies)
- Device/IP anomalies (optional, privacy-aware)

#### Scoring Logic (Pseudocode)

```typescript
async function computeTrustScore(
  campaignId: string,
  creatorId: string,
): Promise<{ score: number; riskFlag: boolean; reason: string }> {
  // 1. Gather features
  const creator = await getUser(creatorId);
  const campaign = await getCampaign(campaignId);
  const history = await getUserCampaignHistory(creatorId);

  // 2. Rule-based checks
  let baseScore = 50;

  // Account age: <7 days -30 pts, 7–30 days -15 pts, >30 days +10 pts
  if (creator.accountAgeDays < 7) baseScore -= 30;
  else if (creator.accountAgeDays < 30) baseScore -= 15;
  else baseScore += 10;

  // BVN verified +25 pts
  if (creator.bvnVerified) baseScore += 25;

  // Past campaigns: each successful +5 pts (capped at +20)
  baseScore += Math.min(history.successfulCampaigns * 5, 20);

  // Payment history: >80% completion +15 pts
  if (history.completionRate > 0.8) baseScore += 15;

  // 3. ML/LLM scoring (optional layer)
  const features = {
    accountAge: creator.accountAgeDays,
    bvnVerified: creator.bvnVerified,
    successfulCampaigns: history.successfulCampaigns,
    completionRate: history.completionRate,
    campaignAmount: campaign.totalAmount,
  };

  // For demo, use LLM or rule-based multiplier
  // In production, use trained model (logistic regression, RF, etc.)
  const mlAdjustment = await predictTrustMultiplier(features); // -20 to +20

  let finalScore = Math.min(100, Math.max(0, baseScore + mlAdjustment));

  // 4. Flag if risk
  const riskFlag = finalScore < 40;

  // 5. Reason
  let reason = `Base score: ${baseScore}. `;
  if (creator.accountAgeDays < 7) reason += "New account. ";
  if (!creator.bvnVerified) reason += "Not BVN-verified. ";
  if (history.completionRate < 0.6) reason += "Low past completion rate. ";
  if (riskFlag) reason += "Flagged for manual review.";

  return { score: finalScore, riskFlag, reason };
}
```

#### LLM Fallback (GPT-4 Prompt)

```json
{
  "prompt": "Given this user campaign and payment history, is it low or high risk? Return JSON: {\"score\": 0-100, \"risk_level\": \"low|medium|high\", \"reason\": \"...\"}",
  "context": {
    "creator": { "accountAgeDays": 45, "bvnVerified": true, ... },
    "history": { "successfulCampaigns": 8, "completionRate": 0.95, ... }
  }
}
```

### Anomaly Detection (Per Payment)

```typescript
async function detectPaymentAnomalies(
  campaignId: string,
  participantId: string,
  amount: number
): Promise<{ isAnomalous: boolean; reason?: string }> {

  const campaign = await getCampaign(campaignId);
  const participant = await getParticipant(participantId);
  const recentPayments = await getParticipantPaymentHistory(participantId, limit: 10);

  // Anomaly checks
  const checks = [
    // 1. Unusual amount (>3σ from mean)
    {
      test: amount > mean(recentPayments.amounts) + 3 * stdDev(recentPayments.amounts),
      reason: "Unusual payment amount"
    },
    // 2. Rapid repeated payments (>2 in <1 hour)
    {
      test: recentPayments.filter(p => p.createdAt > now - 1h).length > 2,
      reason: "Multiple payments in short time (possible duplicate/fraud)"
    },
    // 3. New participant, new account, large amount (>5x typical slot)
    {
      test: participant.accountAgeDays < 7 &&
            amount > campaign.totalAmount / campaign.slots * 5,
      reason: "New account paying unusually large amount"
    },
  ];

  const anomalies = checks.filter(c => c.test);

  return {
    isAnomalous: anomalies.length > 0,
    reason: anomalies.map(a => a.reason).join("; ")
  };
}
```

---

## Part 4: Squad API Integration

### Initiate Payment

```typescript
async function initiateSquadPayment(
  participantEmail: string,
  campaignId: string,
  amount: number,
) {
  const response = await fetch(
    "https://sandbox-api-d.squadco.com/transaction/initiate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount, // in kobo
        email: participantEmail,
        currency: "NGN",
        transaction_ref: `camp-${campaignId}-${Date.now()}`,
        payment_channels: ["card", "bank", "ussd"],
      }),
    },
  );

  const data = await response.json();
  return data.data.checkout_url; // Return to frontend for modal
}
```

### Verify Transaction

```typescript
async function verifySquadTransaction(transactionRef: string) {
  const response = await fetch(
    `https://sandbox-api-d.squadco.com/transaction/verify/${transactionRef}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
      },
    },
  );

  const data = await response.json();
  return {
    status: data.data.transaction_status, // 'Success' or 'Failed'
    amount: data.data.amount,
    // ... other fields
  };
}
```

### Transfer (Payout)

```typescript
async function transferFunds(
  recipientName: string,
  recipientAccountNumber: string,
  recipientBankCode: string,
  amount: number,
  campaignId: string,
) {
  const response = await fetch(
    "https://sandbox-api-d.squadco.com/payout/transfer",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bank_code: recipientBankCode,
        account_number: recipientAccountNumber,
        account_name: recipientName,
        amount: amount, // in kobo
        transaction_reference: `payout-${campaignId}-${Date.now()}`,
        remark: `Campaign ${campaignId} payout`,
        currency_id: "NGN",
      }),
    },
  );

  const data = await response.json();
  return {
    success: data.success,
    nipTransactionRef: data.data?.nip_transaction_reference,
  };
}
```

### Webhook Handler

```typescript
export async function POST(req: Request) {
  const body = await req.json();

  // Squad sends: { transaction_ref, transaction_status, amount, ... }
  const { transaction_ref, transaction_status } = body;

  // 1. Verify webhook signature (Squad headers)
  // ... validation logic ...

  // 2. Find the transaction in DB
  const transaction = await db.transaction.findUnique({
    where: { squadTransactionRef: transaction_ref },
  });

  if (!transaction) return new Response("Not found", { status: 404 });

  // 3. Update transaction status
  await db.transaction.update({
    where: { id: transaction.id },
    data: { status: transaction_status === "Success" ? "SUCCESS" : "FAILED" },
  });

  // 4. If successful, recalculate campaign trust score
  if (transaction_status === "Success") {
    const campaign = await db.campaign.findUnique({
      where: { id: transaction.campaignId },
    });
    const updatedScore = await computeTrustScore(
      campaign.id,
      campaign.creatorId,
    );
    await db.campaign.update({
      where: { id: campaign.id },
      data: { trustScore: updatedScore.score, riskFlag: updatedScore.riskFlag },
    });
  }

  return new Response("OK", { status: 200 });
}
```

---

## Part 5: Implementation Timeline (24-hour hackathon sprint)

| Phase                     | Tasks                                         | Duration | Dependencies |
| ------------------------- | --------------------------------------------- | -------- | ------------ |
| **1. Setup**              | DB schema migration, Squad API keys config    | 1h       | None         |
| **2. Campaign CRUD**      | Create/join endpoints, form handling          | 2h       | Phase 1      |
| **3. Trust Scoring**      | Rule engine + LLM fallback, anomaly detection | 3h       | Phase 1      |
| **4. Squad Integration**  | Initiate, verify, transfer endpoints          | 3h       | Phase 2      |
| **5. Webhooks**           | Payment callback handler, status updates      | 1.5h     | Phase 4      |
| **6. Frontend Dashboard** | Campaign list, join form, payout UI           | 3h       | Phase 2      |
| **7. Polish & Testing**   | E2E flows, error handling, docs               | 2h       | All phases   |
| **Buffer**                | Debugging, unexpected issues                  | 3.5h     | All phases   |
| **TOTAL**                 | **~24 hours**                                 | —        | —            |

---

## Part 6: Demo Flow Script

### Scenario: Alice Creates a Campaign

1. **Alice logs in** → navigates to Dashboard
2. **Creates campaign:** Title: "Trip Fund", Amount: ₦50,000, Slots: 5
3. **System computes trust score:** "Trust Score: 78% – Verified" (based on her 30-day-old account, no prior campaigns)
4. **Alice shares link** via WhatsApp, etc.

### Scenario: Bob Joins

1. **Bob opens link** → sees campaign + Alice's trust score
2. **Bob fills form:** Name, Email, Phone
3. **Bob clicks "Pay My Share"** → Squad modal opens
4. **Bob pays ₦10,000** using test card
5. **Squad webhook fires** → system verifies payment, marks Bob as PAID
6. **UI updates in real-time** (or via polling): "1/5 slots filled"

### Scenario: Campaign Completed

1. **Enough payments collected** (e.g., 4/5 slots)
2. **Alice clicks "Payout"** → enters bank details
3. **System verifies account** via Squad Account Lookup
4. **Calls Squad Transfer API** → ₦40,000 moves to Alice's account
5. **Campaign marked "Completed"**
6. **Log entry:** "Payout successful on 2026-05-15"

### Emphasis During Demo

- "**Real-time trust scoring** prevents fraud before money moves."
- "**Squad integration** ensures every payment is verified."
- "**Transparency** – participants see exactly what's happening."

---

## Part 7: Security & Compliance

### Auth & Secrets

- Use JWTs with 1-hour expiry, refresh tokens for long-lived sessions
- Store Squad API keys in environment variables (never hardcoded)
- All endpoints require `Authorization: Bearer <token>`

### Data Protection

- Hash sensitive PII (BVN, ID numbers) using bcrypt + salt
- Encrypt fields at rest (if database supports it)
- Comply with CBN guidelines: only request KYC when necessary
- Use HTTPS everywhere

### Input Validation

- Sanitize campaign titles, numeric fields
- Validate email format, phone numbers
- Use Prisma strong typing to prevent injection

### Audit Logging

- Log every Squad API call (request + response)
- Log trust score computations (features + result)
- Log payment successes/failures
- Log payout transactions

### Bias Mitigation

- Trust model uses only behavioral/transaction data—no protected attributes
- No demographic-based rules (age, location, etc. only used for legitimate fraud signals)
- Explainability: Always show why a campaign is flagged

---

## Part 8: Production Readiness Checklist

- [ ] Database backups configured
- [ ] Squad API keys rotated regularly
- [ ] HTTPS/SSL on all endpoints
- [ ] Rate limiting on public endpoints
- [ ] Monitoring/alerting set up (errors, failed payments, high-risk flags)
- [ ] Documentation complete (API reference, deployment guide)
- [ ] Load testing (simulate 1000 concurrent users)
- [ ] Security audit (OWASP Top 10)
- [ ] Compliance review (CBN, GDPR, data protection)

---

## References

- Squad API Docs: https://docs.squadco.com/
- Prisma ORM: https://www.prisma.io/
- Next.js 16 Docs: https://nextjs.org/docs
- Fraud Detection Best Practices: https://www.signifyd.com/blog/

---

**Version:** 1.0  
**Last Updated:** May 15, 2026  
**Status:** Ready for hackathon sprint
