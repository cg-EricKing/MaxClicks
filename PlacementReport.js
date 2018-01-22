function main() {
  var currentAccount = AdWordsApp.currentAccount();
  var accountName = currentAccount.getName();
  
  Logger.log("Account: " + accountName);
  
   var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1yCToteUPvD6xwBFX_Xorj09tW5Fav-DCxWllG5EqlhE/edit?usp=sharing';
   var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);
   var sheet = spreadsheet.getSheets()[0];
  
   var campaignSelector = AdWordsApp
     .campaigns()
     .withCondition("Impressions > 100")
     .forDateRange("LAST_MONTH")
     .orderBy("Clicks DESC");

 var campaignIterator = campaignSelector.get();
 while (campaignIterator.hasNext()) {
   var campaign = campaignIterator.next();
   Logger.log("Campaign: " + campaign.getName());
 }
  
   // Init variables
    var maxCpm = parseFloat(5);
    var targetCpc = parseFloat(1);
    var targetCpm = parseFloat(1.25);
    var cpmCheck = parseFloat(2);

    var campaignSelector = AdWordsApp
     .campaigns()
     .forDateRange("LAST_7_DAYS");

    var campaignIterator = campaignSelector.get();
    while (campaignIterator.hasNext()) {
      // Get campaign stats
        var campaign = campaignIterator.next();
        var campaignName = campaign.getName();
        Logger.log("Campaign Name:" + campaignName);

        var currentBiddingStrategy = campaign.getBiddingStrategyType();
        Logger.log("Current Bidding Strategy: " + currentBiddingStrategy);

        var currentDailyBudget = campaign.getBudget().getAmount();
        Logger.log("Current daily budget: " + currentDailyBudget);

        var stats = campaign.getStatsFor("LAST_7_DAYS");
        var currentCpc = stats.getAverageCpc();
        Logger.log("Current CPC: " + currentCpc);
        var currentCpm = stats.getAverageCpm();
        Logger.log("Current CPM: " + currentCpm);
      
      // Generate a report on placements
      var report = AdWordsApp.report(
      "SELECT DisplayName, Cost, AverageCpm, Ctr, Clicks, Impressions FROM PLACEMENT_PERFORMANCE_REPORT WHERE Impressions > 100 DURING LAST_7_DAYS");
      var rows = report.rows();
      while(rows.hasNext()) {
       var row = rows.next();
        sheet.appendRow([row["DisplayName"], row["Cost"], row["AverageCpm"], row["Ctr"], row["Clicks"], row["Impressions"]]);
        Logger.log("Printed 7 Day Row");
      }
      var allString = "SELECT DisplayName, Cost, AverageCpm, Ctr, Clicks, Impressions FROM PLACEMENT_PERFORMANCE_REPORT WHERE Impressions > 100 DURING LAST_30_DAYS";
      Logger.log(allString);
      var allReport = AdWordsApp.report(allString);
      
      var iter = report.rows();
      
      while(iter.hasNext()) {
        var allReportRow = iter.next();
        sheet.appendRow([
          allReportRow["DisplayName"],
          allReportRow["Cost"],
          allReportRow["AverageCpm"],
          allReportRow["Ctr"],
          allReportRow["Clicks"],
          allReportRow["Impressions"]]);
        Logger.log("Printed 30 Day Row");
      }
    }

    if(currentCpc < targetCpc) {
      Logger.log("Current Cost per Click is below Target of $1.00 - Setting bid strategy to Max Clicks");
      // campaign.bidding().setStrategy("TARGET_SPEND");
    }
    else if(currentCpm > maxCpm) {
        Logger.log("Cpm is above $5 - setting bidding strategy to VCPM");
      //  campaign.bidding().setStrategy("MANUAL_CPM");
    }
    else {
        Logger.log("Error in script");
    }
}