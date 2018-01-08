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


function main() {
    // Select current account
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
        Logger.log("Account: " + accountName);
    
    // Init variables
    var maxCpm = 5;
    var targetCpc = 1;
    var targetCpm = 1.25;
    var cpmCheck = 2;

    // Select current campaign
    var campaignSelector = AdWordsApp
        .campaigns()
        .withCondition("Status = ENABLED");

    var campaignIterator = campaignSelector.get();

    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.hasNext();

        var currentBiddingStrategy = campaign.getBiddingStrategyType();
        Logger.log("current bidding strategy: " + currentBiddingStrategy);

        // Get campaign stats
        var stats = campaign.getStatsFor("LAST_7_DAYS");
        var currentCpc = stats.getAverageCpc();
        var currentCpm = stats.getAverageCpm();
    }

    // Select ad group to adjust cpm
    var adGroupSelector = AdWordApp
        .adGroups();

    var adGroupIterator = adGroupSelector.get();
    while(adGroupIterator.hasNext()) {
        var adGroup = adGroupIterator.next();
    }

    // Conditional check - If CPC from last 7 days is < TargetCPC = setStrategy for campaign = "MAX_CLICKS"
    // Conditional check - If CPM > $5 change bidding strategy to VCPM = set notification flag
    // Conditional check - If Learning status is gone && CPM > $2 set CPC down to Target CPM each week.

    if(currentCpc < targetCpc) {
        Logger.log("Current Cost per Click is below Target of $1.00 - Setting bid strategy to Max Clicks");
        campaign.bidding().setStrategy("TARGET_SPEND");
    }
    else if(currentCpm > maxCpm) {
        Logger.log("Cpm is above $5 - setting bidding strategy to VCPM");
        campaign.bidding().setStrategy("MANUAL_CPM");
    }
    else if(currentCpm > cpmCheck && currentCpm < maxCpm) {
        Logger.log("Cpm is above $2, but not above $5 - set Cost per Click down to $1.25");
        adGroup.setCpm(targetCpm);
    }
    else {
        Logger.log("Error in script");
    }
}