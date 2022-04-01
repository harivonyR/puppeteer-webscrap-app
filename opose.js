var aspose = aspose || {};
aspose.cells = require("aspose.cells");
//Open a designer file
var designerFile = "designer.xls";
var workbook = new aspose.cells.Workbook(designerFile);
//Set scroll bars
workbook.getSettings().setHScrollBarVisible(false);
workbook.getSettings().setVScrollBarVisible(false);
//Replace the placeholder string with new values
workbook.replace("OldInt", 100);
var newString = "Hello!";
workbook.replace("OldString", newString);
var saveOptions = new aspose.cells.XlsSaveOptions();
workbook.save("result.xls", saveOptions);