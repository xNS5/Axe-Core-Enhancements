

/*
* // fs.appendFileSync('result.csv', `,\"${id}\",\"${wcag}\",\"${description}\",\"${message}\",${impact},\"${relCode}\",,${sampleCode}\n`, callBack2);  //add WCAG and Remediation if needed
* // console.log(`\"${id}\",\"${wcag}\",\"${description}\",\"${message}\",${impact},\"${relCode}\",,\"${sampleCode}\"\n`);
* // sampleCode = val.target[0].replace(/\s\s+/g, ' ').replace(/,/g, '\",\"');
* // id = "=hyperlink(\"\"" + violations[j].helpUrl + "\"\"\, \"\"" + violations[j].id + "\"\")";
* */
function createFile(ace_result){
/*  let id;
  let wcag;
  let description;
  let relCode;
  let impact;
  let sampleCode;
  let message;*/
  let ret = [];
  function populate(violations){
    if(violations.length > 0){
      let count = 0;
        for(let violation of violations){
          ret.push(["WCAG SC"],[`"${violation.tags}"\r\n`]);
          for(let node of violation.nodes){
            /*
            * count = violation count
            * wcag = tags representing WCAG violations
            * description = description of the WCAG violation
            * failureSummary = how to fix the violation
            * impact = seriousness of the violation
            * code snippet of the area that's responsible for the violation
            * */
            ret.push([`"${count+=1}"`,/*`${violation.tags}`,*/`"${violation.description}"`,`"${violation.impact}"`,`"${node.failureSummary}"`,`"${node.html.replaceAll(/\s\s+/g, ' ').replaceAll(/[,]/g, '').replaceAll(/\n/g, '')}"\r\n`]);
          }
        }
    }
  }

  // let fs = require('fs');
  // fs.writeFileSync('result.csv', "", callBack);

  for(let i = 0; i < ace_result.length; i++){
    let url = ace_result[i].url;
    // let sections = ",Issue Id,WCAG SC,Description,Message,Impact,Relevant Code,Remediation,Sample Code";
    ret.push([`"${url}"`, "Issue Id","Description","Message","Impact","Relevant Code","Remediation","Sample Code\r\n"]);
    ret.push(["Violations:"]);
    populate(ace_result[i].violations);
    ret.push(["Incomplete:"]);
    populate(ace_result[i].incomplete);
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
