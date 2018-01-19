function main() {
    var currentAccount = AdWordsApp.currentAccount();
    var accountName = currentAccount.getName();
    
    Logger.log("Account: " + accountName);
    
     var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1yCToteUPvD6xwBFX_Xorj09tW5Fav-DCxWllG5EqlhE/edit?usp=sharing';
     var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);
     var sheet = spreadsheet.getSheets()[1];
    
     // var row = 2;
     // var range = sheet.getRange(row, 1, 1, 6);
    
     // var columnRange = sheet.getRange("A1:F1");
     // var columns = [["DisplayName", "Cost", "AverageCpm", "Ctr", "Clicks", "Impressions"]];
     // columnRange.setValues(columns);
    
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
          Logger.log("Printed Rows");
        }
      }
  }