
function createFile(ace_result){
  let id;
  let wcag;
  let description;
  let relCode;
  let impact;
  let sampleCode;
  let message;
  const ret = [];
  function populate(violations){
    if(violations.length > 0){
      for(let j = 0; j < violations.length; j++){
        for(let val of violations[j].nodes){
          id = "=hyperlink(\"\"" + violations[j].helpUrl + "\"\"\, \"\"" + violations[j].id + "\"\")";
          wcag= violations[j].tags.join(', ');
          description = violations[j].description;
          relCode = val.html.replaceAll(/\s\s+/g, ' ').replaceAll(/[,]/g, ''); // I had to remove commas from the relevant code because it was interfering with CSV creation
          impact = violations[j].impact;
          // sampleCode = val.target[0].replace(/\s\s+/g, ' ').replace(/,/g, '\",\"');
          message = val.failureSummary;
          // console.log(`\"${id}\",\"${wcag}\",\"${description}\",\"${message}\",${impact},\"${relCode}\",,\"${sampleCode}\"\n`);
          ret.push(`\"${id}\",\"${wcag}\",\"${description}\",\"${message}\",${impact},\"\"${relCode}\"\"\n`);
          // fs.appendFileSync('result.csv', `,\"${id}\",\"${wcag}\",\"${description}\",\"${message}\",${impact},\"${relCode}\",,${sampleCode}\n`, callBack2);  //add WCAG and Remediation if needed
        }
      }
    }
  }

  // let fs = require('fs');
  // fs.writeFileSync('result.csv', "", callBack);

  for(let result of ace_result){
    let url = result.url;
    let sections = ",Issue Id,WCAG SC,Description,Message,Impact,Relevant Code,Remediation,Sample Code";
    ret.push(`${url}\n\n${sections}\nViolations:\n`);
    populate(result.violations);
    ret.push("Incomplete:\n");
    populate(result.incomplete);
    // fs.appendFileSync('result.csv', `${url}\n\n${sections}\n`, callBack);
    // fs.appendFileSync('result.csv', "Violations:\n", callBack2);
    // populate(result.violations);
    // fs.appendFileSync('result.csv', "Incomplete:\n", callBack2);
    // populate(result.incomplete);
    // fs.appendFileSync('result.csv', "\n\n", callBack2);
  }
  return ret;
}

// function callBack(err){
//   if(err) throw err;
//   console.log('File is created sucessfully');
// }
//
// function callBack2(err){
//   if(err) throw err;
//   // console.log('File appended successfully');
// }

module.exports = createFile;
