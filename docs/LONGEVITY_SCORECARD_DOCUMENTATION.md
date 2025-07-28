# Health & Wealth Longevity Scorecard Documentation

## Overview
The Longevity Scorecard is a comprehensive assessment tool that evaluates whether a user's financial resources will last throughout their projected lifespan. It combines health span planning, inflation analysis, sequence of returns stress testing, and bucket strategy optimization.

## User Flow

### Step 1: Input Screen
**Purpose**: Gather essential user information for calculations

**Inputs Required**:
- Age (current)
- Current total assets
- Annual income
- Expected retirement age
- Annual spending needs in retirement
- Expected years of good health (healthspan)
- Projected lifespan
- Expected inflation rate (slider: 1-7%, default 3%)

**Validation**:
- All numeric fields must be positive
- Retirement age must be >= current age
- Lifespan must be >= retirement age
- Healthspan should be reasonable for retirement duration

### Step 2: Bucket Plan Integration
**Purpose**: Allocate assets across different time horizons

**Bucket Categories**:
1. **Income Now (Years 1-5)**: Conservative investments for immediate needs
2. **Income Later (Years 6-15)**: Moderate growth for medium-term income
3. **Growth (Years 16+)**: Growth investments for long-term wealth building
4. **Legacy**: Estate planning and family legacy preservation

**Allocation Rules**:
- Total must equal 100%
- Each bucket: 0-70% (Legacy max 30%)
- Visual feedback for recommended ranges
- Real-time dollar value calculations

### Step 3: Sequence of Returns Stress Test
**Purpose**: Model how poor early market returns affect portfolio longevity

**Scenarios Tested**:
- **Worst Case**: Poor early returns (15%, -8%, -12%, -5%, +3%, +7%, +6%, +8%)
- **Average Case**: Consistent 7% returns throughout retirement

**Calculations**:
- Annual inflation-adjusted withdrawals
- Portfolio depletion timeline
- Final portfolio values
- Shortfall/surplus analysis

**Visual Outputs**:
- Duration comparison chart
- Inflation impact on withdrawals
- Nominal vs. real purchasing power

### Step 4: Longevity Score Calculation
**Purpose**: Provide actionable assessment of financial longevity

**Scoring Factors** (0-100 scale):
- **Base Score**: 50 points
- **Money Duration vs Lifespan**: +30 points if worst case ≥ retirement years
- **Average Case Performance**: +20 points if ≥120% of retirement years
- **Healthspan Ratio**: +15 points if ≥80% of retirement years
- **Bucket Diversification**: +10 points for balanced allocation
- **Inflation Consideration**: +5 points for realistic assumptions (2-4%)

**Score Levels**:
- **Excellent (80-100)**: Green, money likely to last with legacy potential
- **Good (65-79)**: Blue, on track with some adjustments needed
- **Caution (50-64)**: Yellow, several areas need attention
- **High Risk (0-49)**: Red, significant changes required

## Feature Gating

### Free Users
- Complete scorecard access
- Basic recommendations
- Standard scenario analysis
- Email results option

### Premium Users
- PDF report download
- Advanced scenario modeling
- Monte Carlo analysis
- Editable return assumptions
- Priority advisor scheduling

## Analytics Tracking

### Events Tracked
1. **Scorecard Started**: `longevity_scorecard_start`
2. **Step Progression**: `longevity_scorecard_step`
3. **Score Calculated**: `longevity_scorecard_calculation`
4. **Report Downloaded**: `download_longevity_report` (Premium)
5. **Advisor Scheduled**: `schedule_consultation`
6. **Roadmap Requested**: `roadmap_request`

### Data Points Captured
- User demographics (age, assets)
- Input parameters (inflation rate, allocations)
- Score results (level, recommendations)
- Feature usage (premium vs free)
- Conversion actions (scheduling, roadmap)

## Technical Implementation

### Key Components
- `useLongevityScorecard`: Core calculation hook
- `LongevityInputForm`: Step 1 input collection
- `BucketVisualization`: Step 2 allocation display
- `ScenarioResults`: Step 3 stress test results
- `LongevityScoreDisplay`: Step 4 score and recommendations

### Calculation Engine
- **Inflation Compounding**: `Math.pow(1 + inflationRate, years)`
- **Portfolio Growth**: Annual returns with fee deduction
- **Sequence Risk**: Year-by-year portfolio tracking
- **Real vs Nominal**: Purchasing power calculations

### Data Flow
1. User inputs → State management
2. Bucket allocations → Validation
3. Scenario modeling → Results calculation
4. Score computation → Recommendations
5. Action triggers → Analytics tracking

## Integration Points

### Dashboard Integration
- Widget in main dashboard with quick access
- Health & Wealth section prominence
- Progress tracking for completion

### Navigation Links
- Health tab → Longevity planning
- Retirement tab → Comprehensive assessment
- Education tab → Learning resources

### CTA Placements
- **Primary**: "Take Longevity Scorecard" buttons
- **Secondary**: Widget tiles in relevant sections
- **Contextual**: Related calculator suggestions

## UX Guidelines

### Progressive Disclosure
- Start with basic inputs
- Reveal complexity gradually
- Clear explanations at 8th-grade level
- Contextual help and tooltips

### Mobile Optimization
- Responsive grid layouts
- Touch-friendly sliders
- Readable chart scaling
- Simplified navigation

### Visual Design
- Color-coded scoring system
- Progress indicators
- Trust badges and compliance
- Consistent brand elements

## Compliance & Legal

### Disclaimers
- Planning purposes only
- Actual outcomes may vary
- Not investment advice
- Professional consultation recommended

### Data Privacy
- No personal data storage without consent
- Analytics aggregation only
- Secure calculation processing
- Clear privacy policy links

## Testing Scenarios

### UAT Test Cases
1. **Happy Path**: Complete scorecard with balanced inputs
2. **Edge Cases**: Extreme age/asset values
3. **Validation**: Invalid input handling
4. **Premium Features**: Subscription-gated functionality
5. **Mobile Experience**: Touch interactions and responsiveness

### QA Checklist
- [ ] All input validations working
- [ ] Calculations mathematically correct
- [ ] Charts rendering properly
- [ ] Analytics firing correctly
- [ ] Premium gates functioning
- [ ] Mobile layout responsive
- [ ] Accessibility compliance
- [ ] Performance optimization

## Future Enhancements

### Phase 2 Features
- Healthcare cost modeling
- Long-term care integration
- Tax optimization scenarios
- Social Security planning
- Estate planning integration

### Advanced Analytics
- Machine learning recommendations
- Cohort benchmarking
- Predictive modeling
- Risk tolerance assessment

This documentation serves as the complete reference for the Longevity Scorecard feature, supporting development, testing, and user experience optimization.