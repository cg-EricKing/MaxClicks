// Max Clicks – If CPC from last 7 days avg is <$1 then switch the settings to Max Clicks
// -	If Daily CPM >$5 then revert back to VCPM and give flag that CPM will be too high if applied.
// -	If Learning status is gone and the 7 days avg CPM is >$2, then make bid adjustments on 
// placements every week to reduce CPM to $1.25.

// Select current account
// Init SS
// Set init variables (Max CPM: $5, Target CPC: $1, LearningStatus: $2, Target CPM: $1.25)
// Select current campaign
// Get campaign stats (Average Cost Per Click "LAST_7_DAYS", Average CPM)
// Check learning status? -research adwords
// Conditional check - If CPC from last 7 days is < TargetCPC = setStrategy for campaign = "MAX_CLICKS"
// Conditional check - If CPM > $5 change bidding strategy to VCPM = set notification flag
// Conditional check - If Learning status is gone && CPM > $2 set CPC down to Target CPM each week.
