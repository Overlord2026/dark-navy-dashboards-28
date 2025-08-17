export default {
  "plans": {
    "basic":   {"name":"Basic","features":["education_access","account_link","doc_upload_basic","goals_basic","invite_pros","swag_lite","monte_carlo_lite"]},
    "premium": {"name":"Premium","features":["education_access","account_link","doc_upload_pro","vault_advanced","rmd_planner","reports","estate_advanced","tax_advanced","esign_basic","properties","goals_pro","advisor_collab"]},
    "elite":   {"name":"Elite","features":["education_access","account_link","vault_advanced","properties","estate_advanced","tax_advanced","esign_pro","governance","multi_entity","concierge","advisor_collab","reports_pro"]}
  },
  "segments": [
    {"key":"aspiring","title":"Aspiring Families","cards":[
      {"feature":"education_access","label":"Education Library"},
      {"feature":"goals_basic","label":"Set Your First Goal"},
      {"feature":"swag_lite","label":"SWAG™ Quickstart"},
      {"feature":"monte_carlo_lite","label":"Monte Carlo (Lite)"}]},
    {"key":"retirees","title":"Retirees","cards":[
      {"feature":"rmd_planner","label":"RMD Planner (Premium)"},
      {"feature":"reports","label":"Income Reports (Premium)"},
      {"feature":"beneficiaries_review","label":"Beneficiaries Review"}]},
    {"key":"hnw","title":"High-Net-Worth","cards":[
      {"feature":"vault_advanced","label":"Secure Vault (Premium/Elite)"},
      {"feature":"estate_advanced","label":"Advanced Estate (Premium/Elite)"},
      {"feature":"tax_advanced","label":"Advanced Tax (Premium/Elite)"}]},
    {"key":"uhnw","title":"Ultra-High-Net-Worth","cards":[
      {"feature":"governance","label":"Family Governance (Elite)"},
      {"feature":"multi_entity","label":"Multi-Entity (Elite)"},
      {"feature":"concierge","label":"Concierge (Elite)"}]}
  ],
  "quick_actions": [
    {"feature":"account_link","label":"Link Accounts","event":"quickAction.linkAccounts"},
    {"feature":"doc_upload_basic","label":"Upload a Document","event":"quickAction.uploadDoc"},
    {"feature":"goals_basic","label":"Create a Goal","event":"quickAction.createGoal"},
    {"feature":"swag_lite","label":"Run SWAG™","event":"quickAction.runSwag"},
    {"feature":"monte_carlo_lite","label":"Run Monte Carlo","event":"quickAction.runMonteCarlo"},
    {"feature":"invite_pros","label":"Invite a Pro","event":"quickAction.invitePro"}
  ],
  "education": {"nil_tag":"NIL","gateMarketplaceUntilTraining":true}
};