/**
* createFile
 *
 *
* */


function createFile(ace_result){
  let ret = [];
  function populate(violations){
      let count = 0;
        for(let violation of violations){
          let primary = "";
           let secondary = " ";
           if(violation.tags.length > 1){
            primary = violation.tags[0];
            violation.tags.splice(0,1);
            secondary = violation.tags;
           }else{
             primary = violation.tags[0];
           }
           primaryLinked = "=hyperlink(\"\"" + violation.helpUrl + "\"\"\, \"\"" + primary + "\"\")";
          for(let node of violation.nodes){
            ret.push(['',`"${count+=1}"`,`"${primaryLinked}"`,`"${secondary}"`,`"${violation.impact}"`,`"${violation.description}"`,`"${node.html.replace(/\s\s+/g, ' ').replace(/[,]/g, '').replace(/\n/g, '')}"`,'',`"${node.failureSummary}",\r\n`]);
          }
        }
  }

  for(let i = 0; i < ace_result.length; i++){
    sails.log(ace_result);
    let url = ace_result[i].getURL();
    let pageTitle = ace_result[i].getTitle();
    ret.push([`"${url}"`,`Resolution: ${ace_result[i].getScreenWidth()}x${ace_result[i].getScreenHeight()}`,`\r\n`]);
    ret.push([`"${pageTitle}"\r\n\r\n`,'', "Issue Id","WCAG SC","WCAG SC Secondary","Priority","Description","Relevant Code","Impact","Remediation","Sample Code\r\n"/*,"Screen Resolution\r\n"*/]);
    ret.push(["Violations:\r\n"]);
    populate(ace_result[i].getViolations());
    ret.push(["Incomplete:\r\n"]);
    populate(ace_result[i].getIncomplete());
  }
  return ret;
}

module.exports = createFile;
