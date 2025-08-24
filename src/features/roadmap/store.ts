import type { Scenario, Review } from './types';

export async function createScenario(s: Scenario): Promise<Scenario> {
  // Store scenario in localStorage for demo
  const scenarios = JSON.parse(localStorage.getItem('roadmap_scenarios') || '[]');
  scenarios.push(s);
  localStorage.setItem('roadmap_scenarios', JSON.stringify(scenarios));
  return s;
}

export async function listScenarios(householdId: string): Promise<Scenario[]> {
  const scenarios = JSON.parse(localStorage.getItem('roadmap_scenarios') || '[]');
  return scenarios.filter((s: Scenario) => s.householdId === householdId);
}

export async function createReview(r: Review): Promise<Review> {
  // Store review in localStorage for demo
  const reviews = JSON.parse(localStorage.getItem('roadmap_reviews') || '[]');
  reviews.push(r);
  localStorage.setItem('roadmap_reviews', JSON.stringify(reviews));
  return r;
}

export async function listReviews(scenarioId: string): Promise<Review[]> {
  const reviews = JSON.parse(localStorage.getItem('roadmap_reviews') || '[]');
  return reviews.filter((r: Review) => r.scenarioId === scenarioId);
}