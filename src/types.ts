/**
 * Types for Life Capital AI - The ultimate life asset management platform
 */

export interface OnboardingData {
  // Datos personales
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  birthCountry: string;
  province: string;
  city: string;
  residenceCountry: string;
  areaType: 'urban' | 'rural';
  civilStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'stable_pair';
  childrenCount: number;
  profession: string;
  educationLevel: string;
  annualIncome: number;
  religion?: string;
  ethnicity?: string;
  languages: string[];

  // Datos físicos
  height: number; // cm
  weight: number; // kg
  waistCircumference: number; // cm
  systolicPressure: number;
  diastolicPressure: number;
  heartRate: number;
  oxygenSaturation: number;
  sittingHours: number; // por día
  standingHours: number; // por día
  physicalActivityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
  vo2Max?: number;
  restingHeartRate: number;

  // Salud
  hypertension: boolean;
  diabetes: boolean;
  cholesterol: boolean;
  cardiovascularDisease: boolean;
  cancer: boolean;
  respiratoryDisease: boolean;
  medication: string;
  familyHistory: string;
  surgeries: string;
  allergies: string;

  // Salud mental
  chronicPain: boolean;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high' | 'extreme';
  ansiedadLevel: 'none' | 'mild' | 'moderate' | 'severe';
  depresionLevel: 'none' | 'mild' | 'moderate' | 'severe';

  // Hábitos
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  smoking: 'never' | 'former' | 'active';
  vaping: boolean;
  drugsConsumption: boolean;
  weeklyExerciseHours: number;
  nutritionQuality: 'poor' | 'average' | 'good' | 'pristine'; // frutas, verduras, balance
  sugarConsumption: 'low' | 'moderate' | 'high';
  dailyWaterLitres: number;
  caffeineIntake: 'none' | 'moderate' | 'high';
  socialMediaHours: number; // por día
  streamingHours: number; // por día
  gamingHours: number; // por día
  readingHoursWeekly: number;
  meditationMinutesWeekly: number;
  outdoorHoursWeekly: number;
  timeWithFriendsHoursWeekly: number;
  timeWithChildrenHoursWeekly: number;
  timeWithPartnerHoursWeekly: number;
  timeWithParentsHoursWeekly: number;
  timeWithPetsHoursWeekly: number;

  // Finanzas & Trabajo
  hoursWorkedWeekly: number;
  workType: 'office' | 'manual' | 'remote' | 'hybrid' | 'field';
  homeOfficePercentage: number;
  businessTravelDaysYearly: number;
  commuteHoursDaily: number;
  vacationDaysYearly: number;
  financialGoals: string;
  desiredRetirementAge: number;
}

export interface ProjectionResult {
  estimatedLifeExpectancy: number; // en años
  healthyLifeExpectancy: number; // en años
  remainingYears: number;
  remainingHealthyYears: number;
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
  currentEnergyScore: number; // 0 - 100
  lifeScore: number; // 0 - 100
  timeDistribution: {
    category: string;
    percentage: number;
    hours: number;
    color: string;
  }[];
  riskFactorsAdjustments: {
    factor: string;
    impactYears: number;
    type: 'positive' | 'negative';
    description: string;
  }[];
}

export interface CoachInsights {
  mainDecisionOfDay: string;
  criticalHabitToChange: {
    habit: string;
    reason: string;
    impactYears: number;
  };
  timeLeakActivity: {
    activity: string;
    hoursWastedYearly: number;
    reclaimAdvice: string;
  };
  highValueConnection: string;
  objectivesAlignment: string;
  powerfulQuestions: string[];
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'travel' | 'learning' | 'professional' | 'family' | 'health' | 'other';
  targetValue: number; // ej: 50 países, 500 libros, 10 años
  currentProgress: number;
  estimatedHoursRequired: number;
}

export interface LifeReminder {
  id: string;
  text: string;
  category: 'warning' | 'tip' | 'family' | 'health';
  timestamp: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  features: string[];
  audience: string;
  recommended?: boolean;
}

export interface LoggedDailyAction {
  id: string;
  date: string; // YYYY-MM-DD
  actionKey: string;
  title: string;
  hoursAdded: number;
  category: 'physical' | 'mental' | 'social' | 'longevity_habit';
  notes?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  onboardingData: OnboardingData | null;
  projection: ProjectionResult | null;
  createdAt: string;
}

