/**
 * Long-Term Care Cost Database
 * State-by-state costs with gender-specific adjustments and care type variations
 */

export type CareType = 'nursing_home' | 'assisted_living' | 'home_health' | 'adult_day_care';
export type USState = string; // Using string for flexibility

export interface LTCCostData {
  state: string;
  stateCode: string;
  costs: {
    nursing_home: {
      private_room: number;
      semi_private_room: number;
    };
    assisted_living: number;
    home_health: number;
    adult_day_care: number;
  };
  // Regional adjustment factors
  costOfLivingIndex: number;
  avgCareLength: {
    male: number;
    female: number;
  };
}

export const LTC_COST_DATABASE: Record<string, LTCCostData> = {
  'AL': {
    state: 'Alabama',
    stateCode: 'AL',
    costs: {
      nursing_home: { private_room: 88695, semi_private_room: 80300 },
      assisted_living: 42000,
      home_health: 61776,
      adult_day_care: 14560
    },
    costOfLivingIndex: 0.89,
    avgCareLength: { male: 2.2, female: 3.7 }
  },
  'AK': {
    state: 'Alaska',
    stateCode: 'AK',
    costs: {
      nursing_home: { private_room: 350445, semi_private_room: 292500 },
      assisted_living: 75600,
      home_health: 69784,
      adult_day_care: 17680
    },
    costOfLivingIndex: 1.25,
    avgCareLength: { male: 1.8, female: 3.2 }
  },
  'AZ': {
    state: 'Arizona',
    stateCode: 'AZ',
    costs: {
      nursing_home: { private_room: 95550, semi_private_room: 87600 },
      assisted_living: 49200,
      home_health: 63648,
      adult_day_care: 19500
    },
    costOfLivingIndex: 1.02,
    avgCareLength: { male: 2.3, female: 3.5 }
  },
  'AR': {
    state: 'Arkansas',
    stateCode: 'AR',
    costs: {
      nursing_home: { private_room: 81030, semi_private_room: 72270 },
      assisted_living: 39600,
      home_health: 54912,
      adult_day_care: 13000
    },
    costOfLivingIndex: 0.86,
    avgCareLength: { male: 2.1, female: 3.8 }
  },
  'CA': {
    state: 'California',
    stateCode: 'CA',
    costs: {
      nursing_home: { private_room: 136875, semi_private_room: 114975 },
      assisted_living: 64800,
      home_health: 71760,
      adult_day_care: 22100
    },
    costOfLivingIndex: 1.38,
    avgCareLength: { male: 2.4, female: 3.4 }
  },
  'CO': {
    state: 'Colorado',
    stateCode: 'CO',
    costs: {
      nursing_home: { private_room: 108405, semi_private_room: 95550 },
      assisted_living: 60000,
      home_health: 65520,
      adult_day_care: 18200
    },
    costOfLivingIndex: 1.12,
    avgCareLength: { male: 2.2, female: 3.3 }
  },
  'CT': {
    state: 'Connecticut',
    stateCode: 'CT',
    costs: {
      nursing_home: { private_room: 150330, semi_private_room: 133215 },
      assisted_living: 70800,
      home_health: 67392,
      adult_day_care: 18850
    },
    costOfLivingIndex: 1.19,
    avgCareLength: { male: 2.5, female: 3.6 }
  },
  'DE': {
    state: 'Delaware',
    stateCode: 'DE',
    costs: {
      nursing_home: { private_room: 131025, semi_private_room: 117885 },
      assisted_living: 56400,
      home_health: 62400,
      adult_day_care: 16250
    },
    costOfLivingIndex: 1.06,
    avgCareLength: { male: 2.3, female: 3.4 }
  },
  'FL': {
    state: 'Florida',
    stateCode: 'FL',
    costs: {
      nursing_home: { private_room: 108405, semi_private_room: 95550 },
      assisted_living: 51600,
      home_health: 58344,
      adult_day_care: 17550
    },
    costOfLivingIndex: 1.02,
    avgCareLength: { male: 2.4, female: 3.5 }
  },
  'GA': {
    state: 'Georgia',
    stateCode: 'GA',
    costs: {
      nursing_home: { private_room: 89790, semi_private_room: 80300 },
      assisted_living: 42000,
      home_health: 54912,
      adult_day_care: 15600
    },
    costOfLivingIndex: 0.92,
    avgCareLength: { male: 2.1, female: 3.7 }
  },
  'HI': {
    state: 'Hawaii',
    stateCode: 'HI',
    costs: {
      nursing_home: { private_room: 136875, semi_private_room: 120450 },
      assisted_living: 72000,
      home_health: 71760,
      adult_day_care: 25350
    },
    costOfLivingIndex: 1.35,
    avgCareLength: { male: 2.0, female: 3.1 }
  },
  'ID': {
    state: 'Idaho',
    stateCode: 'ID',
    costs: {
      nursing_home: { private_room: 93455, semi_private_room: 82125 },
      assisted_living: 45600,
      home_health: 58344,
      adult_day_care: 15080
    },
    costOfLivingIndex: 0.95,
    avgCareLength: { male: 2.0, female: 3.4 }
  },
  'IL': {
    state: 'Illinois',
    stateCode: 'IL',
    costs: {
      nursing_home: { private_room: 89790, semi_private_room: 75555 },
      assisted_living: 56400,
      home_health: 63648,
      adult_day_care: 18850
    },
    costOfLivingIndex: 1.05,
    avgCareLength: { male: 2.3, female: 3.5 }
  },
  'IN': {
    state: 'Indiana',
    stateCode: 'IN',
    costs: {
      nursing_home: { private_room: 91885, semi_private_room: 79565 },
      assisted_living: 48000,
      home_health: 58344,
      adult_day_care: 16900
    },
    costOfLivingIndex: 0.91,
    avgCareLength: { male: 2.2, female: 3.6 }
  },
  'IA': {
    state: 'Iowa',
    stateCode: 'IA',
    costs: {
      nursing_home: { private_room: 74460, semi_private_room: 66795 },
      assisted_living: 42000,
      home_health: 58344,
      adult_day_care: 15600
    },
    costOfLivingIndex: 0.88,
    avgCareLength: { male: 2.1, female: 3.8 }
  },
  'KS': {
    state: 'Kansas',
    stateCode: 'KS',
    costs: {
      nursing_home: { private_room: 78555, semi_private_room: 70810 },
      assisted_living: 45600,
      home_health: 58344,
      adult_day_care: 15600
    },
    costOfLivingIndex: 0.87,
    avgCareLength: { male: 2.0, female: 3.7 }
  },
  'KY': {
    state: 'Kentucky',
    stateCode: 'KY',
    costs: {
      nursing_home: { private_room: 93455, semi_private_room: 83220 },
      assisted_living: 44400,
      home_health: 54912,
      adult_day_care: 14560
    },
    costOfLivingIndex: 0.90,
    avgCareLength: { male: 2.2, female: 3.8 }
  },
  'LA': {
    state: 'Louisiana',
    stateCode: 'LA',
    costs: {
      nursing_home: { private_room: 80665, semi_private_room: 70810 },
      assisted_living: 42000,
      home_health: 50544,
      adult_day_care: 13650
    },
    costOfLivingIndex: 0.89,
    avgCareLength: { male: 2.0, female: 3.9 }
  },
  'ME': {
    state: 'Maine',
    stateCode: 'ME',
    costs: {
      nursing_home: { private_room: 120815, semi_private_room: 106770 },
      assisted_living: 62400,
      home_health: 60216,
      adult_day_care: 16900
    },
    costOfLivingIndex: 1.08,
    avgCareLength: { male: 2.4, female: 3.5 }
  },
  'MD': {
    state: 'Maryland',
    stateCode: 'MD',
    costs: {
      nursing_home: { private_room: 129295, semi_private_room: 108405 },
      assisted_living: 62400,
      home_health: 62400,
      adult_day_care: 19500
    },
    costOfLivingIndex: 1.15,
    avgCareLength: { male: 2.3, female: 3.4 }
  },
  'MA': {
    state: 'Massachusetts',
    stateCode: 'MA',
    costs: {
      nursing_home: { private_room: 158595, semi_private_room: 136875 },
      assisted_living: 73200,
      home_health: 67392,
      adult_day_care: 20800
    },
    costOfLivingIndex: 1.25,
    avgCareLength: { male: 2.5, female: 3.6 }
  },
  'MI': {
    state: 'Michigan',
    stateCode: 'MI',
    costs: {
      nursing_home: { private_room: 102690, semi_private_room: 87235 },
      assisted_living: 50400,
      home_health: 60216,
      adult_day_care: 18200
    },
    costOfLivingIndex: 0.96,
    avgCareLength: { male: 2.2, female: 3.5 }
  },
  'MN': {
    state: 'Minnesota',
    stateCode: 'MN',
    costs: {
      nursing_home: { private_room: 124215, semi_private_room: 102690 },
      assisted_living: 60000,
      home_health: 65520,
      adult_day_care: 19500
    },
    costOfLivingIndex: 1.08,
    avgCareLength: { male: 2.1, female: 3.4 }
  },
  'MS': {
    state: 'Mississippi',
    stateCode: 'MS',
    costs: {
      nursing_home: { private_room: 81030, semi_private_room: 72270 },
      assisted_living: 39600,
      home_health: 50544,
      adult_day_care: 12350
    },
    costOfLivingIndex: 0.85,
    avgCareLength: { male: 2.0, female: 3.9 }
  },
  'MO': {
    state: 'Missouri',
    stateCode: 'MO',
    costs: {
      nursing_home: { private_room: 74460, semi_private_room: 63875 },
      assisted_living: 42000,
      home_health: 56160,
      adult_day_care: 15600
    },
    costOfLivingIndex: 0.89,
    avgCareLength: { male: 2.1, female: 3.7 }
  },
  'MT': {
    state: 'Montana',
    stateCode: 'MT',
    costs: {
      nursing_home: { private_room: 89790, semi_private_room: 77285 },
      assisted_living: 48000,
      home_health: 60216,
      adult_day_care: 16250
    },
    costOfLivingIndex: 0.98,
    avgCareLength: { male: 2.0, female: 3.3 }
  },
  'NE': {
    state: 'Nebraska',
    stateCode: 'NE',
    costs: {
      nursing_home: { private_room: 78920, semi_private_room: 70810 },
      assisted_living: 45600,
      home_health: 56160,
      adult_day_care: 15600
    },
    costOfLivingIndex: 0.90,
    avgCareLength: { male: 2.0, female: 3.6 }
  },
  'NV': {
    state: 'Nevada',
    stateCode: 'NV',
    costs: {
      nursing_home: { private_room: 104420, semi_private_room: 89790 },
      assisted_living: 49200,
      home_health: 60216,
      adult_day_care: 17550
    },
    costOfLivingIndex: 1.04,
    avgCareLength: { male: 2.1, female: 3.3 }
  },
  'NH': {
    state: 'New Hampshire',
    stateCode: 'NH',
    costs: {
      nursing_home: { private_room: 133950, semi_private_room: 117885 },
      assisted_living: 68400,
      home_health: 62400,
      adult_day_care: 18850
    },
    costOfLivingIndex: 1.12,
    avgCareLength: { male: 2.3, female: 3.4 }
  },
  'NJ': {
    state: 'New Jersey',
    stateCode: 'NJ',
    costs: {
      nursing_home: { private_room: 146000, semi_private_room: 131025 },
      assisted_living: 72000,
      home_health: 65520,
      adult_day_care: 22100
    },
    costOfLivingIndex: 1.18,
    avgCareLength: { male: 2.4, female: 3.5 }
  },
  'NM': {
    state: 'New Mexico',
    stateCode: 'NM',
    costs: {
      nursing_home: { private_room: 95915, semi_private_room: 82855 },
      assisted_living: 44400,
      home_health: 56160,
      adult_day_care: 15080
    },
    costOfLivingIndex: 0.94,
    avgCareLength: { male: 2.0, female: 3.4 }
  },
  'NY': {
    state: 'New York',
    stateCode: 'NY',
    costs: {
      nursing_home: { private_room: 158595, semi_private_room: 136875 },
      assisted_living: 70800,
      home_health: 69784,
      adult_day_care: 24700
    },
    costOfLivingIndex: 1.28,
    avgCareLength: { male: 2.5, female: 3.6 }
  },
  'NC': {
    state: 'North Carolina',
    stateCode: 'NC',
    costs: {
      nursing_home: { private_room: 102690, semi_private_room: 89425 },
      assisted_living: 50400,
      home_health: 52728,
      adult_day_care: 16900
    },
    costOfLivingIndex: 0.96,
    avgCareLength: { male: 2.2, female: 3.6 }
  },
  'ND': {
    state: 'North Dakota',
    stateCode: 'ND',
    costs: {
      nursing_home: { private_room: 108770, semi_private_room: 91885 },
      assisted_living: 48000,
      home_health: 67392,
      adult_day_care: 16900
    },
    costOfLivingIndex: 0.93,
    avgCareLength: { male: 1.9, female: 3.5 }
  },
  'OH': {
    state: 'Ohio',
    stateCode: 'OH',
    costs: {
      nursing_home: { private_room: 89425, semi_private_room: 78920 },
      assisted_living: 48000,
      home_health: 58344,
      adult_day_care: 16900
    },
    costOfLivingIndex: 0.92,
    avgCareLength: { male: 2.2, female: 3.5 }
  },
  'OK': {
    state: 'Oklahoma',
    stateCode: 'OK',
    costs: {
      nursing_home: { private_room: 75190, semi_private_room: 66795 },
      assisted_living: 40800,
      home_health: 52728,
      adult_day_care: 13650
    },
    costOfLivingIndex: 0.87,
    avgCareLength: { male: 2.0, female: 3.7 }
  },
  'OR': {
    state: 'Oregon',
    stateCode: 'OR',
    costs: {
      nursing_home: { private_room: 108405, semi_private_room: 95550 },
      assisted_living: 62400,
      home_health: 67392,
      adult_day_care: 19500
    },
    costOfLivingIndex: 1.11,
    avgCareLength: { male: 2.2, female: 3.3 }
  },
  'PA': {
    state: 'Pennsylvania',
    stateCode: 'PA',
    costs: {
      nursing_home: { private_room: 124945, semi_private_room: 104420 },
      assisted_living: 56400,
      home_health: 60216,
      adult_day_care: 18200
    },
    costOfLivingIndex: 1.03,
    avgCareLength: { male: 2.3, female: 3.5 }
  },
  'RI': {
    state: 'Rhode Island',
    stateCode: 'RI',
    costs: {
      nursing_home: { private_room: 138970, semi_private_room: 124945 },
      assisted_living: 68400,
      home_health: 65520,
      adult_day_care: 18200
    },
    costOfLivingIndex: 1.13,
    avgCareLength: { male: 2.4, female: 3.5 }
  },
  'SC': {
    state: 'South Carolina',
    stateCode: 'SC',
    costs: {
      nursing_home: { private_room: 91520, semi_private_room: 79200 },
      assisted_living: 45600,
      home_health: 52728,
      adult_day_care: 15080
    },
    costOfLivingIndex: 0.94,
    avgCareLength: { male: 2.1, female: 3.6 }
  },
  'SD': {
    state: 'South Dakota',
    stateCode: 'SD',
    costs: {
      nursing_home: { private_room: 74825, semi_private_room: 66795 },
      assisted_living: 42000,
      home_health: 58344,
      adult_day_care: 15080
    },
    costOfLivingIndex: 0.88,
    avgCareLength: { male: 1.9, female: 3.6 }
  },
  'TN': {
    state: 'Tennessee',
    stateCode: 'TN',
    costs: {
      nursing_home: { private_room: 81030, semi_private_room: 70810 },
      assisted_living: 44400,
      home_health: 52728,
      adult_day_care: 14560
    },
    costOfLivingIndex: 0.91,
    avgCareLength: { male: 2.1, female: 3.7 }
  },
  'TX': {
    state: 'Texas',
    stateCode: 'TX',
    costs: {
      nursing_home: { private_room: 87235, semi_private_room: 75190 },
      assisted_living: 51600,
      home_health: 58344,
      adult_day_care: 17550
    },
    costOfLivingIndex: 0.95,
    avgCareLength: { male: 2.1, female: 3.5 }
  },
  'UT': {
    state: 'Utah',
    stateCode: 'UT',
    costs: {
      nursing_home: { private_room: 102325, semi_private_room: 87600 },
      assisted_living: 50400,
      home_health: 58344,
      adult_day_care: 16900
    },
    costOfLivingIndex: 1.01,
    avgCareLength: { male: 2.0, female: 3.2 }
  },
  'VT': {
    state: 'Vermont',
    stateCode: 'VT',
    costs: {
      nursing_home: { private_room: 133950, semi_private_room: 117885 },
      assisted_living: 66000,
      home_health: 62400,
      adult_day_care: 18200
    },
    costOfLivingIndex: 1.14,
    avgCareLength: { male: 2.3, female: 3.4 }
  },
  'VA': {
    state: 'Virginia',
    stateCode: 'VA',
    costs: {
      nursing_home: { private_room: 115845, semi_private_room: 97285 },
      assisted_living: 56400,
      home_health: 60216,
      adult_day_care: 18200
    },
    costOfLivingIndex: 1.06,
    avgCareLength: { male: 2.2, female: 3.4 }
  },
  'WA': {
    state: 'Washington',
    stateCode: 'WA',
    costs: {
      nursing_home: { private_room: 133950, semi_private_room: 117885 },
      assisted_living: 70800,
      home_health: 69784,
      adult_day_care: 22100
    },
    costOfLivingIndex: 1.16,
    avgCareLength: { male: 2.2, female: 3.3 }
  },
  'WV': {
    state: 'West Virginia',
    stateCode: 'WV',
    costs: {
      nursing_home: { private_room: 104785, semi_private_room: 91885 },
      assisted_living: 44400,
      home_health: 52728,
      adult_day_care: 14560
    },
    costOfLivingIndex: 0.88,
    avgCareLength: { male: 2.2, female: 3.8 }
  },
  'WI': {
    state: 'Wisconsin',
    stateCode: 'WI',
    costs: {
      nursing_home: { private_room: 100595, semi_private_room: 89425 },
      assisted_living: 54000,
      home_health: 60216,
      adult_day_care: 17550
    },
    costOfLivingIndex: 0.98,
    avgCareLength: { male: 2.1, female: 3.5 }
  },
  'WY': {
    state: 'Wyoming',
    stateCode: 'WY',
    costs: {
      nursing_home: { private_room: 82490, semi_private_room: 72270 },
      assisted_living: 50400,
      home_health: 58344,
      adult_day_care: 15600
    },
    costOfLivingIndex: 0.94,
    avgCareLength: { male: 1.9, female: 3.2 }
  }
};

// Utility functions
export function getStateCosts(stateCode: string): LTCCostData | null {
  return LTC_COST_DATABASE[stateCode] || null;
}

export function getNationalAverage(): LTCCostData {
  const states = Object.values(LTC_COST_DATABASE);
  const avgCosts = states.reduce((acc, state) => {
    acc.nursing_home.private_room += state.costs.nursing_home.private_room;
    acc.nursing_home.semi_private_room += state.costs.nursing_home.semi_private_room;
    acc.assisted_living += state.costs.assisted_living;
    acc.home_health += state.costs.home_health;
    acc.adult_day_care += state.costs.adult_day_care;
    return acc;
  }, {
    nursing_home: { private_room: 0, semi_private_room: 0 },
    assisted_living: 0,
    home_health: 0,
    adult_day_care: 0
  });

  const stateCount = states.length;
  
  return {
    state: 'National Average',
    stateCode: 'US',
    costs: {
      nursing_home: {
        private_room: Math.round(avgCosts.nursing_home.private_room / stateCount),
        semi_private_room: Math.round(avgCosts.nursing_home.semi_private_room / stateCount)
      },
      assisted_living: Math.round(avgCosts.assisted_living / stateCount),
      home_health: Math.round(avgCosts.home_health / stateCount),
      adult_day_care: Math.round(avgCosts.adult_day_care / stateCount)
    },
    costOfLivingIndex: 1.0,
    avgCareLength: { male: 2.2, female: 3.5 }
  };
}

export function getTopExpensiveStates(count: number = 10): LTCCostData[] {
  return Object.values(LTC_COST_DATABASE)
    .sort((a, b) => b.costs.nursing_home.private_room - a.costs.nursing_home.private_room)
    .slice(0, count);
}

export function getMostAffordableStates(count: number = 10): LTCCostData[] {
  return Object.values(LTC_COST_DATABASE)
    .sort((a, b) => a.costs.nursing_home.private_room - b.costs.nursing_home.private_room)
    .slice(0, count);
}