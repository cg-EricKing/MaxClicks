// Max Clicks – If CPC from last 7 days avg is <$1 then switch the settings to Max Clicks
// -	If Daily CPM >$5 then revert back to VCPM and give flag that CPM will be too high if applied.
// -	If Learning status is gone and the 7 days avg CPM is >$2, then make bid adjustments on 
// placements every week to reduce CPM to $1.25.

// Select current account
// Init SS
// Set init variables (Max CPM: $5, Target CPC: $1, LearningStatus: $2, Target CPM: $1.25)
// Select current campaign
    // Grab current Budget
// Get campaign stats (Average Cost Per Click "LAST_7_DAYS", Average CPM)
// Grab placement report - print to spreadsheet
// Conditional check - If CPC from last 7 days is < TargetCPC = setStrategy for campaign = "MAX_CLICKS"
// Conditional check - If CPM > $5 change bidding strategy to VCPM = set notification flag
// Conditional check - Figure out solution for script - can't do bid adjustment with library (setCpm(targetCpm))


function main() {
    // Select current account
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
        Logger.log("Account: " + accountName);

    // Init Spreadsheet
    var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1yCToteUPvD6xwBFX_Xorj09tW5Fav-DCxWllG5EqlhE/edit?usp=sharing';
    var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);
    var sheet = spreadsheet.getSheets()[0];
    // Init variables
    var maxCpm = parseFloat(5);
    var targetCpc = parseFloat(1);
    var targetCpm = parseFloat(1.25);
    var cpmCheck = parseFloat(2);

    // Select current campaign
    // Check strat type for max clicks
    var campaignSelector = AdWordsApp
        .campaigns()
        .withCondition("Status = ENABLED");

    var campaignIterator = campaignSelector.get();

    while(campaignIterator.hasNext()) {
        var campaign = campaignIterator.hasNext();

        var currentBiddingStrategy = campaign.getBiddingStrategyType();
        Logger.log("current bidding strategy: " + currentBiddingStrategy);

        var currentDailyBudget = campaign.getBudget().getAmount();
        Logger.log("current daily budget: " + currentDailyBudget);

        // Get campaign stats
        var stats = campaign.getStatsFor("LAST_7_DAYS");
        var currentCpc = stats.getAverageCpc();
        var currentCpm = stats.getAverageCpm(); // > 2.50 switch back to cpm
    }

    var reportPlacementSelector = AdWordsApp
        .placements()
        .forDateRange("LAST_7_DAYS")
        .orderBy("Ctr DSC");

        var reportPlacementIterator = reportPlacementSelector.get();

        while(reportPlacementIterator.hasNext()) {
            range = sheet.getRange(row, 1, 1, 5);

            row++

            var placement = reportPlacementIterator.next();
            AdWordsApp.select(placement);

            var aqlString = "SELECT DisplayName, Cost, Ctr, AverageCpm, Clicks FROM PLACEMENT_PERFORMANCE_REPORT DURING LAST_7_DAYS";

            var report = AdWordsApp.report(aqlString);

            var iter = report.rows();

            while(iter.hasNext()) {
                var reportRow = iter.next();

                range.setValues([[
                    reportRow["DisplayName"],
                    reportRow["Cost"],
                    reportRow["Ctr"],
                    reportRow["AverageCpm"],
                    reportRow["Clicks"]
                ]])
            }
        }

    // // Select placements to adjust cpm
    // var placementSelector = AdWordsApp.display()
    //     .placements()
    //     .withCondition("Status = ENABLED")
    //     .forDateRange("LAST_7_DAYS");


    // var placementIterator = placementSelector.get();

    // while(placementIterator.hasNext()) {
    //     var placement = placementIterator.next();
    //     var placementStats = placement.getStatsFor("LAST_7_DAYS");
    //     var placementCtr = placementStats.getCtr();
    //     var placementCpm = placementStats.getAverageCpm();
    //     var placementCost = placementStats.getCost();
    //     var placementImpressions = placementStats.getImpressions();
    //     var placementClicks = placementStats.getClicks();
    //     var placementAllTime = placement.getStatsFor("ALL_TIME");
    //     var placementCtrAll = placementAllTime.getCtr();
    //     var placementCpmAll = placementAllTime.getAverageCpm();
    //     var placementCostAll = placementAllTime.getCost();
    //     var placementImpressionsAll = placementAllTime.getImpressions();
    //     var placementClicksAll = placementAllTime.getClicks();

    //     // Init Range
    //     var placementRow = 5;
    //     var placementColumn = {
    //         Ctr: 2,
    //         Cpm: 3,
    //         Cost: 4,
    //         Impressions: 5,
    //         Clicks: 6,
    //         AllCtr: 7,
    //         AllCpm: 8,
    //         AllCost: 9,
    //         AllImpressions: 10,
    //         AllClicks: 11
    //     }
    //     var placementArray = [[placementCtr, placementCpm, placementCost, placementImpressions, placementClicks,
    //     placementCtrAll, placementCpmAll, placementCostAll, placementImpressionsAll, placementClicksAll]];
    //     Logger.log("Placement: " + placement + " " + placementArray);
    //     // Print placements to SS - Highlight placements with CTR < .10% as well as placements with Avg. CPM > $1.25
    //     // Calculate Bid Adjustment % on Spreadsheet - highlight in green.
    // }


    // Conditional check - If CPC from last 7 days is < TargetCPC = setStrategy for campaign = "MAX_CLICKS"
    // Conditional check - If CPM > $5 change bidding strategy to VCPM = set notification flag
    // Conditional check - Placments bid adjustments (research)

    if(currentCpc < targetCpc) {
        Logger.log("Current Cost per Click is below Target of $1.00 - Setting bid strategy to Max Clicks");
        // campaign.bidding().setStrategy("TARGET_SPEND");
    }
    else if(currentCpm > maxCpm) {
        Logger.log("Cpm is above $5 - setting bidding strategy to VCPM");
       //  campaign.bidding().setStrategy("MANUAL_CPM");
    }
    else if(currentCpm > cpmCheck && currentCpm < maxCpm) {
        Logger.log("Cpm is above $2, but not above $5 - set Cost per Click down to $1.25");
    }
    else {
        Logger.log("Error in script");
    }
}

// function main() {
//     var accountIterator = MccApp.accounts().withLimit(50).get();
//     var spreadsheet = SpreadsheetApp.openByUrl('INSERT_SPREADSHEET_URL_HERE');
//     var sheet = spreadsheet.getSheetByName("INSERT_SHEET_NAME_HERE");
    
//     //Append the row header if sheet is empty
//     if (sheet.getLastRow() == 0) {
//       sheet.appendRow(['Id','DisplayName','Criteria','FinalUrls','Status','Clicks','Impressions','Conversions','Cost']);
//     }
    
//     while (accountIterator.hasNext()) {
//       var account = accountIterator.next();
//       MccApp.select(account);
      
//       //Please edit the columns and the date range based on your requirements
//       var report = AdWordsApp.report(
//         "SELECT Id, DisplayName,Criteria,FinalUrls,Status,Clicks,Impressions,Conversions,Cost" +
//         " FROM PLACEMENT_PERFORMANCE_REPORT" +
//         " WHERE Impressions > 0 DURING LAST_MONTH");
      
//       var rows = report.rows();
//       while (rows.hasNext()) {
//         var row = rows.next();
//         sheet.appendRow([row['Id'],row['DisplayName'],row['Criteria'],row['FinalUrls'],row['Status']
//                          ,row['Clicks'],row['Impressions'],row['Conversions'], row['Cost']]);
//       }
//       Logger.log("Done with CID: " + account.getCustomerId());
//     }
//   }