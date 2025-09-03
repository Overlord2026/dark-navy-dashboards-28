# Advisor Wireframes and User Flows

## Overview
This document describes the wireframes and user interface flows for advisor personas using the BFO platform.

## Main Dashboard Wireframe

### Layout Structure
```
[Header: BFO Logo | Notifications | Profile Menu]
[Sub-navigation: Dashboard | Clients | Prospects | Reports | Tools]

[Key Metrics Row]
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total AUM   │ YTD Growth  │ New Clients │ Performance │
│ $125.5M     │ +12.3%      │ 18          │ +8.7%       │
└─────────────┴─────────────┴─────────────┴─────────────┘

[Main Content Area - 2 Column Layout]
┌──────────────────────────┬─────────────────────────┐
│ Client Activity Feed     │ Upcoming Events         │
├──────────────────────────┤                         │
│ • Johnson quarterly mtg  │ • Dec 15: Johnson Review│
│ • Chen document signed   │ • Dec 18: Prospect Call │
│ • Williams tax planning  │ • Dec 20: Team Meeting  │
│ • Foster initial consult │ • Dec 22: Compliance    │
├──────────────────────────┤                         │
│ Portfolio Alerts         │ Tasks & Follow-ups      │
├──────────────────────────┤                         │
│ ⚠ Large allocation shift │ □ Update investment     │
│ ⚠ Rebalancing needed     │   policy statements     │
│ ⚠ Cash position high     │ □ Prepare Q4 reports    │
│                          │ □ Schedule annual       │
│                          │   reviews               │
└──────────────────────────┴─────────────────────────┘

[Quick Actions Bar]
[New Client] [Schedule Meeting] [Generate Report] [Send Message]
```

## Client Management Interface

### Client List View
```
[Search/Filter Bar: Name | AUM Range | Risk Level | Last Contact]

[Client Data Table]
┌─────────────────┬─────────┬────────────┬─────────────┬─────────────┐
│ Client Name     │ AUM     │ Risk Level │ Last Contact│ Actions     │
├─────────────────┼─────────┼────────────┼─────────────┼─────────────┤
│ Johnson Family  │ $2.5M   │ Moderate   │ Nov 15      │ [View][Call]│
│ Chen Household  │ $4.2M   │ Aggressive │ Dec 1       │ [View][Call]│
│ Williams Trust  │ $12.5M  │ Conservative│ Oct 30      │ [View][Call]│
└─────────────────┴─────────┴────────────┴─────────────┴─────────────┘
```

### Individual Client Detail View
```
[Client Header: Photo | Name | Contact Info | Key Metrics]

[Tab Navigation: Overview | Portfolio | Planning | Documents | Notes]

[Portfolio Tab Content]
┌─────────────────────────┬─────────────────────────┐
│ Asset Allocation Chart  │ Performance Metrics     │
│                         │                         │
│     [Pie Chart]         │ YTD Return: +8.7%       │
│                         │ 3-Year Avg: +7.2%       │
│                         │ Risk Score: 6.5/10      │
│                         │ Sharpe Ratio: 1.24      │
├─────────────────────────┼─────────────────────────┤
│ Holdings Summary        │ Recent Transactions     │
│                         │                         │
│ • US Stocks: 65%        │ Dec 1: Dividend $2,450  │
│ • Intl Stocks: 20%      │ Nov 28: Rebalance       │
│ • Bonds: 10%            │ Nov 15: Contribution    │
│ • Cash: 5%              │         $10,000         │
└─────────────────────────┴─────────────────────────┘
```

## Prospect Pipeline Interface

### Pipeline Dashboard
```
[Pipeline Overview]
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Initial      │ Discovery    │ Proposal     │ Decision     │
│ Contact      │ Meeting      │ Sent         │ Stage        │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 8 prospects  │ 5 prospects  │ 3 prospects  │ 2 prospects  │
│ $12.5M est   │ $8.2M est    │ $4.1M est    │ $3.2M est    │
└──────────────┴──────────────┴──────────────┴──────────────┘

[Prospect Details - Kanban View]
┌─────────────────────────────────────────────────────────────┐
│ Initial Contact                                             │
├─────────────────────────────────────────────────────────────┤
│ [Dr. Amanda Foster]          [Tech Startup Founders]       │
│ Est. AUM: $850K             Est. AUM: $2.5M                │
│ Source: Referral            Source: Network                │
│ Next: Follow-up call        Next: Needs assessment         │
│ Probability: 75%            Probability: 60%               │
└─────────────────────────────────────────────────────────────┘
```

## Meeting Scheduler Interface

### Calendar View
```
[Calendar Header: Month/Week/Day Views | Today Button]

[Weekly View Example]
┌─────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│Time │ Mon     │ Tue     │ Wed     │ Thu     │ Fri     │ Sat     │
├─────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│9 AM │         │ Johnson │         │         │ Team    │         │
│     │         │ Review  │         │         │ Meeting │         │
├─────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│10AM │ Prospect│         │ Chen    │         │         │         │
│     │ Call    │         │ Tax Mtg │         │         │         │
├─────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│2PM  │         │         │         │ Williams│         │         │
│     │         │         │         │ Estate  │         │         │
└─────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

[Meeting Details Panel]
┌─────────────────────────────────────────────────────────────┐
│ Johnson Quarterly Review                                    │
│ Date: Dec 15, 2024 at 2:00 PM                             │
│ Duration: 90 minutes                                        │
│ Type: Client Review                                         │
│ Location: Virtual (Zoom)                                    │
│                                                             │
│ Agenda:                                                     │
│ • Portfolio performance review                              │
│ • 2025 tax planning strategies                             │
│ • College funding progress                                  │
│ • Insurance coverage review                                 │
│                                                             │
│ Participants:                                               │
│ • Michael Johnson (Client)                                  │
│ • Sarah Johnson (Client)                                    │
│ • Jennifer Rodriguez (Advisor)                              │
│                                                             │
│ [Edit Meeting] [Send Reminder] [Start Meeting]             │
└─────────────────────────────────────────────────────────────┘
```

## Reporting Interface

### Report Generation Dashboard
```
[Report Type Selection]
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Performance  │ Risk         │ Holdings     │ Tax          │
│ Reports      │ Analysis     │ Summary      │ Reports      │
│              │              │              │              │
│ • Quarterly  │ • Risk Metrics│ • Asset List │ • Realized   │
│ • Annual     │ • Stress Test │ • Allocation │   Gains/Loss │
│ • Custom     │ • Scenario    │ • Sector     │ • Tax Loss   │
│              │   Analysis    │   Analysis   │   Harvesting │
└──────────────┴──────────────┴──────────────┴──────────────┘

[Report Configuration Panel]
┌─────────────────────────────────────────────────────────────┐
│ Quarterly Performance Report                                │
│                                                             │
│ Client Selection: [Dropdown: All Clients ▼]                │
│ Date Range: [Oct 1, 2024] to [Dec 31, 2024]               │
│ Benchmark: [S&P 500 ▼]                                     │
│ Include Sections:                                           │
│ ☑ Executive Summary                                         │
│ ☑ Performance Attribution                                   │
│ ☑ Asset Allocation                                          │
│ ☑ Holdings Detail                                           │
│ ☑ Market Commentary                                         │
│                                                             │
│ Delivery Method:                                            │
│ ○ Email to Client                                           │
│ ○ Download PDF                                              │
│ ○ Print Hard Copy                                           │
│                                                             │
│ [Generate Report] [Save Template] [Cancel]                 │
└─────────────────────────────────────────────────────────────┘
```

## Mobile App Wireframes

### Mobile Dashboard
```
┌─────────────────────────┐
│ BFO      [🔔] [👤]      │
├─────────────────────────┤
│                         │
│ Good Morning, Jennifer  │
│                         │
│ Today's Summary         │
│ ┌─────────┬─────────┐   │
│ │ AUM     │ Clients │   │
│ │ $125.5M │   85    │   │
│ └─────────┴─────────┘   │
│                         │
│ Upcoming Today          │
│ • 10:00 AM - Johnson    │
│   Quarterly Review      │
│ • 2:00 PM - Prospect    │
│   Discovery Call        │
│                         │
│ Recent Activity         │
│ • Chen document signed  │
│ • Williams tax planning │
│ • Foster initial consult│
│                         │
│ Quick Actions           │
│ ┌─────────┬─────────┐   │
│ │Schedule │ New     │   │
│ │Meeting  │ Client  │   │
│ └─────────┴─────────┘   │
│                         │
│ [Dashboard][Clients]    │
│ [Calendar][Reports]     │
└─────────────────────────┘
```

## User Flow Examples

### New Client Onboarding Flow
1. **Lead Capture** → Prospect fills out initial interest form
2. **Qualification** → Advisor reviews and scores lead
3. **Initial Contact** → Phone/email outreach to schedule meeting
4. **Discovery Meeting** → In-person or virtual consultation
5. **Proposal Creation** → Investment policy statement and fee proposal
6. **Client Decision** → Proposal review and approval process
7. **Documentation** → Account opening and agreement signing
8. **Implementation** → Account funding and portfolio setup
9. **Follow-up** → Initial performance review and adjustment

### Portfolio Review Process
1. **Preparation** → Generate performance reports and analysis
2. **Client Communication** → Send pre-meeting materials
3. **Review Meeting** → Portfolio discussion and recommendations
4. **Action Items** → Document decisions and next steps
5. **Implementation** → Execute any agreed-upon changes
6. **Documentation** → Update client records and files
7. **Follow-up** → Confirm client satisfaction and schedule next review